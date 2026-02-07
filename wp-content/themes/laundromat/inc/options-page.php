<?php
/**
 * Options Page using WordPress Settings API
 *
 * @package Laundromat
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get available languages from Polylang
 */
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

/**
 * Add Options Page to Admin Menu
 */
add_action('admin_menu', 'laundromat_add_options_page');

function laundromat_add_options_page()
{
    add_menu_page(
        __('Contact Settings', 'laundromat'),
        __('Contact Settings', 'laundromat'),
        'manage_options',
        'laundromat-settings',
        'laundromat_options_page_callback',
        'dashicons-phone',
        30
    );
}

/**
 * Register Settings
 */
add_action('admin_init', 'laundromat_register_settings');

function laundromat_register_settings()
{
    // Global settings (same for all languages)
    $global_settings = [
        'laundromat_phone',
        'laundromat_email',
        'laundromat_facebook_url',
        'laundromat_instagram_url',
        'laundromat_tiktok_url',
        'laundromat_google_maps_key',
    ];

    foreach ($global_settings as $setting) {
        register_setting('laundromat_settings', $setting, [
            'sanitize_callback' => strpos($setting, 'url') !== false ? 'esc_url_raw' : 'sanitize_text_field',
        ]);
    }

    // Per-language settings
    $languages = laundromat_get_polylang_languages();
    foreach ($languages as $lang) {
        register_setting('laundromat_settings', 'laundromat_address_' . $lang['slug'], [
            'sanitize_callback' => 'sanitize_textarea_field',
        ]);
        register_setting('laundromat_settings', 'laundromat_working_hours_' . $lang['slug'], [
            'sanitize_callback' => 'sanitize_textarea_field',
        ]);
    }

    // Contact Info Section
    add_settings_section(
        'laundromat_contact_section',
        __('Contact Information', 'laundromat'),
        function () {
            echo '<p>' . __('Enter your business contact information. This will be available via the REST API.', 'laundromat') . '</p>';
        },
        'laundromat-settings'
    );

    // Phone field
    add_settings_field(
        'laundromat_phone',
        __('Phone Number', 'laundromat'),
        'laundromat_text_field_callback',
        'laundromat-settings',
        'laundromat_contact_section',
        ['id' => 'laundromat_phone', 'placeholder' => __('8 800 600 14 41', 'laundromat')]
    );

    // Email field
    add_settings_field(
        'laundromat_email',
        __('Email Address', 'laundromat'),
        'laundromat_text_field_callback',
        'laundromat-settings',
        'laundromat_contact_section',
        ['id' => 'laundromat_email', 'placeholder' => __('info@laundromat.gr', 'laundromat'), 'type' => 'email']
    );

    // Google Maps API Key field
    add_settings_field(
        'laundromat_google_maps_key',
        __('Google Maps API Key', 'laundromat'),
        'laundromat_text_field_callback',
        'laundromat-settings',
        'laundromat_contact_section',
        ['id' => 'laundromat_google_maps_key', 'placeholder' => __('AIza...', 'laundromat')]
    );

    // Per-language fields section
    add_settings_section(
        'laundromat_multilingual_section',
        __('Translatable Content', 'laundromat'),
        function () {
            echo '<p>' . __('These fields can have different values for each language.', 'laundromat') . '</p>';
        },
        'laundromat-settings'
    );

    // Address and working hours with language tabs
    add_settings_field(
        'laundromat_address_multilingual',
        __('Address', 'laundromat'),
        'laundromat_multilingual_textarea_callback',
        'laundromat-settings',
        'laundromat_multilingual_section',
        ['id' => 'laundromat_address', 'placeholder' => __('Ethniki Palaiokastritsas, Kerkira 491 00, Greece', 'laundromat')]
    );

    add_settings_field(
        'laundromat_working_hours_multilingual',
        __('Working Hours', 'laundromat'),
        'laundromat_multilingual_textarea_callback',
        'laundromat-settings',
        'laundromat_multilingual_section',
        ['id' => 'laundromat_working_hours', 'placeholder' => __('Mon-Sun: 7am - 11pm', 'laundromat')]
    );

    // Social Media Section
    add_settings_section(
        'laundromat_social_section',
        __('Social Media Links', 'laundromat'),
        function () {
            echo '<p>' . __('Enter your social media profile URLs.', 'laundromat') . '</p>';
        },
        'laundromat-settings'
    );

    // Facebook URL
    add_settings_field(
        'laundromat_facebook_url',
        __('Facebook URL', 'laundromat'),
        'laundromat_text_field_callback',
        'laundromat-settings',
        'laundromat_social_section',
        ['id' => 'laundromat_facebook_url', 'placeholder' => __('https://facebook.com/laundromat', 'laundromat'), 'type' => 'url']
    );

    // Instagram URL
    add_settings_field(
        'laundromat_instagram_url',
        __('Instagram URL', 'laundromat'),
        'laundromat_text_field_callback',
        'laundromat-settings',
        'laundromat_social_section',
        ['id' => 'laundromat_instagram_url', 'placeholder' => __('https://instagram.com/laundromat', 'laundromat'), 'type' => 'url']
    );

    // TikTok URL
    add_settings_field(
        'laundromat_tiktok_url',
        __('TikTok URL', 'laundromat'),
        'laundromat_text_field_callback',
        'laundromat-settings',
        'laundromat_social_section',
        ['id' => 'laundromat_tiktok_url', 'placeholder' => __('https://tiktok.com/@laundromat', 'laundromat'), 'type' => 'url']
    );
}

