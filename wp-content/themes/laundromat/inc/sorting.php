<?php
/**
 * Drag & Drop Sorting for Custom Post Types
 * Adds sortable functionality directly in post list tables
 *
 * @package Laundromat
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Sortable post types configuration
 */
function laundromat_get_sortable_post_types()
{
    return [
        'locations',
        'tips',
        'instructions',
        'faqs',
        'services',
        'about_items',
        'reviews',
    ];
}

/**
 * Enqueue scripts for sortable post list
 */
add_action('admin_enqueue_scripts', 'laundromat_enqueue_sortable_scripts');

function laundromat_enqueue_sortable_scripts($hook)
{
    global $typenow;

    // Only on post list pages for sortable types
    if ($hook !== 'edit.php') {
        return;
    }

    $sortable_types = laundromat_get_sortable_post_types();
    if (!in_array($typenow, $sortable_types)) {
        return;
    }

    wp_enqueue_script('jquery-ui-sortable');
}

/**
 * Add sortable functionality to post list table
 */
add_action('admin_footer-edit.php', 'laundromat_sortable_list_scripts');

function laundromat_sortable_list_scripts()
{
    global $typenow;

    $sortable_types = laundromat_get_sortable_post_types();
    if (!in_array($typenow, $sortable_types)) {
        return;
    }

    $nonce = wp_create_nonce('laundromat_sort_order');
    ?>
    <style>
        /* Drag handle */
        .wp-list-table tbody tr {
            cursor: grab;
        }
        .wp-list-table tbody tr:active {
            cursor: grabbing;
        }

        /* Dragging state */
        .wp-list-table tbody tr.ui-sortable-helper {
            background: #fff !important;
            box-shadow: 0 3px 15px rgba(0,0,0,0.2);
            display: table;
            width: 100%;
        }
        .wp-list-table tbody tr.ui-sortable-helper td {
            border-top: 1px solid #c3c4c7;
        }

        /* Placeholder */
        .wp-list-table tbody tr.sortable-placeholder {
            visibility: visible !important;
            background: #f0f6fc !important;
        }
        .wp-list-table tbody tr.sortable-placeholder td {
            border: 2px dashed #2271b1 !important;
            background: transparent !important;
        }

        /* Order column */
        .column-menu_order {
            width: 70px;
            text-align: center;
        }
        .column-menu_order .order-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 28px;
            height: 28px;
            background: #f0f0f1;
            border-radius: 4px;
            font-weight: 600;
            font-size: 12px;
            color: #50575e;
        }

        /* Save notification */
        .laundromat-sort-notice {
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 12px 20px;
            background: #1d2327;
            color: #fff;
            border-radius: 4px;
            font-size: 13px;
            z-index: 99999;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }
        .laundromat-sort-notice.visible {
            opacity: 1;
            transform: translateY(0);
        }
        .laundromat-sort-notice.success {
            background: #00a32a;
        }
        .laundromat-sort-notice.error {
            background: #d63638;
        }
        .laundromat-sort-notice .spinner {
            float: none;
            margin: 0;
            filter: brightness(0) invert(1);
        }

        /* Drag hint */
        .laundromat-drag-hint {
            background: #f0f6fc;
            border: 1px solid #c3c4c7;
            border-radius: 4px;
            padding: 10px 15px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #1d2327;
        }
        .laundromat-drag-hint .dashicons {
            color: #2271b1;
        }
    </style>

    <script>
    jQuery(document).ready(function($) {
        var $table = $('#the-list');
        var $notice = $('<div class="laundromat-sort-notice"><span class="spinner is-active"></span><span class="text"><?php echo esc_js(__('Saving order...', 'laundromat')); ?></span></div>');
        $('body').append($notice);

        // Add hint above table
        var $hint = $('<div class="laundromat-drag-hint"><span class="dashicons dashicons-move"></span><span><?php echo esc_js(__('Drag and drop rows to reorder. Changes save automatically.', 'laundromat')); ?></span></div>');
        $('.wp-list-table').before($hint);

        // Initialize sortable
        $table.sortable({
            items: 'tr:not(.no-items)',
            axis: 'y',
            helper: function(e, tr) {
                var $originals = tr.children();
                var $helper = tr.clone();
                $helper.children().each(function(index) {
                    $(this).width($originals.eq(index).outerWidth());
                });
                return $helper;
            },
            placeholder: 'sortable-placeholder',
            forcePlaceholderSize: true,
            start: function(e, ui) {
                // Set placeholder height
                ui.placeholder.height(ui.helper.outerHeight());
                // Add cells to placeholder
                var cells = '';
                ui.helper.children().each(function() {
                    cells += '<td></td>';
                });
                ui.placeholder.html('<td colspan="' + ui.helper.children().length + '"></td>');
            },
            update: function(e, ui) {
                saveOrder();
            }
        });

        function saveOrder() {
            // Show saving notice
            $notice.removeClass('success error').addClass('visible');
            $notice.find('.text').text('<?php echo esc_js(__('Saving order...', 'laundromat')); ?>');
            $notice.find('.spinner').show();

            // Collect order
            var order = [];
            $table.find('tr').each(function() {
                var id = $(this).attr('id');
                if (id && id.indexOf('post-') === 0) {
                    order.push(id.replace('post-', ''));
                }
            });

            // Save via AJAX
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'laundromat_save_sort_order',
                    post_type: '<?php echo esc_js($typenow); ?>',
                    order: order,
                    nonce: '<?php echo $nonce; ?>'
                },
                success: function(response) {
                    $notice.find('.spinner').hide();
                    if (response.success) {
                        $notice.addClass('success');
                        $notice.find('.text').text('<?php echo esc_js(__('Order saved!', 'laundromat')); ?>');
                        updateOrderNumbers();
                    } else {
                        $notice.addClass('error');
                        $notice.find('.text').text('<?php echo esc_js(__('Error saving order', 'laundromat')); ?>');
                    }
                    hideNotice();
                },
                error: function() {
                    $notice.find('.spinner').hide();
                    $notice.addClass('error');
                    $notice.find('.text').text('<?php echo esc_js(__('Error saving order', 'laundromat')); ?>');
                    hideNotice();
                }
            });
        }

        function updateOrderNumbers() {
            $table.find('tr').each(function(index) {
                $(this).find('.column-menu_order .order-badge').text(index);
            });
        }

        function hideNotice() {
            setTimeout(function() {
                $notice.removeClass('visible');
            }, 2000);
        }
    });
    </script>
    <?php
}

