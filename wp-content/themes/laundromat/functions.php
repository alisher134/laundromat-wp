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

function laundromat_add_lang_to_rest($response, $post, $request)
{
    if (function_exists('pll_get_post_language')) {
        $response->data['lang'] = pll_get_post_language($post->ID, 'slug');
    }
    return $response;
}