/**
 * Text Field Callback
 */
function laundromat_text_field_callback($args)
{
    $value = get_option($args['id'], '');
    $type = $args['type'] ?? 'text';
    $placeholder = $args['placeholder'] ?? '';

    printf(
        '<input type="%s" id="%s" name="%s" value="%s" placeholder="%s" class="regular-text">',
        esc_attr($type),
        esc_attr($args['id']),
        esc_attr($args['id']),
        esc_attr($value),
        esc_attr($placeholder)
    );
}

/**
 * Textarea Field Callback
 */
function laundromat_textarea_field_callback($args)
{
    $value = get_option($args['id'], '');
    $placeholder = $args['placeholder'] ?? '';

    printf(
        '<textarea id="%s" name="%s" rows="3" class="large-text" placeholder="%s">%s</textarea>',
        esc_attr($args['id']),
        esc_attr($args['id']),
        esc_attr($placeholder),
        esc_textarea($value)
    );
}

/**
 * Multilingual Textarea Field Callback - Shows tabs for each language
 */
function laundromat_multilingual_textarea_callback($args)
{
    $base_id = $args['id'];
    $placeholder = $args['placeholder'] ?? '';
    $languages = laundromat_get_polylang_languages();

    // Generate unique ID for this field's tabs
    $tabs_id = 'tabs-' . sanitize_title($base_id);

    echo '<div class="laundromat-lang-tabs" id="' . esc_attr($tabs_id) . '">';

    // Tab buttons
    echo '<div class="laundromat-lang-tab-buttons" style="margin-bottom: 10px;">';
    foreach ($languages as $index => $lang) {
        $active = $index === 0 ? 'nav-tab-active' : '';
        printf(
            '<a href="#" class="nav-tab %s" data-tab="%s" data-tabs-id="%s">%s</a>',
            $active,
            esc_attr($lang['slug']),
            esc_attr($tabs_id),
            esc_html(strtoupper($lang['slug']))
        );
    }
    echo '</div>';

    // Tab content
    foreach ($languages as $index => $lang) {
        $field_id = $base_id . '_' . $lang['slug'];
        $value = get_option($field_id, '');
        $hidden = $index === 0 ? '' : 'display: none;';

        printf(
            '<div class="laundromat-lang-tab-content" data-lang="%s" data-tabs-id="%s" style="%s">
                <textarea id="%s" name="%s" rows="3" class="large-text" placeholder="%s">%s</textarea>
                <p class="description">%s</p>
            </div>',
            esc_attr($lang['slug']),
            esc_attr($tabs_id),
            esc_attr($hidden),
            esc_attr($field_id),
            esc_attr($field_id),
            esc_attr($placeholder),
            esc_textarea($value),
            sprintf(__('Content for %s', 'laundromat'), esc_html($lang['name']))
        );
    }

    echo '</div>';
}

/**
 * Options Page Callback
 */
function laundromat_options_page_callback()
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

    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

        <?php settings_errors('laundromat_messages'); ?>

        <form action="options.php" method="post">
            <?php
            settings_fields('laundromat_settings');
            do_settings_sections('laundromat-settings');
            submit_button(__('Save Settings', 'laundromat'));
            ?>
        </form>

        <hr>

        <h2><?php _e('REST API Endpoint', 'laundromat'); ?></h2>
        <p>
            <?php _e('Access these settings via the REST API:', 'laundromat'); ?>
            <code><?php echo esc_url(rest_url('laundromat/v1/settings')); ?></code>
        </p>
        <p>
            <?php _e('Add language parameter for translated content:', 'laundromat'); ?>
            <code><?php echo esc_url(rest_url('laundromat/v1/settings?lang=el')); ?></code>
        </p>
    </div>

    <style>
    .laundromat-lang-tabs {
        margin-top: 5px;
    }
    .laundromat-lang-tab-buttons .nav-tab {
        cursor: pointer;
        margin-right: 5px;
    }
    .laundromat-lang-tab-buttons .nav-tab-active {
        background: #fff;
        border-bottom-color: #fff;
    }
    </style>

    <script>
    (function() {
        document.querySelectorAll('.laundromat-lang-tab-buttons .nav-tab').forEach(function(tab) {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                var lang = this.getAttribute('data-tab');
                var tabsId = this.getAttribute('data-tabs-id');
                var container = document.getElementById(tabsId);

                // Update active tab
                container.querySelectorAll('.nav-tab').forEach(function(t) {
                    t.classList.remove('nav-tab-active');
                });
                this.classList.add('nav-tab-active');

                // Show/hide content
                container.querySelectorAll('.laundromat-lang-tab-content').forEach(function(content) {
                    if (content.getAttribute('data-lang') === lang) {
                        content.style.display = 'block';
                    } else {
                        content.style.display = 'none';
                    }
                });
            });
        });
    })();
    </script>
    <?php
}
