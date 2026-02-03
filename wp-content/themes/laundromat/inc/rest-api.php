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
 * Filter REST API queries by language when ?lang= parameter is provided
 */
add_filter('rest_locations_query', 'laundromat_filter_rest_by_lang', 10, 2);
add_filter('rest_tips_query', 'laundromat_filter_rest_by_lang', 10, 2);
add_filter('rest_instructions_query', 'laundromat_filter_rest_by_lang', 10, 2);
add_filter('rest_faqs_query', 'laundromat_filter_rest_by_lang', 10, 2);
add_filter('rest_services_query', 'laundromat_filter_rest_by_lang', 10, 2);
add_filter('rest_about_items_query', 'laundromat_filter_rest_by_lang', 10, 2);
add_filter('rest_reviews_query', 'laundromat_filter_rest_by_lang', 10, 2);

function laundromat_filter_rest_by_lang($args, $request)
{
    $lang = $request->get_param('lang');
    if (!empty($lang) && function_exists('pll_current_language')) {
        $args['lang'] = sanitize_text_field($lang);
    }

    // Default to menu_order sorting for sortable CPTs (only for frontend API requests)
    // Skip if this is an admin context or if orderby is already specified
    if (!is_admin() && !$request->get_param('orderby')) {
        $args['orderby'] = 'menu_order';
        $args['order'] = 'ASC';
    }

    // Filter FAQs by category if faq_category parameter is provided
    $faq_category = $request->get_param('faq_category');
    if (!empty($faq_category)) {
        $args['tax_query'] = [
            [
                'taxonomy' => 'faq_category',
                'field' => 'slug',
                'terms' => sanitize_text_field($faq_category),
            ],
        ];
    }

    return $args;
}

/**
 * Add extra data to REST API responses
 */
