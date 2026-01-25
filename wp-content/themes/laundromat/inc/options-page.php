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
    // Register settings
    $settings = [
        'laundromat_phone',
        'laundromat_email',
        'laundromat_address',
        'laundromat_working_hours',
        'laundromat_facebook_url',
        'laundromat_instagram_url',
        'laundromat_tiktok_url',
    ];

    foreach ($settings as $setting) {
        register_setting('laundromat_settings', $setting, [
            'sanitize_callback' => strpos($setting, 'url') !== false ? 'esc_url_raw' : 'sanitize_text_field',
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
        ['id' => 'laundromat_phone', 'placeholder' => '8 800 600 14 41']
    );

    // Email field
    add_settings_field(
        'laundromat_email',
        __('Email Address', 'laundromat'),
        'laundromat_text_field_callback',
        'laundromat-settings',
        'laundromat_contact_section',
        ['id' => 'laundromat_email', 'placeholder' => 'info@laundromat.gr', 'type' => 'email']
    );

    // Address field
    add_settings_field(
        'laundromat_address',
        __('Address', 'laundromat'),
        'laundromat_textarea_field_callback',
        'laundromat-settings',
        'laundromat_contact_section',
        ['id' => 'laundromat_address', 'placeholder' => 'Ethniki Palaiokastritsas, Kerkira 491 00, Greece']
    );

    // Working hours field
    add_settings_field(
        'laundromat_working_hours',
        __('Working Hours', 'laundromat'),
        'laundromat_textarea_field_callback',
        'laundromat-settings',
        'laundromat_contact_section',
        ['id' => 'laundromat_working_hours', 'placeholder' => 'Mon-Sun: 7am - 11pm']
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
        ['id' => 'laundromat_facebook_url', 'placeholder' => 'https://facebook.com/laundromat', 'type' => 'url']
    );

    // Instagram URL
    add_settings_field(
        'laundromat_instagram_url',
        __('Instagram URL', 'laundromat'),
        'laundromat_text_field_callback',
        'laundromat-settings',
        'laundromat_social_section',
        ['id' => 'laundromat_instagram_url', 'placeholder' => 'https://instagram.com/laundromat', 'type' => 'url']
    );

    // TikTok URL
    add_settings_field(
        'laundromat_tiktok_url',
        __('TikTok URL', 'laundromat'),
        'laundromat_text_field_callback',
        'laundromat-settings',
        'laundromat_social_section',
        ['id' => 'laundromat_tiktok_url', 'placeholder' => 'https://tiktok.com/@laundromat', 'type' => 'url']
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
    </div>
    <?php
}
