<?php
/**
 * REST API Configuration and Custom Endpoints
 *
 * @package Laundromat
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add CORS Headers for frontend access
 */
add_action('rest_api_init', 'laundromat_add_cors_headers', 15);

function laundromat_add_cors_headers()
{
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

    add_filter('rest_pre_serve_request', function ($value) {
        $origin = get_http_origin();

        if ($origin) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
        } else {
            header('Access-Control-Allow-Origin: *');
        }

        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');

        return $value;
    });
}

/**
 * Handle preflight OPTIONS requests
 */
add_action('init', function () {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');
        header('Access-Control-Max-Age: 86400');
        exit(0);
    }
});

/**
 * Add extra data to REST API responses
 */
add_filter('rest_prepare_locations', 'laundromat_enhance_location_response', 10, 3);
add_filter('rest_prepare_tips', 'laundromat_enhance_tips_response', 10, 3);
add_filter('rest_prepare_instructions', 'laundromat_enhance_tips_response', 10, 3);
add_filter('rest_prepare_faqs', 'laundromat_enhance_faq_response', 10, 3);
add_filter('rest_prepare_services', 'laundromat_enhance_service_response', 10, 3);
add_filter('rest_prepare_about_items', 'laundromat_enhance_about_item_response', 10, 3);

function laundromat_enhance_location_response($response, $post, $request)
{
    // Add featured image URL
    if (has_post_thumbnail($post->ID)) {
        $response->data['featured_image_url'] = get_the_post_thumbnail_url($post->ID, 'full');
    }

    // Add meta fields explicitly
    $response->data['meta'] = [
        'store_hours' => get_post_meta($post->ID, 'store_hours', true) ?: '',
        'address' => get_post_meta($post->ID, 'address', true) ?: '',
        'phone' => get_post_meta($post->ID, 'phone', true) ?: '',
        'latitude' => get_post_meta($post->ID, 'latitude', true) ?: '',
        'longitude' => get_post_meta($post->ID, 'longitude', true) ?: '',
    ];

    // Format map positions for easier frontend use
    $response->data['map_position'] = [
        'mobile' => [
            'top' => get_post_meta($post->ID, 'map_pos_mobile_top', true) ?: '0%',
            'left' => get_post_meta($post->ID, 'map_pos_mobile_left', true) ?: '0%',
        ],
        'desktop' => [
            'top' => get_post_meta($post->ID, 'map_pos_desktop_top', true) ?: '0%',
            'left' => get_post_meta($post->ID, 'map_pos_desktop_left', true) ?: '0%',
        ],
    ];

    return $response;
}

function laundromat_enhance_tips_response($response, $post, $request)
{
    // Add featured image URL
    if (has_post_thumbnail($post->ID)) {
        $response->data['featured_image_url'] = get_the_post_thumbnail_url($post->ID, 'full');
    }

    // Add category name
    $terms = wp_get_post_terms($post->ID, 'content_category');
    if (!is_wp_error($terms) && !empty($terms)) {
        $response->data['category'] = $terms[0]->name;
        $response->data['category_slug'] = $terms[0]->slug;
    } else {
        $response->data['category'] = 'Tips and tricks';
        $response->data['category_slug'] = 'tips-and-tricks';
    }

    // Format date
    $response->data['formatted_date'] = get_the_date('F j, Y', $post->ID);

    return $response;
}

function laundromat_enhance_faq_response($response, $post, $request)
{
    // Add title since title support is removed from the CPT
    // and it's not included in REST response by default
    $response->data['title'] = [
        'rendered' => get_the_title($post->ID),
    ];

    // Get content directly from post object since editor support is removed
    // and content is not included in REST response by default
    $content = apply_filters('the_content', $post->post_content);

    // Add content to response
    $response->data['content'] = [
        'rendered' => $content,
    ];

    // Strip HTML from content for plain text answer
    $response->data['answer'] = wp_strip_all_tags($content);

    return $response;
}

function laundromat_enhance_service_response($response, $post, $request)
{
    // Ensure title is included (should be by default, but add explicitly for safety)
    if (!isset($response->data['title']) || !isset($response->data['title']['rendered'])) {
        $response->data['title'] = [
            'rendered' => get_the_title($post->ID),
        ];
    }

    // Ensure content is included
    if (!isset($response->data['content']) || !isset($response->data['content']['rendered'])) {
        $response->data['content'] = [
            'rendered' => apply_filters('the_content', $post->post_content),
        ];
    }

    // Add featured image URL
    if (has_post_thumbnail($post->ID)) {
        $response->data['featured_image_url'] = get_the_post_thumbnail_url($post->ID, 'full');
    }

    // Add meta fields explicitly
    $response->data['meta'] = [
        'service_category' => get_post_meta($post->ID, 'service_category', true) ?: 'laundry',
    ];

    // Add price rows (decoded from JSON)
    $price_rows_json = get_post_meta($post->ID, 'price_rows', true);
    $response->data['price_rows'] = $price_rows_json ? json_decode($price_rows_json, true) : [];

    // Add action link
    $action_link_text = get_post_meta($post->ID, 'action_link_text', true);
    $action_link_url = get_post_meta($post->ID, 'action_link_url', true);
    $response->data['action_link'] = [
        'text' => $action_link_text ?: '',
        'url' => $action_link_url ?: '',
    ];

    return $response;
}

function laundromat_enhance_about_item_response($response, $post, $request)
{
    // Ensure title is included
    if (!isset($response->data['title']) || !isset($response->data['title']['rendered'])) {
        $response->data['title'] = [
            'rendered' => get_the_title($post->ID),
        ];
    }

    // Add featured image URL
    if (has_post_thumbnail($post->ID)) {
        $response->data['icon_image_url'] = get_the_post_thumbnail_url($post->ID, 'full');
    } else {
        $response->data['icon_image_url'] = '';
    }

    // Add meta fields explicitly
    $response->data['meta'] = [
        'secondary_title' => get_post_meta($post->ID, 'secondary_title', true) ?: '',
        'description' => get_post_meta($post->ID, 'description', true) ?: '',
    ];

    return $response;
}