add_filter('rest_prepare_locations', 'laundromat_enhance_location_response', 10, 3);
add_filter('rest_prepare_tips', 'laundromat_enhance_tips_response', 10, 3);
add_filter('rest_prepare_instructions', 'laundromat_enhance_tips_response', 10, 3);
add_filter('rest_prepare_faqs', 'laundromat_enhance_faq_response', 10, 3);
add_filter('rest_prepare_services', 'laundromat_enhance_service_response', 10, 3);
add_filter('rest_prepare_about_items', 'laundromat_enhance_about_item_response', 10, 3);
add_filter('rest_prepare_reviews', 'laundromat_enhance_review_response', 10, 3);

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
    // Ensure title is included (may be missing in some language contexts)
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

    // Add category name
    $terms = wp_get_post_terms($post->ID, 'content_category');
    if (!is_wp_error($terms) && !empty($terms)) {
        $response->data['category'] = $terms[0]->name;
        $response->data['category_slug'] = $terms[0]->slug;
    } else {
        $response->data['category'] = function_exists('pll__') ? pll__('Tips and tricks') : __('Tips and tricks', 'laundromat');
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

    // Add FAQ category
    $terms = wp_get_post_terms($post->ID, 'faq_category');
    if (!is_wp_error($terms) && !empty($terms)) {
        $response->data['category'] = $terms[0]->name;
        $response->data['category_slug'] = $terms[0]->slug;
        $response->data['category_id'] = $terms[0]->term_id;
    } else {
        $response->data['category'] = '';
        $response->data['category_slug'] = '';
        $response->data['category_id'] = 0;
    }

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

    // Add service category from taxonomy
    $terms = wp_get_post_terms($post->ID, 'service_category');
    if (!is_wp_error($terms) && !empty($terms)) {
        $response->data['meta']['service_category'] = $terms[0]->slug;
        $response->data['category_name'] = $terms[0]->name;
    } else {
        // Fallback or legacy meta check
        $legacy_meta = get_post_meta($post->ID, 'service_category', true);
        $response->data['meta']['service_category'] = $legacy_meta ?: 'laundry';
        $response->data['category_name'] = '';
    }

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

function laundromat_enhance_review_response($response, $post, $request)
{
    // Ensure title is included (author name)
    if (!isset($response->data['title']) || !isset($response->data['title']['rendered'])) {
        $response->data['title'] = [
            'rendered' => get_the_title($post->ID),
        ];
    }

    // Ensure content is included (review text)
    if (!isset($response->data['content']) || !isset($response->data['content']['rendered'])) {
        $response->data['content'] = [
            'rendered' => apply_filters('the_content', $post->post_content),
        ];
    }

    // Add featured image URL (profile photo)
    if (has_post_thumbnail($post->ID)) {
        $response->data['photo_url'] = get_the_post_thumbnail_url($post->ID, 'full');
    } else {
        $response->data['photo_url'] = '';
    }

    // Add plain text version of review
    $response->data['review_text'] = wp_strip_all_tags($post->post_content);

    // Add author name for easy access
    $response->data['author_name'] = get_the_title($post->ID);

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

    // FAQ Categories endpoint for frontend
    register_rest_route('laundromat/v1', '/faq-categories', [
        'methods' => 'GET',
        'callback' => 'laundromat_get_faq_categories',
        'permission_callback' => '__return_true',
    ]);

    // Service Categories endpoint for frontend
    register_rest_route('laundromat/v1', '/service-categories', [
        'methods' => 'GET',
        'callback' => 'laundromat_get_service_categories',
        'permission_callback' => '__return_true',
    ]);

    // Homepage Tips endpoint - returns only selected tips
    register_rest_route('laundromat/v1', '/homepage-tips', [
        'methods' => 'GET',
        'callback' => 'laundromat_get_homepage_tips',
        'permission_callback' => '__return_true',
    ]);

    // Debug endpoint for homepage tips (shows query info)
    register_rest_route('laundromat/v1', '/homepage-tips/debug', [
        'methods' => 'GET',
        'callback' => 'laundromat_debug_homepage_tips',
        'permission_callback' => '__return_true',
    ]);

    // Translated strings endpoint for frontend UI
    register_rest_route('laundromat/v1', '/strings', [
        'methods' => 'GET',
        'callback' => 'laundromat_get_translated_strings',
        'permission_callback' => '__return_true',
    ]);

    // Legal Pages endpoints
    register_rest_route('laundromat/v1', '/legal/privacy-policy', [
        'methods' => 'GET',
        'callback' => 'laundromat_get_privacy_policy',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('laundromat/v1', '/legal/personal-data', [
        'methods' => 'GET',
        'callback' => 'laundromat_get_personal_data',
        'permission_callback' => '__return_true',
    ]);
}

/**
 * Get Settings Callback
 * Accepts ?lang= parameter for translated address and working_hours
 */
function laundromat_get_settings($request)
{
    $lang = $request->get_param('lang');

    // Determine which language suffix to use
    $lang_suffix = '';
    if ($lang) {
        $lang_suffix = '_' . sanitize_text_field($lang);
    } elseif (function_exists('pll_current_language')) {
        $current_lang = pll_current_language('slug');
        if ($current_lang) {
            $lang_suffix = '_' . $current_lang;
        }
    }

    // Get per-language fields with fallback to default (no suffix)
    $address = get_option('laundromat_address' . $lang_suffix, '');
    if (empty($address) && $lang_suffix) {
        $address = get_option('laundromat_address', '');
    }

    $working_hours = get_option('laundromat_working_hours' . $lang_suffix, '');
    if (empty($working_hours) && $lang_suffix) {
        $working_hours = get_option('laundromat_working_hours', '');
    }

    return [
        'phone' => get_option('laundromat_phone', ''),
        'email' => get_option('laundromat_email', ''),
        'address' => $address,
        'working_hours' => $working_hours,
        'facebook_url' => get_option('laundromat_facebook_url', ''),
        'instagram_url' => get_option('laundromat_instagram_url', ''),
        'tiktok_url' => get_option('laundromat_tiktok_url', ''),
        'lang' => $lang ?: (function_exists('pll_current_language') ? pll_current_language('slug') : null),
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
        'post_title' => sprintf(__('Message from %s', 'laundromat'), $name),
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
        $phone ?: __('Not provided', 'laundromat'),
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
 * Get FAQ Categories
 */
function laundromat_get_faq_categories($request)
{
    $lang = $request->get_param('lang');

    $args = [
        'taxonomy' => 'faq_category',
        'hide_empty' => false,
    ];

    // Add language filter for Polylang
    if ($lang && function_exists('pll_current_language')) {
        $args['lang'] = $lang;
    }

    $terms = get_terms($args);

    if (is_wp_error($terms)) {
        return [];
    }

    $categories = [
        ['key' => 'all', 'label' => __('All', 'laundromat'), 'id' => 0],
    ];

    foreach ($terms as $term) {
        $categories[] = [
            'key' => $term->slug,
            'label' => $term->name,
            'id' => $term->term_id,
        ];
    }

    return $categories;
}

/**
 * Get Service Categories
 */
function laundromat_get_service_categories($request)
{
    $lang = $request->get_param('lang');

    $args = [
        'taxonomy' => 'service_category',
        'hide_empty' => false,
        'orderby' => 'meta_value_num',
        'meta_key' => '_sort_order',
        'order' => 'ASC',
    ];

    // Add language filter for Polylang
    if ($lang && function_exists('pll_current_language')) {
        $args['lang'] = $lang;
    }

    $terms = get_terms($args);

    if (is_wp_error($terms)) {
        return [];
    }

    $categories = [];

    foreach ($terms as $term) {
        $categories[] = [
            'key' => $term->slug,
            'label' => $term->name,
            'id' => $term->term_id,
            'order' => get_term_meta($term->term_id, '_sort_order', true) ?: 0,
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
        // Remove trailing slash from URL
        $url = rtrim($lang['url'], '/');
        
        $formatted_languages[] = [
            'code' => $lang['slug'],
            'name' => $lang['name'],
            'url' => $url,
            'flag' => $lang['flag'] ?? '',
            'is_current' => $lang['slug'] === $current_lang,
        ];
    }

    return [
        'current' => $current_lang,
        'languages' => $formatted_languages,
    ];
}

/**
 * Get Homepage Tips - Only returns tips selected in settings for the specified language
 * If no tips are selected, returns all tips for that language
 */
function laundromat_get_homepage_tips($request)
{
    $lang = $request->get_param('lang');

    // Determine the language to use
    $lang_suffix = '';
    if ($lang) {
        $lang_suffix = '_' . sanitize_text_field($lang);
    } elseif (function_exists('pll_current_language')) {
        $current_lang = pll_current_language('slug');
        if ($current_lang) {
            $lang_suffix = '_' . $current_lang;
            $lang = $current_lang;
        }
    }

    // Get selected tip IDs from language-specific settings
    $selected_tip_ids = [];
    if ($lang_suffix) {
        $selected_tip_ids = get_option('laundromat_homepage_tips' . $lang_suffix, []);
    }

    // Fallback to legacy global setting if no language-specific selection exists
    if (empty($selected_tip_ids)) {
        $selected_tip_ids = get_option('laundromat_homepage_tips', []);
    }

    // Ensure it's an array
    if (!is_array($selected_tip_ids)) {
        $selected_tip_ids = [];
    }

    // Build query arguments
    $args = [
        'post_type' => 'tips',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC',
    ];

    // If tips are selected, only fetch those
    if (!empty($selected_tip_ids)) {
        $args['post__in'] = $selected_tip_ids;
        $args['orderby'] = 'post__in'; // Maintain the order of selected tips
    }

    // Add language filter for Polylang
    if ($lang && function_exists('pll_current_language')) {
        $args['lang'] = $lang;
    }

    $tips = get_posts($args);

    // Format response using the same structure as regular tips endpoint
    $formatted_tips = [];
    foreach ($tips as $tip) {
        $featured_image_url = get_the_post_thumbnail_url($tip->ID, 'full');

        // Get category
        $terms = wp_get_post_terms($tip->ID, 'content_category');
        $category = function_exists('pll__') ? pll__('Tips and tricks') : __('Tips and tricks', 'laundromat');
        $category_slug = 'tips-and-tricks';

        if (!is_wp_error($terms) && !empty($terms)) {
            $category = $terms[0]->name;
            $category_slug = $terms[0]->slug;
        }

        $formatted_tips[] = [
            'id' => $tip->ID,
            'title' => [
                'rendered' => get_the_title($tip->ID),
            ],
            'content' => [
                'rendered' => apply_filters('the_content', $tip->post_content),
            ],
            'featured_image_url' => $featured_image_url ?: '',
            'category' => $category,
            'category_slug' => $category_slug,
            'formatted_date' => get_the_date('F j, Y', $tip->ID),
            'date' => $tip->post_date,
            'slug' => $tip->post_name,
            'lang' => function_exists('pll_get_post_language') ? pll_get_post_language($tip->ID, 'slug') : '',
        ];
    }

    return $formatted_tips;
}

/**
 * Debug Homepage Tips - Shows configuration and what would be returned
 */
function laundromat_debug_homepage_tips($request)
{
    $lang = $request->get_param('lang');

    // Determine the language to use
    $lang_suffix = '';
    if ($lang) {
        $lang_suffix = '_' . sanitize_text_field($lang);
    } elseif (function_exists('pll_current_language')) {
        $current_lang = pll_current_language('slug');
        if ($current_lang) {
            $lang_suffix = '_' . $current_lang;
            $lang = $current_lang;
        }
    }

    // Get selected tip IDs from language-specific settings
    $selected_tip_ids = [];
    if ($lang_suffix) {
        $selected_tip_ids = get_option('laundromat_homepage_tips' . $lang_suffix, []);
    }

    // Fallback to legacy global setting
    $legacy_selected = get_option('laundromat_homepage_tips', []);
    if (empty($selected_tip_ids) && !empty($legacy_selected)) {
        $selected_tip_ids = $legacy_selected;
    }

    if (!is_array($selected_tip_ids)) {
        $selected_tip_ids = [];
    }

    // Get all published tips
    $all_tips_args = [
        'post_type' => 'tips',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'fields' => 'ids',
    ];
    if ($lang && function_exists('pll_current_language')) {
        $all_tips_args['lang'] = $lang;
    }
    $all_tips = get_posts($all_tips_args);

    // Get tips that would be returned
    $args = [
        'post_type' => 'tips',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC',
    ];

    if (!empty($selected_tip_ids)) {
        $args['post__in'] = $selected_tip_ids;
        $args['orderby'] = 'post__in';
    }

    if ($lang && function_exists('pll_current_language')) {
        $args['lang'] = $lang;
    }

    $would_return = get_posts($args);

    return [
        'lang_param' => $lang,
        'lang_suffix' => $lang_suffix,
        'selected_tip_ids' => $selected_tip_ids,
        'selected_count' => count($selected_tip_ids),
        'legacy_selected_ids' => $legacy_selected,
        'total_published_tips_for_lang' => count($all_tips),
        'all_tip_ids_for_lang' => $all_tips,
        'would_return_count' => count($would_return),
        'would_return_ids' => array_map(function ($tip) {
            return $tip->ID;
        }, $would_return),
        'query_args' => $args,
        'polylang_active' => function_exists('pll_current_language'),
    ];
}

/**
 * Get Translated Strings for Frontend UI
 * Returns all registered UI strings translated to the requested language
 */
function laundromat_get_translated_strings($request)
{
    $lang = $request->get_param('lang');

    // All registered UI strings (must match those in functions.php pll_register_string)
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

    $translated = [];

    foreach ($strings as $string) {
        // Create a sanitized key from the string
        $key = sanitize_title($string);

        // Translate using Polylang if available
        if (function_exists('pll_translate_string') && $lang) {
            $translated[$key] = pll_translate_string($string, $lang);
        } elseif (function_exists('pll__')) {
            $translated[$key] = pll__($string);
        } else {
            $translated[$key] = $string;
        }
    }

    return [
        'lang' => $lang ?: (function_exists('pll_current_language') ? pll_current_language('slug') : 'en'),
        'strings' => $translated,
    ];
}

/**
 * Get Privacy Policy page content
 */
function laundromat_get_privacy_policy($request)
{
    return laundromat_get_legal_page('privacy_policy', $request);
}

/**
 * Get Personal Data page content
 */
function laundromat_get_personal_data($request)
{
    return laundromat_get_legal_page('personal_data', $request);
}

/**
 * Helper function to get legal page content
 */
function laundromat_get_legal_page($page_key, $request)
{
    $lang = $request->get_param('lang');

    // Determine language suffix
    $lang_suffix = '';
    if ($lang) {
        $lang_suffix = '_' . sanitize_text_field($lang);
    } elseif (function_exists('pll_current_language')) {
        $current_lang = pll_current_language('slug');
        if ($current_lang) {
            $lang_suffix = '_' . $current_lang;
            $lang = $current_lang;
        }
    }

    // Default to English if no language specified
    if (empty($lang_suffix)) {
        $lang_suffix = '_en';
        $lang = 'en';
    }

    // Get title and content
    $title = get_option('laundromat_' . $page_key . '_title' . $lang_suffix, '');
    $content = get_option('laundromat_' . $page_key . '_content' . $lang_suffix, '');

    // Fallback to English if content is empty
    if (empty($content) && $lang_suffix !== '_en') {
        $title = get_option('laundromat_' . $page_key . '_title_en', '');
        $content = get_option('laundromat_' . $page_key . '_content_en', '');
    }

    // Apply content filters for shortcodes, formatting, etc.
    $content = apply_filters('the_content', $content);

    return [
        'title' => $title,
        'content' => $content,
        'lang' => $lang,
    ];
}
