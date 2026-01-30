<?php
/**
 * Homepage Settings Page
 * Improved UX/UI with drag-and-drop sorting
 *
 * @package Laundromat
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get available languages from Polylang (reuse from options-page if available)
 */
if (!function_exists('laundromat_get_polylang_languages')) {
    function laundromat_get_polylang_languages()
    {
        if (!function_exists('pll_languages_list')) {
            return [['slug' => 'en', 'name' => 'English']];
        }

        $languages = pll_languages_list(['fields' => []]);
        if (empty($languages)) {
            return [['slug' => 'en', 'name' => 'English']];
        }

        return array_map(function ($lang) {
            return [
                'slug' => $lang->slug,
                'name' => $lang->name,
            ];
        }, $languages);
    }
}

/**
 * Add Homepage Settings Page to Admin Menu
 */
add_action('admin_menu', 'laundromat_add_homepage_settings_page');

function laundromat_add_homepage_settings_page()
{
    add_menu_page(
        __('Homepage Settings', 'laundromat'),
        __('Homepage Settings', 'laundromat'),
        'manage_options',
        'laundromat-homepage-settings',
        'laundromat_homepage_settings_page_callback',
        'dashicons-admin-home',
        25
    );
}

/**
 * Enqueue scripts for homepage settings
 */
add_action('admin_enqueue_scripts', 'laundromat_homepage_settings_scripts');

function laundromat_homepage_settings_scripts($hook)
{
    if ($hook !== 'toplevel_page_laundromat-homepage-settings') {
        return;
    }
    wp_enqueue_script('jquery-ui-sortable');
}

/**
 * Sanitize Homepage Tips Selection
 */
function laundromat_sanitize_homepage_tips($input)
{
    if (!is_array($input)) {
        return [];
    }

    // Convert to integers and ensure they are valid tip IDs
    $sanitized = array_map('intval', $input);
    $sanitized = array_filter($sanitized, function ($id) {
        return $id > 0 && get_post_type($id) === 'tips';
    });

    return array_values($sanitized);
}

/**
 * Homepage Settings Page Callback
 */
