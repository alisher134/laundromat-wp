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
 * Register Homepage Settings
 */
add_action('admin_init', 'laundromat_register_homepage_settings');

function laundromat_register_homepage_settings()
{
    // Register homepage tips setting per language
    $languages = laundromat_get_polylang_languages();
    foreach ($languages as $lang) {
        register_setting('laundromat_homepage_settings', 'laundromat_homepage_tips_' . $lang['slug'], [
            'sanitize_callback' => 'laundromat_sanitize_homepage_tips',
            'type' => 'array',
            'default' => [],
        ]);
    }

    // Homepage Tips Section
    add_settings_section(
        'laundromat_homepage_tips_section',
        __('Laundry Tips Selection', 'laundromat'),
        function () {
            echo '<p>' . __('Select which tips should be displayed on the homepage for each language. If no tips are selected for a language, all published tips in that language will be shown.', 'laundromat') . '</p>';
        },
        'laundromat-homepage-settings'
    );

    // Homepage Tips Selection with language tabs
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
 * Tips Selection Callback - Shows language tabs with checkboxes for tips in each language
 */
function laundromat_tips_selection_callback($args)
{
    $languages = laundromat_get_polylang_languages();
    $polylang_active = function_exists('pll_get_post_language');

    echo '<div class="laundromat-tips-lang-tabs">';

    // Tab buttons
    echo '<div class="laundromat-tips-tab-buttons" style="margin-bottom: 15px;">';
    foreach ($languages as $index => $lang) {
        $active = $index === 0 ? 'nav-tab-active' : '';
        printf(
            '<a href="#" class="nav-tab %s" data-lang="%s">%s</a>',
            $active,
            esc_attr($lang['slug']),
            esc_html($lang['name'])
        );
    }
    echo '</div>';

    // Tab content for each language
    foreach ($languages as $index => $lang) {
        $option_key = 'laundromat_homepage_tips_' . $lang['slug'];
        $selected_tips = get_option($option_key, []);
        if (!is_array($selected_tips)) {
            $selected_tips = [];
        }

        $hidden = $index === 0 ? '' : 'display: none;';

        // Fetch tips for this language
        $tips_args = [
            'post_type' => 'tips',
            'posts_per_page' => -1,
            'orderby' => 'title',
            'order' => 'ASC',
            'post_status' => 'publish',
        ];

        // Filter by language if Polylang is active
        if ($polylang_active) {
            $tips_args['lang'] = $lang['slug'];
        }

        $tips = get_posts($tips_args);

        echo '<div class="laundromat-tips-tab-content" data-lang="' . esc_attr($lang['slug']) . '" style="' . esc_attr($hidden) . '">';

        if (empty($tips)) {
            echo '<p class="description">' . sprintf(__('No tips found for %s. Create some tips in this language first.', 'laundromat'), esc_html($lang['name'])) . '</p>';
        } else {
            echo '<div style="max-height: 500px; overflow-y: auto; border: 1px solid #ddd; padding: 15px; background: #fff; border-radius: 4px;">';

            // Select/Deselect All buttons
            echo '<div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">';
            echo '<button type="button" class="button select-all-tips" data-lang="' . esc_attr($lang['slug']) . '">' . __('Select All', 'laundromat') . '</button> ';
            echo '<button type="button" class="button deselect-all-tips" data-lang="' . esc_attr($lang['slug']) . '">' . __('Deselect All', 'laundromat') . '</button>';
            echo '<span style="margin-left: 15px; color: #666;">' . sprintf(__('%d tips available', 'laundromat'), count($tips)) . '</span>';
            echo '</div>';

            foreach ($tips as $tip) {
                $checked = in_array($tip->ID, $selected_tips) ? 'checked' : '';
                $thumbnail = get_the_post_thumbnail($tip->ID, 'thumbnail', ['style' => 'width: 40px; height: 40px; object-fit: cover; border-radius: 4px; margin-right: 10px;']);

                printf(
                    '<label style="display: flex; align-items: center; margin-bottom: 12px; padding: 8px; background: %s; border-radius: 4px; cursor: pointer;" class="tip-label" data-lang="%s">
                        <input type="checkbox" name="%s[]" value="%d" class="tip-checkbox" data-lang="%s" %s style="margin: 0 10px 0 0;">
                        %s
                        <span style="flex: 1;">%s</span>
                        <span style="color: #666; font-size: 12px;">ID: %d</span>
                    </label>',
                    $checked ? '#e7f5ff' : 'transparent',
                    esc_attr($lang['slug']),
                    esc_attr($option_key),
                    $tip->ID,
                    esc_attr($lang['slug']),
                    $checked,
                    $thumbnail ?: '<span style="display: inline-block; width: 40px; height: 40px; background: #ddd; border-radius: 4px; margin-right: 10px;"></span>',
                    esc_html($tip->post_title),
                    $tip->ID
                );
            }

            echo '</div>';
            echo '<p class="description" style="margin-top: 10px;">' .
                 sprintf(__('Selected for %s: <strong class="selected-count" data-lang="%s">%d</strong> tips', 'laundromat'), esc_html($lang['name']), esc_attr($lang['slug']), count($selected_tips)) .
                 '</p>';
        }

        echo '</div>';
    }

    echo '</div>';

    // Add JavaScript for tabs and select/deselect all
    ?>
    <script>
    (function() {
        // Tab switching
        document.querySelectorAll('.laundromat-tips-tab-buttons .nav-tab').forEach(function(tab) {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                var lang = this.getAttribute('data-lang');

                // Update active tab
                document.querySelectorAll('.laundromat-tips-tab-buttons .nav-tab').forEach(function(t) {
                    t.classList.remove('nav-tab-active');
                });
                this.classList.add('nav-tab-active');

                // Show/hide content
                document.querySelectorAll('.laundromat-tips-tab-content').forEach(function(content) {
                    if (content.getAttribute('data-lang') === lang) {
                        content.style.display = 'block';
                    } else {
                        content.style.display = 'none';
                    }
                });
            });
        });

        // Select all buttons
        document.querySelectorAll('.select-all-tips').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var lang = this.getAttribute('data-lang');
                document.querySelectorAll('.tip-checkbox[data-lang="' + lang + '"]').forEach(function(cb) {
                    cb.checked = true;
                    cb.closest('.tip-label').style.background = '#e7f5ff';
                });
                updateCount(lang);
            });
        });

        // Deselect all buttons
        document.querySelectorAll('.deselect-all-tips').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var lang = this.getAttribute('data-lang');
                document.querySelectorAll('.tip-checkbox[data-lang="' + lang + '"]').forEach(function(cb) {
                    cb.checked = false;
                    cb.closest('.tip-label').style.background = 'transparent';
                });
                updateCount(lang);
            });
        });

        // Individual checkbox change
        document.querySelectorAll('.tip-checkbox').forEach(function(cb) {
            cb.addEventListener('change', function() {
                this.closest('.tip-label').style.background = this.checked ? '#e7f5ff' : 'transparent';
                updateCount(this.getAttribute('data-lang'));
            });
        });

        function updateCount(lang) {
            var count = document.querySelectorAll('.tip-checkbox[data-lang="' + lang + '"]:checked').length;
            var countEl = document.querySelector('.selected-count[data-lang="' + lang + '"]');
            if (countEl) {
                countEl.textContent = count;
            }
        }
    })();
    </script>

    <style>
    .laundromat-tips-tab-buttons .nav-tab {
        cursor: pointer;
        margin-right: 5px;
    }
    .laundromat-tips-tab-buttons .nav-tab-active {
        background: #fff;
        border-bottom-color: #fff;
    }
    .tip-label:hover {
        background: #f0f0f0 !important;
    }
    </style>
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
    $languages = laundromat_get_polylang_languages();
    $selection_info = [];
    foreach ($languages as $lang) {
        $selected_tips = get_option('laundromat_homepage_tips_' . $lang['slug'], []);
        $count = is_array($selected_tips) ? count($selected_tips) : 0;
        $selection_info[] = sprintf('%s: %d', strtoupper($lang['slug']), $count);
    }

    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

        <?php settings_errors('laundromat_messages'); ?>

        <div class="notice notice-info" style="margin-top: 20px;">
            <p><strong><?php _e('Selected tips per language:', 'laundromat'); ?></strong> <?php echo esc_html(implode(' | ', $selection_info)); ?></p>
        </div>

        <form action="options.php" method="post" style="margin-top: 20px;">
            <?php
            settings_fields('laundromat_homepage_settings');
            do_settings_sections('laundromat-homepage-settings');
            submit_button(__('Save Homepage Settings', 'laundromat'));
            ?>
        </form>

    </div>
    <?php
}
