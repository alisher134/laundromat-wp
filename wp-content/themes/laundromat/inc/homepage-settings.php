<?php
/**
 * Homepage Settings Page
 *
 * @package Laundromat
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
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
 * Register Homepage Settings
 */
add_action('admin_init', 'laundromat_register_homepage_settings');

function laundromat_register_homepage_settings()
{
    // Register homepage tips setting (stores array of tip IDs)
    register_setting('laundromat_homepage_settings', 'laundromat_homepage_tips', [
        'sanitize_callback' => 'laundromat_sanitize_homepage_tips',
        'type' => 'array',
        'default' => [],
    ]);

    // Homepage Tips Section
    add_settings_section(
        'laundromat_homepage_tips_section',
        __('Laundry Tips Selection', 'laundromat'),
        function () {
            echo '<p>' . __('Select which tips should be displayed on the homepage. If no tips are selected, all published tips will be shown.', 'laundromat') . '</p>';
        },
        'laundromat-homepage-settings'
    );

    // Homepage Tips Selection
    add_settings_field(
        'laundromat_homepage_tips',
        __('Select Tips', 'laundromat'),
        'laundromat_tips_selection_callback',
        'laundromat-homepage-settings',
        'laundromat_homepage_tips_section',
        ['id' => 'laundromat_homepage_tips']
    );
}

/**
 * Tips Selection Callback - Shows checkboxes for all available tips
 */
function laundromat_tips_selection_callback($args)
{
    $selected_tips = get_option($args['id'], []);
    if (!is_array($selected_tips)) {
        $selected_tips = [];
    }

    // Fetch all tips
    $tips = get_posts([
        'post_type' => 'tips',
        'posts_per_page' => -1,
        'orderby' => 'title',
        'order' => 'ASC',
        'post_status' => 'publish',
    ]);

    if (empty($tips)) {
        echo '<p class="description">' . __('No tips found. Create some tips first.', 'laundromat') . '</p>';
        return;
    }

    echo '<div style="max-height: 500px; overflow-y: auto; border: 1px solid #ddd; padding: 15px; background: #fff; border-radius: 4px;">';

    // Select/Deselect All buttons
    echo '<div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">';
    echo '<button type="button" class="button" id="select-all-tips">' . __('Select All', 'laundromat') . '</button> ';
    echo '<button type="button" class="button" id="deselect-all-tips">' . __('Deselect All', 'laundromat') . '</button>';
    echo '<span style="margin-left: 15px; color: #666;">' . sprintf(__('%d tips available', 'laundromat'), count($tips)) . '</span>';
    echo '</div>';

    foreach ($tips as $tip) {
        $checked = in_array($tip->ID, $selected_tips) ? 'checked' : '';
        $thumbnail = get_the_post_thumbnail($tip->ID, 'thumbnail', ['style' => 'width: 40px; height: 40px; object-fit: cover; border-radius: 4px; margin-right: 10px;']);

        printf(
            '<label style="display: flex; align-items: center; margin-bottom: 12px; padding: 8px; background: %s; border-radius: 4px; cursor: pointer;" onmouseover="this.style.background=\'#f0f0f0\'" onmouseout="this.style.background=\'%s\'">
                <input type="checkbox" name="%s[]" value="%d" class="tip-checkbox" %s style="margin: 0 10px 0 0;">
                %s
                <span style="flex: 1;">%s</span>
                <span style="color: #666; font-size: 12px;">ID: %d</span>
            </label>',
            $checked ? '#e7f5ff' : 'transparent',
            $checked ? '#e7f5ff' : 'transparent',
            esc_attr($args['id']),
            $tip->ID,
            $checked,
            $thumbnail ?: '<span style="display: inline-block; width: 40px; height: 40px; background: #ddd; border-radius: 4px; margin-right: 10px;"></span>',
            esc_html($tip->post_title),
            $tip->ID
        );
    }

    echo '</div>';
    echo '<p class="description" style="margin-top: 10px;">' .
         sprintf(__('Selected: <strong id="selected-count">%d</strong> tips', 'laundromat'), count($selected_tips)) .
         '</p>';

    // Add JavaScript for select/deselect all
    ?>
    <script>
    (function() {
        var selectAllBtn = document.getElementById('select-all-tips');
        var deselectAllBtn = document.getElementById('deselect-all-tips');
        var checkboxes = document.querySelectorAll('.tip-checkbox');
        var selectedCount = document.getElementById('selected-count');

        function updateCount() {
            var count = document.querySelectorAll('.tip-checkbox:checked').length;
            selectedCount.textContent = count;
        }

        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', function() {
                checkboxes.forEach(function(cb) {
                    cb.checked = true;
                    cb.parentElement.style.background = '#e7f5ff';
                });
                updateCount();
            });
        }

        if (deselectAllBtn) {
            deselectAllBtn.addEventListener('click', function() {
                checkboxes.forEach(function(cb) {
                    cb.checked = false;
                    cb.parentElement.style.background = 'transparent';
                });
                updateCount();
            });
        }

        // Update count and background on individual checkbox change
        checkboxes.forEach(function(cb) {
            cb.addEventListener('change', function() {
                this.parentElement.style.background = this.checked ? '#e7f5ff' : 'transparent';
                updateCount();
            });
        });
    })();
    </script>
    <?php
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

    // Show success message after save
    if (isset($_GET['settings-updated'])) {
        add_settings_error(
            'laundromat_messages',
            'laundromat_message',
            __('Settings Saved', 'laundromat'),
            'updated'
        );
    }

    // Get current selection for display
    $selected_tips = get_option('laundromat_homepage_tips', []);
    $selection_status = empty($selected_tips)
        ? __('Currently showing all published tips on homepage', 'laundromat')
        : sprintf(__('Currently showing %d selected tips on homepage', 'laundromat'), count($selected_tips));

    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

        <?php settings_errors('laundromat_messages'); ?>

        <div class="notice notice-info" style="margin-top: 20px;">
            <p><strong><?php echo esc_html($selection_status); ?></strong></p>
        </div>

        <form action="options.php" method="post" style="margin-top: 20px;">
            <?php
            settings_fields('laundromat_homepage_settings');
            do_settings_sections('laundromat-homepage-settings');
            submit_button(__('Save Homepage Settings', 'laundromat'));
            ?>
        </form>

        <hr style="margin-top: 30px;">

        <h2><?php _e('REST API Endpoint', 'laundromat'); ?></h2>
        <p>
            <?php _e('Access homepage tips via the REST API:', 'laundromat'); ?>
            <code><?php echo esc_url(rest_url('laundromat/v1/homepage-tips')); ?></code>
        </p>

        <h3><?php _e('Debug Information', 'laundromat'); ?></h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 12px;">
            <p><strong>Selected Tip IDs:</strong> <?php echo !empty($selected_tips) ? implode(', ', $selected_tips) : 'None (will show all tips)'; ?></p>
            <p><strong>Total Published Tips:</strong> <?php echo wp_count_posts('tips')->publish; ?></p>
        </div>
    </div>
    <?php
}