function laundromat_homepage_settings_page_callback()
{
    if (!current_user_can('manage_options')) {
        return;
    }

    $languages = laundromat_get_polylang_languages();
    $polylang_active = function_exists('pll_get_post_language');

    // Handle form submission
    if (isset($_POST['submit']) && check_admin_referer('laundromat_homepage_tips_nonce')) {
        foreach ($languages as $lang) {
            $option_key = 'laundromat_homepage_tips_' . $lang['slug'];
            $tips_data = isset($_POST[$option_key]) ? $_POST[$option_key] : [];
            $sanitized = laundromat_sanitize_homepage_tips($tips_data);
            update_option($option_key, $sanitized);
        }
        echo '<div class="notice notice-success is-dismissible"><p>' . __('Settings saved successfully!', 'laundromat') . '</p></div>';
    }

    // Get current selection for display
    $selection_info = [];
    foreach ($languages as $lang) {
        $selected_tips = get_option('laundromat_homepage_tips_' . $lang['slug'], []);
        $count = is_array($selected_tips) ? count($selected_tips) : 0;
        $selection_info[] = sprintf('%s: %d', strtoupper($lang['slug']), $count);
    }

    // Get active language from POST or default to first
    $active_lang = isset($_POST['active_lang']) ? sanitize_text_field($_POST['active_lang']) : $languages[0]['slug'];

    ?>
    <div class="wrap laundromat-homepage-settings">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

        <p class="description"><?php _e('Select and reorder tips for the homepage. Drag items in the "Selected" panel to change display order. If no tips are selected, all published tips will be shown.', 'laundromat'); ?></p>

        <form method="post" action="">
            <?php wp_nonce_field('laundromat_homepage_tips_nonce'); ?>
            <input type="hidden" name="active_lang" id="active_lang" value="<?php echo esc_attr($active_lang); ?>">

            <h2 class="nav-tab-wrapper laundromat-lang-tabs">
                <?php foreach ($languages as $index => $lang) : ?>
                    <a href="#" class="nav-tab <?php echo $lang['slug'] === $active_lang ? 'nav-tab-active' : ''; ?>" data-lang="<?php echo esc_attr($lang['slug']); ?>">
                        <?php echo esc_html($lang['name']); ?>
                        <span class="badge" data-lang="<?php echo esc_attr($lang['slug']); ?>">
                            <?php
                            $selected = get_option('laundromat_homepage_tips_' . $lang['slug'], []);
                            echo is_array($selected) ? count($selected) : 0;
                            ?>
                        </span>
                    </a>
                <?php endforeach; ?>
            </h2>

                <!-- Tab Content -->
                <?php foreach ($languages as $index => $lang) :
                    $option_key = 'laundromat_homepage_tips_' . $lang['slug'];
                    $selected_tips = get_option($option_key, []);
                    if (!is_array($selected_tips)) {
                        $selected_tips = [];
                    }

                    // Fetch all tips for this language
                    $tips_args = [
                        'post_type' => 'tips',
                        'posts_per_page' => -1,
                        'orderby' => 'title',
                        'order' => 'ASC',
                        'post_status' => 'publish',
                    ];
                    if ($polylang_active) {
                        $tips_args['lang'] = $lang['slug'];
                    }
                    $all_tips = get_posts($tips_args);

                    // Separate available and selected
                    $tips_by_id = [];
                    foreach ($all_tips as $tip) {
                        $tips_by_id[$tip->ID] = $tip;
                    }

                    // Build selected list preserving order
                    $selected_list = [];
                    foreach ($selected_tips as $tip_id) {
                        if (isset($tips_by_id[$tip_id])) {
                            $selected_list[] = $tips_by_id[$tip_id];
                        }
                    }

                    // Available = all minus selected
                    $available_list = array_filter($all_tips, function ($tip) use ($selected_tips) {
                        return !in_array($tip->ID, $selected_tips);
                    });
                ?>
                <div class="lang-content <?php echo $lang['slug'] === $active_lang ? 'active' : ''; ?>" data-lang="<?php echo esc_attr($lang['slug']); ?>">
                    <?php if (empty($all_tips)) : ?>
                        <div class="empty-state">
                            <span class="dashicons dashicons-info"></span>
                            <p><?php printf(__('No tips found for %s. Create some tips first.', 'laundromat'), esc_html($lang['name'])); ?></p>
                            <a href="<?php echo admin_url('post-new.php?post_type=tips'); ?>" class="button button-primary"><?php _e('Create Tip', 'laundromat'); ?></a>
                        </div>
                    <?php else : ?>
                        <div class="tips-panels">
                            <!-- Available Tips Panel -->
                            <div class="tips-panel available-panel">
                                <div class="panel-header">
                                    <h3><?php _e('Available Tips', 'laundromat'); ?></h3>
                                    <span class="count"><?php echo count($available_list); ?></span>
                                </div>
                                <div class="panel-actions">
                                    <input type="text" class="search-tips" placeholder="<?php _e('Search...', 'laundromat'); ?>" data-lang="<?php echo esc_attr($lang['slug']); ?>">
                                    <button type="button" class="button add-all-tips" data-lang="<?php echo esc_attr($lang['slug']); ?>"><?php _e('Add All', 'laundromat'); ?></button>
                                </div>
                                <ul class="tips-list available-tips" data-lang="<?php echo esc_attr($lang['slug']); ?>">
                                    <?php foreach ($available_list as $tip) : ?>
                                        <?php echo laundromat_render_tip_item($tip, $option_key, false); ?>
                                    <?php endforeach; ?>
                                </ul>
                            </div>

                            <!-- Selected Tips Panel -->
                            <div class="tips-panel selected-panel">
                                <div class="panel-header">
                                    <h3><?php _e('Selected Tips', 'laundromat'); ?> <small>(<?php _e('drag to reorder', 'laundromat'); ?>)</small></h3>
                                    <span class="count selected-count" data-lang="<?php echo esc_attr($lang['slug']); ?>"><?php echo count($selected_list); ?></span>
                                </div>
                                <div class="panel-actions">
                                    <button type="button" class="button remove-all-tips" data-lang="<?php echo esc_attr($lang['slug']); ?>"><?php _e('Remove All', 'laundromat'); ?></button>
                                </div>
                                <ul class="tips-list selected-tips" data-lang="<?php echo esc_attr($lang['slug']); ?>">
                                    <?php if (empty($selected_list)) : ?>
                                        <li class="empty-placeholder"><?php _e('Click + to add tips here', 'laundromat'); ?></li>
                                    <?php endif; ?>
                                    <?php foreach ($selected_list as $tip) : ?>
                                        <?php echo laundromat_render_tip_item($tip, $option_key, true); ?>
                                    <?php endforeach; ?>
                                </ul>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
                <?php endforeach; ?>

            <?php submit_button(__('Save Homepage Settings', 'laundromat')); ?>
        </form>
    </div>

    <style>
    /* Standard WordPress admin styling */
    .laundromat-homepage-settings {
        max-width: 1200px;
    }

    /* Language Tabs - using WP nav-tab style */
    .laundromat-lang-tabs {
        margin: 0;
    }
    .laundromat-lang-tabs .nav-tab {
        cursor: pointer;
    }
    .laundromat-lang-tabs .nav-tab .badge {
        background: #dcdcde;
        color: #50575e;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 11px;
        margin-left: 5px;
    }
    .laundromat-lang-tabs .nav-tab-active .badge {
        background: #2271b1;
        color: #fff;
    }

    /* Tab Content */
    .lang-content {
        display: none;
        padding: 15px 0;
    }
    .lang-content.active {
        display: block;
    }

    /* Empty State */
    .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #646970;
        background: #f6f7f7;
        border: 1px solid #c3c4c7;
    }
    .empty-state .dashicons {
        font-size: 36px;
        width: 36px;
        height: 36px;
        color: #c3c4c7;
        margin-bottom: 10px;
    }

    /* Two Panel Layout */
    .tips-panels {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    @media (max-width: 1200px) {
        .tips-panels {
            grid-template-columns: 1fr;
        }
    }

    /* Panels - WordPress postbox style */
    .tips-panel {
        border: 1px solid #c3c4c7;
        background: #fff;
        display: flex;
        flex-direction: column;
    }
    .tips-panel .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #f6f7f7;
        border-bottom: 1px solid #c3c4c7;
    }
    .tips-panel .panel-header h3 {
        margin: 0;
        font-size: 13px;
        font-weight: 600;
    }
    .tips-panel .panel-header h3 small {
        font-weight: 400;
        color: #646970;
        font-size: 11px;
    }
    .tips-panel .panel-header .count {
        background: #dcdcde;
        padding: 2px 8px;
        border-radius: 3px;
        font-size: 11px;
        font-weight: 600;
        color: #50575e;
    }
    .selected-panel .panel-header .count {
        background: #2271b1;
        color: #fff;
    }

    .panel-actions {
        display: flex;
        gap: 8px;
        padding: 8px 10px;
        background: #fff;
        border-bottom: 1px solid #dcdcde;
    }
    .panel-actions .search-tips {
        flex: 1;
        padding: 4px 8px;
        border: 1px solid #8c8f94;
        border-radius: 3px;
        font-size: 13px;
    }

    /* Tips List */
    .tips-list {
        list-style: none;
        margin: 0;
        padding: 8px;
        min-height: 250px;
        max-height: 400px;
        overflow-y: auto;
        flex: 1;
        background: #f6f7f7;
    }
    .tips-list .empty-placeholder {
        text-align: center;
        padding: 30px 15px;
        color: #646970;
        font-style: italic;
    }

    .tip-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        background: #fff;
        border: 1px solid #c3c4c7;
        margin-bottom: 6px;
    }
    .tip-item:hover {
        border-color: #2271b1;
    }
    .tip-item.ui-sortable-helper {
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .tip-item.sortable-placeholder {
        background: #f0f6fc;
        border: 1px dashed #2271b1;
        visibility: visible !important;
        height: 50px;
    }

    .tip-item .drag-handle {
        color: #c3c4c7;
        cursor: grab;
    }
    .tip-item .drag-handle:active {
        cursor: grabbing;
    }
    .selected-tips .tip-item .drag-handle {
        color: #50575e;
    }

    .tip-item .tip-thumb {
        width: 36px;
        height: 36px;
        border-radius: 3px;
        object-fit: cover;
        background: #dcdcde;
        flex-shrink: 0;
    }
    .tip-item .tip-info {
        flex: 1;
        min-width: 0;
    }
    .tip-item .tip-title {
        font-size: 13px;
        color: #1d2327;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .tip-item .tip-meta {
        font-size: 11px;
        color: #646970;
    }

    .tip-item .tip-action {
        width: 28px;
        height: 28px;
        border-radius: 3px;
        border: 1px solid #c3c4c7;
        background: #f6f7f7;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    .tip-item .tip-action:hover {
        background: #f0f0f1;
        border-color: #8c8f94;
    }
    .tip-item .add-btn {
        color: #2271b1;
    }
    .tip-item .add-btn:hover {
        background: #2271b1;
        border-color: #2271b1;
        color: #fff;
    }
    .tip-item .remove-btn {
        color: #b32d2e;
    }
    .tip-item .remove-btn:hover {
        background: #b32d2e;
        border-color: #b32d2e;
        color: #fff;
    }

    /* Order number */
    .tip-item .order-num {
        width: 20px;
        height: 20px;
        background: #50575e;
        color: #fff;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        flex-shrink: 0;
    }

    /* Hidden inputs */
    .tip-item input[type="hidden"] {
        display: none;
    }
    </style>

    <script>
    jQuery(document).ready(function($) {
        // Tab switching
        $('.laundromat-lang-tabs .nav-tab').on('click', function(e) {
            e.preventDefault();
            var lang = $(this).data('lang');
            $('.laundromat-lang-tabs .nav-tab').removeClass('nav-tab-active');
            $(this).addClass('nav-tab-active');
            $('.lang-content').removeClass('active');
            $('.lang-content[data-lang="' + lang + '"]').addClass('active');
            $('#active_lang').val(lang);
        });

        // Initialize sortable for selected tips
        $('.selected-tips').sortable({
            items: '.tip-item',
            handle: '.drag-handle',
            placeholder: 'tip-item sortable-placeholder',
            forcePlaceholderSize: true,
            tolerance: 'pointer',
            update: function(e, ui) {
                updateOrderNumbers($(this));
            }
        });

        // Initialize order numbers on page load
        $('.selected-tips').each(function() {
            updateOrderNumbers($(this));
        });

        // Add tip
        $(document).on('click', '.add-btn', function() {
            var $item = $(this).closest('.tip-item');
            var lang = $item.data('lang');
            var optionKey = $item.data('option');
            var $selectedList = $('.selected-tips[data-lang="' + lang + '"]');

            // Remove empty placeholder
            $selectedList.find('.empty-placeholder').remove();

            // Clone and modify item
            var $newItem = $item.clone();
            $newItem.find('.add-btn').removeClass('add-btn').addClass('remove-btn').html('<span class="dashicons dashicons-minus"></span>');
            $newItem.find('.order-num').show();
            $newItem.find('.drag-handle').css('visibility', 'visible');
            $newItem.find('input[type="hidden"]').prop('disabled', false).removeAttr('disabled');

            // Add to selected list
            $selectedList.append($newItem);

            // Remove from available
            $item.fadeOut(200, function() {
                $(this).remove();
                updateCounts(lang);
            });

            updateOrderNumbers($selectedList);
            updateCounts(lang);
        });

        // Remove tip
        $(document).on('click', '.remove-btn', function() {
            var $item = $(this).closest('.tip-item');
            var lang = $item.data('lang');
            var $availableList = $('.available-tips[data-lang="' + lang + '"]');

            // Clone and modify item
            var $newItem = $item.clone();
            $newItem.find('.remove-btn').removeClass('remove-btn').addClass('add-btn').html('<span class="dashicons dashicons-plus-alt2"></span>');
            $newItem.find('.order-num').hide();
            $newItem.find('.drag-handle').css('visibility', 'hidden');
            $newItem.find('input[type="hidden"]').prop('disabled', true).attr('disabled', 'disabled');

            // Add to available list (alphabetically)
            var title = $newItem.find('.tip-title').text().toLowerCase();
            var inserted = false;
            $availableList.find('.tip-item').each(function() {
                if ($(this).find('.tip-title').text().toLowerCase() > title) {
                    $newItem.insertBefore($(this));
                    inserted = true;
                    return false;
                }
            });
            if (!inserted) {
                $availableList.append($newItem);
            }

            // Remove from selected
            $item.fadeOut(200, function() {
                $(this).remove();
                var $selectedList = $('.selected-tips[data-lang="' + lang + '"]');
                if ($selectedList.find('.tip-item').length === 0) {
                    $selectedList.append('<li class="empty-placeholder"><?php echo esc_js(__('Click + to add tips here', 'laundromat')); ?></li>');
                }
                updateOrderNumbers($selectedList);
                updateCounts(lang);
            });
        });

        // Add all
        $('.add-all-tips').on('click', function() {
            var lang = $(this).data('lang');
            $('.available-tips[data-lang="' + lang + '"] .add-btn').trigger('click');
        });

        // Remove all
        $('.remove-all-tips').on('click', function() {
            var lang = $(this).data('lang');
            $('.selected-tips[data-lang="' + lang + '"] .remove-btn').trigger('click');
        });

        // Search filter
        $('.search-tips').on('input', function() {
            var lang = $(this).data('lang');
            var query = $(this).val().toLowerCase();
            $('.available-tips[data-lang="' + lang + '"] .tip-item').each(function() {
                var title = $(this).find('.tip-title').text().toLowerCase();
                $(this).toggle(title.indexOf(query) > -1);
            });
        });

        function updateOrderNumbers($list) {
            $list.find('.tip-item').each(function(index) {
                $(this).find('.order-num').text(index + 1);
            });
        }

        function updateCounts(lang) {
            var selectedCount = $('.selected-tips[data-lang="' + lang + '"] .tip-item').length;
            var availableCount = $('.available-tips[data-lang="' + lang + '"] .tip-item').length;

            $('.selected-count[data-lang="' + lang + '"]').text(selectedCount);
            $('.nav-tab[data-lang="' + lang + '"] .badge').text(selectedCount);
            $('.lang-content[data-lang="' + lang + '"] .available-panel .count').text(availableCount);
        }
    });
    </script>
    <?php
}