/**
 * AJAX handler for saving sort order
 */
add_action('wp_ajax_laundromat_save_sort_order', 'laundromat_ajax_save_sort_order');

function laundromat_ajax_save_sort_order()
{
    // Verify nonce
    if (!wp_verify_nonce($_POST['nonce'] ?? '', 'laundromat_sort_order')) {
        wp_send_json_error(['message' => 'Invalid nonce']);
    }

    // Check permissions
    if (!current_user_can('edit_posts')) {
        wp_send_json_error(['message' => 'Permission denied']);
    }

    $post_type = sanitize_text_field($_POST['post_type'] ?? '');
    $order = $_POST['order'] ?? [];

    // Validate post type
    $sortable_types = laundromat_get_sortable_post_types();
    if (!in_array($post_type, $sortable_types)) {
        wp_send_json_error(['message' => 'Invalid post type']);
    }

    // Update menu_order for each post
    foreach ($order as $index => $post_id) {
        $post_id = intval($post_id);
        if ($post_id > 0) {
            wp_update_post([
                'ID' => $post_id,
                'menu_order' => $index,
            ]);
        }
    }

    wp_send_json_success(['message' => 'Order saved']);
}

/**
 * Add "Order" column to post type list tables
 */
add_action('admin_init', 'laundromat_add_order_columns');

function laundromat_add_order_columns()
{
    $sortable_types = laundromat_get_sortable_post_types();

    foreach ($sortable_types as $post_type) {
        add_filter("manage_{$post_type}_posts_columns", 'laundromat_add_order_column');
        add_action("manage_{$post_type}_posts_custom_column", 'laundromat_render_order_column', 10, 2);
        add_filter("manage_edit-{$post_type}_sortable_columns", 'laundromat_make_order_column_sortable');
    }
}

function laundromat_add_order_column($columns)
{
    $new_columns = [];
    foreach ($columns as $key => $value) {
        if ($key === 'title') {
            $new_columns['menu_order'] = __('Order', 'laundromat');
        }
        $new_columns[$key] = $value;
    }
    return $new_columns;
}

function laundromat_render_order_column($column, $post_id)
{
    if ($column === 'menu_order') {
        $order = get_post_field('menu_order', $post_id);
        echo '<span class="order-badge">' . intval($order) . '</span>';
    }
}

function laundromat_make_order_column_sortable($columns)
{
    $columns['menu_order'] = 'menu_order';
    return $columns;
}