/**
 * Register Custom REST Endpoints
 */
add_action('rest_api_init', 'laundromat_register_rest_routes');

function laundromat_register_rest_routes()
{
    // Settings endpoint
    register_rest_route('laundromat/v1', '/settings', [
        'methods' => 'GET',
        'callback' => 'laundromat_get_settings',
        'permission_callback' => '__return_true',
    ]);

    // Contact form submission endpoint
    register_rest_route('laundromat/v1', '/contact', [
        'methods' => 'POST',
        'callback' => 'laundromat_handle_contact_form',
        'permission_callback' => '__return_true',
    ]);

    // Categories endpoint for frontend
    register_rest_route('laundromat/v1', '/categories', [
        'methods' => 'GET',
        'callback' => 'laundromat_get_categories',
        'permission_callback' => '__return_true',
    ]);

    // Languages endpoint for Polylang
    register_rest_route('laundromat/v1', '/languages', [
        'methods' => 'GET',
        'callback' => 'laundromat_get_languages',
        'permission_callback' => '__return_true',
    ]);
}

/**
 * Get Settings Callback
 */
function laundromat_get_settings()
{
    return [
        'phone' => get_option('laundromat_phone', ''),
        'email' => get_option('laundromat_email', ''),
        'address' => get_option('laundromat_address', ''),
        'working_hours' => get_option('laundromat_working_hours', ''),
        'facebook_url' => get_option('laundromat_facebook_url', ''),
        'instagram_url' => get_option('laundromat_instagram_url', ''),
        'tiktok_url' => get_option('laundromat_tiktok_url', ''),
    ];
}

/**
 * Handle Contact Form Submission
 * Saves message as a private post and optionally sends email
 */
function laundromat_handle_contact_form($request)
{
    $params = $request->get_json_params();

    // Validate required fields
    $name = sanitize_text_field($params['name'] ?? '');
    $phone = sanitize_text_field($params['phone'] ?? '');
    $email = sanitize_email($params['email'] ?? '');
    $message = sanitize_textarea_field($params['message'] ?? '');

    if (empty($name) || empty($email) || empty($message)) {
        return new WP_Error(
            'missing_fields',
            __('Required fields missing', 'laundromat'),
            ['status' => 400]
        );
    }

    if (!is_email($email)) {
        return new WP_Error(
            'invalid_email',
            __('Invalid email address', 'laundromat'),
            ['status' => 400]
        );
    }

    // Save as private post (always works, even without email)
    $post_id = wp_insert_post([
        'post_type' => 'contact_messages',
        'post_title' => sprintf('Message from %s', $name),
        'post_content' => $message,
        'post_status' => 'private',
    ]);

    if (is_wp_error($post_id)) {
        return new WP_Error(
            'save_failed',
            __('Failed to save message', 'laundromat'),
            ['status' => 500]
        );
    }

    // Save contact details as meta
    update_post_meta($post_id, 'contact_name', $name);
    update_post_meta($post_id, 'contact_email', $email);
    update_post_meta($post_id, 'contact_phone', $phone);

    // Try to send email (non-blocking, success even if email fails)
    $admin_email = get_option('admin_email');
    $site_name = get_bloginfo('name');

    $subject = sprintf('[%s] New contact from %s', $site_name, $name);
    $body = sprintf(
        "New contact form submission:\n\n" .
        "Name: %s\n" .
        "Phone: %s\n" .
        "Email: %s\n\n" .
        "Message:\n%s\n\n" .
        "---\n" .
        "View in admin: %s\n" .
        "Sent from %s",
        $name,
        $phone ?: 'Not provided',
        $email,
        $message,
        admin_url('edit.php?post_type=contact_messages'),
        home_url()
    );

    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $name . ' <' . $email . '>',
    ];

    // Try email but don't fail if it doesn't work
    @wp_mail($admin_email, $subject, $body, $headers);

    return [
        'success' => true,
        'message' => __('Message sent successfully', 'laundromat'),
    ];
}

/**
 * Get Categories for Tips/Instructions
 */
function laundromat_get_categories()
{
    $terms = get_terms([
        'taxonomy' => 'content_category',
        'hide_empty' => false,
    ]);

    if (is_wp_error($terms)) {
        return [];
    }

    $categories = [
        ['key' => 'all', 'label' => __('All articles', 'laundromat')],
    ];

    foreach ($terms as $term) {
        $categories[] = [
            'key' => $term->slug,
            'label' => $term->name,
        ];
    }

    return $categories;
}

/**
 * Get Available Languages from Polylang
 */
function laundromat_get_languages()
{
    // Check if Polylang is active
    if (!function_exists('pll_the_languages') || !function_exists('pll_current_language')) {
        return new WP_Error(
            'polylang_not_active',
            __('Polylang plugin is not active', 'laundromat'),
            ['status' => 503]
        );
    }

    $current_lang = pll_current_language('slug');
    $languages = pll_the_languages(['raw' => 1]);

    if (empty($languages)) {
        return [];
    }

    $formatted_languages = [];

    foreach ($languages as $lang) {
        $formatted_languages[] = [
            'code' => $lang['slug'],
            'name' => $lang['name'],
            'url' => $lang['url'],
            'flag' => $lang['flag'] ?? '',
            'is_current' => $lang['slug'] === $current_lang,
        ];
    }

    return [
        'current' => $current_lang,
        'languages' => $formatted_languages,
    ];
}
