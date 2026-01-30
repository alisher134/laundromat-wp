<?php
/**
 * Legal Pages Settings (Privacy Policy, Personal Data)
 *
 * @package Laundromat
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add Legal Pages Menu
 */
add_action('admin_menu', 'laundromat_add_legal_pages_menu');

function laundromat_add_legal_pages_menu()
{
    add_menu_page(
        __('Legal Pages', 'laundromat'),
        __('Legal Pages', 'laundromat'),
        'manage_options',
        'laundromat-legal',
        'laundromat_legal_pages_callback',
        'dashicons-media-document',
        31
    );
}

/**
 * Register Legal Pages Settings
 */
add_action('admin_init', 'laundromat_register_legal_settings');

function laundromat_register_legal_settings()
{
    // Get languages
    $languages = laundromat_get_polylang_languages();

    // Register settings for each language
    foreach ($languages as $lang) {
        // Privacy Policy
        register_setting('laundromat_legal_settings', 'laundromat_privacy_policy_title_' . $lang['slug'], [
            'sanitize_callback' => 'sanitize_text_field',
        ]);
        register_setting('laundromat_legal_settings', 'laundromat_privacy_policy_content_' . $lang['slug'], [
            'sanitize_callback' => 'wp_kses_post',
        ]);

        // Personal Data
        register_setting('laundromat_legal_settings', 'laundromat_personal_data_title_' . $lang['slug'], [
            'sanitize_callback' => 'sanitize_text_field',
        ]);
        register_setting('laundromat_legal_settings', 'laundromat_personal_data_content_' . $lang['slug'], [
            'sanitize_callback' => 'wp_kses_post',
        ]);
    }
}

/**
 * Legal Pages Admin Callback
 */
function laundromat_legal_pages_callback()
{
    if (!current_user_can('manage_options')) {
        return;
    }

    // Handle form submission
    if (isset($_POST['laundromat_legal_nonce']) && wp_verify_nonce($_POST['laundromat_legal_nonce'], 'laundromat_legal_save')) {
        laundromat_save_legal_pages();
        echo '<div class="notice notice-success is-dismissible"><p>' . __('Settings saved.', 'laundromat') . '</p></div>';
    }

    $languages = laundromat_get_polylang_languages();
    $current_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'privacy-policy';
    $current_lang = isset($_GET['lang']) ? sanitize_text_field($_GET['lang']) : $languages[0]['slug'];

    ?>
    <div class="wrap">
        <h1><?php echo esc_html__('Legal Pages', 'laundromat'); ?></h1>

        <!-- Page Tabs -->
        <h2 class="nav-tab-wrapper">
            <a href="?page=laundromat-legal&tab=privacy-policy&lang=<?php echo esc_attr($current_lang); ?>"
               class="nav-tab <?php echo $current_tab === 'privacy-policy' ? 'nav-tab-active' : ''; ?>">
                <?php _e('Privacy Policy', 'laundromat'); ?>
            </a>
            <a href="?page=laundromat-legal&tab=personal-data&lang=<?php echo esc_attr($current_lang); ?>"
               class="nav-tab <?php echo $current_tab === 'personal-data' ? 'nav-tab-active' : ''; ?>">
                <?php _e('Personal Data', 'laundromat'); ?>
            </a>
        </h2>

        <!-- Language Tabs -->
        <div style="margin: 20px 0 10px;">
            <strong><?php _e('Language:', 'laundromat'); ?></strong>
            <?php foreach ($languages as $lang): ?>
                <a href="?page=laundromat-legal&tab=<?php echo esc_attr($current_tab); ?>&lang=<?php echo esc_attr($lang['slug']); ?>"
                   class="button <?php echo $current_lang === $lang['slug'] ? 'button-primary' : ''; ?>"
                   style="margin-left: 5px;">
                    <?php echo esc_html(strtoupper($lang['slug'])); ?>
                </a>
            <?php endforeach; ?>
        </div>

        <form method="post" action="">
            <?php wp_nonce_field('laundromat_legal_save', 'laundromat_legal_nonce'); ?>
            <input type="hidden" name="current_tab" value="<?php echo esc_attr($current_tab); ?>">
            <input type="hidden" name="current_lang" value="<?php echo esc_attr($current_lang); ?>">

            <?php if ($current_tab === 'privacy-policy'): ?>
                <?php laundromat_render_legal_editor('privacy_policy', $current_lang, __('Privacy Policy', 'laundromat')); ?>
            <?php else: ?>
                <?php laundromat_render_legal_editor('personal_data', $current_lang, __('Personal Data Processing', 'laundromat')); ?>
            <?php endif; ?>

            <?php submit_button(__('Save', 'laundromat')); ?>
        </form>

        <hr>
        <h3><?php _e('REST API Endpoints', 'laundromat'); ?></h3>
        <p>
            <strong>Privacy Policy:</strong>
            <code><?php echo esc_url(rest_url('laundromat/v1/legal/privacy-policy')); ?></code>
        </p>
        <p>
            <strong>Personal Data:</strong>
            <code><?php echo esc_url(rest_url('laundromat/v1/legal/personal-data')); ?></code>
        </p>
        <p>
            <?php _e('Add ?lang=el for translated content', 'laundromat'); ?>
        </p>
    </div>
    <?php
}

/**
 * Render Legal Page Editor
 */
function laundromat_render_legal_editor($page_key, $lang, $label)
{
    $title_key = 'laundromat_' . $page_key . '_title_' . $lang;
    $content_key = 'laundromat_' . $page_key . '_content_' . $lang;

    $title = get_option($title_key, '');
    $content = get_option($content_key, '');

    ?>
    <table class="form-table">
        <tr>
            <th scope="row">
                <label for="<?php echo esc_attr($title_key); ?>"><?php _e('Page Title', 'laundromat'); ?></label>
            </th>
            <td>
                <input type="text"
                       id="<?php echo esc_attr($title_key); ?>"
                       name="<?php echo esc_attr($title_key); ?>"
                       value="<?php echo esc_attr($title); ?>"
                       class="regular-text"
                       placeholder="<?php echo esc_attr($label); ?>">
            </td>
        </tr>
        <tr>
            <th scope="row">
                <label for="<?php echo esc_attr($content_key); ?>"><?php _e('Content', 'laundromat'); ?></label>
            </th>
            <td>
                <?php
                wp_editor($content, $content_key, [
                    'textarea_name' => $content_key,
                    'textarea_rows' => 20,
                    'media_buttons' => false,
                    'teeny' => false,
                    'quicktags' => true,
                ]);
                ?>
            </td>
        </tr>
    </table>
    <?php
}

/**
 * Save Legal Pages
 */
function laundromat_save_legal_pages()
{
    $tab = isset($_POST['current_tab']) ? sanitize_text_field($_POST['current_tab']) : '';
    $lang = isset($_POST['current_lang']) ? sanitize_text_field($_POST['current_lang']) : '';

    if (empty($tab) || empty($lang)) {
        return;
    }

    $page_key = $tab === 'privacy-policy' ? 'privacy_policy' : 'personal_data';

    $title_key = 'laundromat_' . $page_key . '_title_' . $lang;
    $content_key = 'laundromat_' . $page_key . '_content_' . $lang;

    if (isset($_POST[$title_key])) {
        update_option($title_key, sanitize_text_field($_POST[$title_key]));
    }

    if (isset($_POST[$content_key])) {
        update_option($content_key, wp_kses_post($_POST[$content_key]));
    }
}
