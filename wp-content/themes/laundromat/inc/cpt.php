<?php
/**
 * Custom Post Types and Meta Fields Registration
 *
 * @package Laundromat
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Custom Post Types
 */
add_action('init', 'laundromat_register_cpts');

function laundromat_register_cpts()
{
    // Locations CPT
    register_post_type('locations', [
        'labels' => [
            'name' => __('Locations', 'laundromat'),
            'singular_name' => __('Location', 'laundromat'),
            'add_new' => __('Add New Location', 'laundromat'),
            'add_new_item' => __('Add New Location', 'laundromat'),
            'edit_item' => __('Edit Location', 'laundromat'),
            'new_item' => __('New Location', 'laundromat'),
            'view_item' => __('View Location', 'laundromat'),
            'search_items' => __('Search Locations', 'laundromat'),
            'not_found' => __('No locations found', 'laundromat'),
            'not_found_in_trash' => __('No locations found in trash', 'laundromat'),
        ],
        'public' => false,
        'publicly_queryable' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'locations',
        'supports' => ['title', 'thumbnail'],
        'menu_icon' => 'dashicons-location',
        'menu_position' => 5,
    ]);

    // Tips CPT
    register_post_type('tips', [
        'labels' => [
            'name' => __('Tips', 'laundromat'),
            'singular_name' => __('Tip', 'laundromat'),
            'add_new' => __('Add New Tip', 'laundromat'),
            'add_new_item' => __('Add New Tip', 'laundromat'),
            'edit_item' => __('Edit Tip', 'laundromat'),
            'new_item' => __('New Tip', 'laundromat'),
            'view_item' => __('View Tip', 'laundromat'),
            'search_items' => __('Search Tips', 'laundromat'),
            'not_found' => __('No tips found', 'laundromat'),
            'not_found_in_trash' => __('No tips found in trash', 'laundromat'),
        ],
        'public' => false,
        'publicly_queryable' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'tips',
        'supports' => ['title', 'editor', 'thumbnail'],
        'menu_icon' => 'dashicons-lightbulb',
        'menu_position' => 6,
        'taxonomies' => ['content_category'],
    ]);

    // Instructions CPT
    register_post_type('instructions', [
        'labels' => [
            'name' => __('Instructions', 'laundromat'),
            'singular_name' => __('Instruction', 'laundromat'),
            'add_new' => __('Add New Instruction', 'laundromat'),
            'add_new_item' => __('Add New Instruction', 'laundromat'),
            'edit_item' => __('Edit Instruction', 'laundromat'),
            'new_item' => __('New Instruction', 'laundromat'),
            'view_item' => __('View Instruction', 'laundromat'),
            'search_items' => __('Search Instructions', 'laundromat'),
            'not_found' => __('No instructions found', 'laundromat'),
            'not_found_in_trash' => __('No instructions found in trash', 'laundromat'),
        ],
        'public' => false,
        'publicly_queryable' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'instructions',
        'supports' => ['title', 'editor', 'thumbnail'],
        'menu_icon' => 'dashicons-book',
        'menu_position' => 7,
        'taxonomies' => ['content_category'],
    ]);

    // FAQs CPT
    register_post_type('faqs', [
        'labels' => [
            'name' => __('FAQs', 'laundromat'),
            'singular_name' => __('FAQ', 'laundromat'),
            'add_new' => __('Add New FAQ', 'laundromat'),
            'add_new_item' => __('Add New FAQ', 'laundromat'),
            'edit_item' => __('Edit FAQ', 'laundromat'),
            'new_item' => __('New FAQ', 'laundromat'),
            'view_item' => __('View FAQ', 'laundromat'),
            'search_items' => __('Search FAQs', 'laundromat'),
            'not_found' => __('No FAQs found', 'laundromat'),
            'not_found_in_trash' => __('No FAQs found in trash', 'laundromat'),
        ],
        'public' => false,
        'publicly_queryable' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'faqs',
        'supports' => ['title', 'editor'],
        'menu_icon' => 'dashicons-editor-help',
        'menu_position' => 8,
    ]);

    // Services CPT
    register_post_type('services', [
        'labels' => [
            'name' => __('Services', 'laundromat'),
            'singular_name' => __('Service', 'laundromat'),
            'add_new' => __('Add New Service', 'laundromat'),
            'add_new_item' => __('Add New Service', 'laundromat'),
            'edit_item' => __('Edit Service', 'laundromat'),
            'new_item' => __('New Service', 'laundromat'),
            'view_item' => __('View Service', 'laundromat'),
            'search_items' => __('Search Services', 'laundromat'),
            'not_found' => __('No services found', 'laundromat'),
            'not_found_in_trash' => __('No services found in trash', 'laundromat'),
        ],
        'public' => false,
        'publicly_queryable' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'services',
        'supports' => ['title', 'editor', 'thumbnail'],
        'menu_icon' => 'dashicons-archive',
        'menu_position' => 9,
    ]);

    // Contact Messages CPT (for storing form submissions)
    register_post_type('contact_messages', [
        'labels' => [
            'name' => __('Contact Messages', 'laundromat'),
            'singular_name' => __('Contact Message', 'laundromat'),
            'all_items' => __('All Messages', 'laundromat'),
            'view_item' => __('View Message', 'laundromat'),
            'search_items' => __('Search Messages', 'laundromat'),
            'not_found' => __('No messages found', 'laundromat'),
        ],
        'public' => false,
        'publicly_queryable' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => false,
        'supports' => ['title', 'editor'],
        'menu_icon' => 'dashicons-email-alt',
        'menu_position' => 25,
        'capabilities' => [
            'create_posts' => false, // Disable creating from admin
        ],
        'map_meta_cap' => true,
    ]);

    // Content Category Taxonomy (for Tips and Instructions)
    register_taxonomy('content_category', ['tips', 'instructions'], [
        'labels' => [
            'name' => __('Categories', 'laundromat'),
            'singular_name' => __('Category', 'laundromat'),
            'search_items' => __('Search Categories', 'laundromat'),
            'all_items' => __('All Categories', 'laundromat'),
            'edit_item' => __('Edit Category', 'laundromat'),
            'update_item' => __('Update Category', 'laundromat'),
            'add_new_item' => __('Add New Category', 'laundromat'),
            'new_item_name' => __('New Category Name', 'laundromat'),
            'menu_name' => __('Categories', 'laundromat'),
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_rest' => true,
        'hierarchical' => true,
        'show_admin_column' => true,
    ]);
}

/**
 * Sanitize callback wrappers (WordPress passes extra params that floatval/intval don't accept)
 */
function laundromat_sanitize_float($value) {
    return floatval($value);
}

function laundromat_sanitize_int($value) {
    return intval($value);
}

/**
 * Register Meta Fields for REST API
 */
add_action('init', 'laundromat_register_meta_fields');

function laundromat_register_meta_fields()
{
    // Location meta fields
    $location_fields = [
        'address' => 'string',
        'store_hours' => 'string',
        'latitude' => 'number',
        'longitude' => 'number',
        'phone' => 'string',
        'map_pos_mobile_top' => 'string',
        'map_pos_mobile_left' => 'string',
        'map_pos_desktop_top' => 'string',
        'map_pos_desktop_left' => 'string',
    ];

    foreach ($location_fields as $field => $type) {
        register_post_meta('locations', $field, [
            'show_in_rest' => true,
            'single' => true,
            'type' => $type,
            'sanitize_callback' => $type === 'number' ? 'laundromat_sanitize_float' : 'sanitize_text_field',
        ]);
    }

    // Service meta fields
    $service_fields = [
        'service_category' => 'string', // 'laundry', 'drying', 'specialCleaning'
        'price_rows' => 'string', // JSON array of price row objects
        'action_link_text' => 'string', // Link button text
        'action_link_url' => 'string', // Link destination URL
    ];

    foreach ($service_fields as $field => $type) {
        $callback = 'sanitize_text_field';
        // price_rows needs special handling - allow JSON content
        if ($field === 'price_rows') {
            $callback = 'wp_kses_post';
        }

        register_post_meta('services', $field, [
            'show_in_rest' => true,
            'single' => true,
            'type' => $type,
            'sanitize_callback' => $callback,
        ]);
    }
}
