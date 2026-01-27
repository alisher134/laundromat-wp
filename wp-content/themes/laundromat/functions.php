<?php
/**
 * Laundromat Headless Theme Functions
 *
 * @package Laundromat
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Theme version
define('LAUNDROMAT_VERSION', '1.0.0');

// Include theme files
require_once get_template_directory() . '/inc/cpt.php';
require_once get_template_directory() . '/inc/meta-boxes.php';
require_once get_template_directory() . '/inc/rest-api.php';
require_once get_template_directory() . '/inc/options-page.php';
require_once get_template_directory() . '/inc/homepage-settings.php';

/**
 * Theme Setup
 */
add_action('after_setup_theme', function () {
    // Add theme supports
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');

    // Set thumbnail sizes
    add_image_size('tip-thumbnail', 400, 300, true);
    add_image_size('service-image', 600, 400, true);
});

/**
 * Allow REST API access for unauthenticated users (read only)
 */
add_filter('rest_authentication_errors', function ($result) {
    // If a previous check failed, return that result
    if (is_wp_error($result)) {
        return $result;
    }

    // Allow access
    return true;
});

/**
 * Polylang: Register translatable strings
 */
add_action('init', function () {
    if (!function_exists('pll_register_string')) {
        return;
    }

    $strings = [
        'Our location',
        'Services',
        'Instructions',
        'Laundry tips',
        'Contact us',
        'Send message',
        'Subscribe',
        'All articles',
        'Tips and tricks',
        'Useful resources',
        'Company news',
        'Latest',
        'Oldest',
        'Title A-Z',
        'Title Z-A',
        'Mon-Sun',
        'Read more',
        'Learn more',
        'Not provided',
        'Message from %s',
    ];

    foreach ($strings as $string) {
        pll_register_string('laundromat', $string, 'Laundromat');
    }
});

/**
 * Add language to REST API responses when Polylang is active
 */
add_filter('rest_prepare_locations', 'laundromat_add_lang_to_rest', 20, 3);
add_filter('rest_prepare_tips', 'laundromat_add_lang_to_rest', 20, 3);
add_filter('rest_prepare_instructions', 'laundromat_add_lang_to_rest', 20, 3);
add_filter('rest_prepare_faqs', 'laundromat_add_lang_to_rest', 20, 3);
add_filter('rest_prepare_services', 'laundromat_add_lang_to_rest', 20, 3);
add_filter('rest_prepare_about_items', 'laundromat_add_lang_to_rest', 20, 3);
add_filter('rest_prepare_reviews', 'laundromat_add_lang_to_rest', 20, 3);

function laundromat_add_lang_to_rest($response, $post, $request)
{
    if (!function_exists('pll_get_post_language')) {
        return $response;
    }

    $response->data['lang'] = pll_get_post_language($post->ID, 'slug');

    // Add translations map (lang_code => post_id)
    if (function_exists('pll_get_post_translations')) {
        $response->data['translations'] = pll_get_post_translations($post->ID);
    }

    return $response;
}

/**
 * Polylang: Enable translation for custom post types
 */
add_filter('pll_get_post_types', 'laundromat_add_cpts_to_polylang', 10, 2);

function laundromat_add_cpts_to_polylang($post_types, $is_settings)
{
    $cpts = ['locations', 'tips', 'instructions', 'faqs', 'services', 'about_items', 'reviews'];
    foreach ($cpts as $cpt) {
        $post_types[$cpt] = $cpt;
    }
    return $post_types;
}

/**
 * Polylang: Enable translation for content_category taxonomy
 */
add_filter('pll_get_taxonomies', 'laundromat_add_taxonomies_to_polylang', 10, 2);

function laundromat_add_taxonomies_to_polylang($taxonomies, $is_settings)
{
    $taxonomies['content_category'] = 'content_category';
    return $taxonomies;
}

/**
 * Simplify Admin Menu - Remove items not related to content
 */
add_action('admin_menu', 'laundromat_simplify_admin_menu', 999);

function laundromat_simplify_admin_menu()
{
    // Remove default WordPress menu items not needed for content management
    remove_menu_page('edit.php');              // Posts
    remove_menu_page('edit-comments.php');     // Comments
    remove_menu_page('themes.php');            // Appearance (headless theme)
    remove_menu_page('plugins.php');           // Plugins
    remove_menu_page('tools.php');             // Tools
    remove_menu_page('options-general.php');   // Settings
    remove_menu_page('edit.php?post_type=page'); // Pages
}

/**
 * Simplify Categories Admin Screen
 */
add_action('admin_head', 'laundromat_simplify_category_screen');

function laundromat_simplify_category_screen()
{
    $screen = get_current_screen();
    if ($screen && $screen->taxonomy === 'content_category') {
        ?>
        <style>
            /* Hide description column and field */
            .column-description,
            .term-description-wrap { display: none !important; }

            /* Hide slug column and field */
            .column-slug,
            .term-slug-wrap { display: none !important; }

            /* Hide parent dropdown */
            .term-parent-wrap { display: none !important; }

            /* Hide posts count column */
            .column-posts { display: none !important; }

            /* Clean up the add form */
            #tag-description { display: none !important; }
        </style>
        <?php
    }
}