/**
 * Render a single tip item
 */
function laundromat_render_tip_item($tip, $option_key, $is_selected)
{
    $thumbnail_url = get_the_post_thumbnail_url($tip->ID, 'thumbnail');
    $lang = str_replace('laundromat_homepage_tips_', '', $option_key);
    $index = $is_selected ? '' : '';

    ob_start();
    ?>
    <li class="tip-item" data-id="<?php echo esc_attr($tip->ID); ?>" data-lang="<?php echo esc_attr($lang); ?>" data-option="<?php echo esc_attr($option_key); ?>">
        <span class="drag-handle" <?php echo !$is_selected ? 'style="visibility:hidden"' : ''; ?>>
            <span class="dashicons dashicons-menu"></span>
        </span>
        <span class="order-num" <?php echo !$is_selected ? 'style="display:none"' : ''; ?>></span>
        <?php if ($thumbnail_url) : ?>
            <img src="<?php echo esc_url($thumbnail_url); ?>" alt="" class="tip-thumb">
        <?php else : ?>
            <span class="tip-thumb"></span>
        <?php endif; ?>
        <div class="tip-info">
            <div class="tip-title"><?php echo esc_html($tip->post_title); ?></div>
            <div class="tip-meta">ID: <?php echo $tip->ID; ?></div>
        </div>
        <input type="hidden" name="<?php echo esc_attr($option_key); ?>[]" value="<?php echo esc_attr($tip->ID); ?>" <?php echo !$is_selected ? 'disabled' : ''; ?>>
        <button type="button" class="tip-action <?php echo $is_selected ? 'remove-btn' : 'add-btn'; ?>">
            <span class="dashicons <?php echo $is_selected ? 'dashicons-minus' : 'dashicons-plus-alt2'; ?>"></span>
        </button>
    </li>
    <?php
    return ob_get_clean();
}
