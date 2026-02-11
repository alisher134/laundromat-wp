<?php
/**
 * Custom Meta Boxes for Admin UI
 *
 * @package Laundromat
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Remove default title and editor for custom post types
 * (they are included in the respective metaboxes instead)
 */
add_action('init', 'laundromat_remove_default_editor_support');

function laundromat_remove_default_editor_support()
{
    $post_types = ['services', 'instructions', 'tips', 'faqs', 'about_items', 'reviews'];
    foreach ($post_types as $post_type) {
        remove_post_type_support($post_type, 'title');
        remove_post_type_support($post_type, 'editor');
    }
}

/**
 * Remove default featured image metabox for CPTs with inline upload
 */
add_action('add_meta_boxes', 'laundromat_remove_default_thumbnail_metabox', 99);

function laundromat_remove_default_thumbnail_metabox()
{
    $post_types = ['services', 'instructions', 'tips', 'about_items', 'reviews'];
    foreach ($post_types as $post_type) {
        remove_meta_box('postimagediv', $post_type, 'side');
    }
}

/**
 * Enqueue media uploader scripts for custom post types
 */
add_action('admin_enqueue_scripts', 'laundromat_enqueue_media_uploader');

function laundromat_enqueue_media_uploader($hook)
{
    global $post_type;

    $post_types_with_upload = ['services', 'instructions', 'tips', 'about_items', 'reviews'];

    if (($hook === 'post.php' || $hook === 'post-new.php') && in_array($post_type, $post_types_with_upload)) {
        wp_enqueue_media();
    }
}

/**
 * Render inline image upload field
 */
function laundromat_render_image_upload_field($post_id, $label = 'Image', $description = '')
{
    $thumbnail_id = get_post_thumbnail_id($post_id);
    $thumbnail_url = $thumbnail_id ? wp_get_attachment_image_url($thumbnail_id, 'medium') : '';
    ?>
    <div class="field-group laundromat-image-upload">
        <label><?php echo esc_html($label); ?></label>
        <div class="image-upload-container">
            <div class="image-preview" <?php echo $thumbnail_url ? '' : 'style="display:none;"'; ?>>
                <img src="<?php echo esc_url($thumbnail_url); ?>" alt="">
                <button type="button" class="remove-image button-link">&times;</button>
            </div>
            <div class="image-upload-buttons" <?php echo $thumbnail_url ? 'style="display:none;"' : ''; ?>>
                <button type="button" class="upload-image button button-secondary">
                    <?php _e('Upload Image', 'laundromat'); ?>
                </button>
            </div>
            <input type="hidden" name="_thumbnail_id" value="<?php echo esc_attr($thumbnail_id); ?>">
        </div>
        <?php if ($description): ?>
            <p class="description"><?php echo esc_html($description); ?></p>
        <?php endif; ?>
    </div>

    <style>
        .laundromat-image-upload .image-upload-container {
            margin-top: 8px;
        }
        .laundromat-image-upload .image-preview {
            position: relative;
            display: inline-block;
            max-width: 300px;
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;
            background: #f9f9f9;
        }
        .laundromat-image-upload .image-preview img {
            display: block;
            max-width: 100%;
            height: auto;
        }
        .laundromat-image-upload .remove-image {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 24px;
            height: 24px;
            background: rgba(0,0,0,0.6);
            color: #fff;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            line-height: 22px;
            text-align: center;
            text-decoration: none;
        }
        .laundromat-image-upload .remove-image:hover {
            background: rgba(200,0,0,0.8);
        }
        .laundromat-image-upload .upload-image {
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
    </style>

    <script>
    jQuery(document).ready(function($) {
        if (window.laundromatImageUploadInitialized) return;
        window.laundromatImageUploadInitialized = true;

        $(document).on('click', '.laundromat-image-upload .upload-image', function(e) {
            e.preventDefault();
            var container = $(this).closest('.image-upload-container');
            var frame = wp.media({
                title: '<?php echo esc_js(__('Select Image', 'laundromat')); ?>',
                button: { text: '<?php echo esc_js(__('Use this image', 'laundromat')); ?>' },
                multiple: false
            });

            frame.on('select', function() {
                var attachment = frame.state().get('selection').first().toJSON();
                var imgUrl = attachment.sizes && attachment.sizes.medium ? attachment.sizes.medium.url : attachment.url;
                container.find('.image-preview img').attr('src', imgUrl);
                container.find('.image-preview').show();
                container.find('.image-upload-buttons').hide();
                container.find('input[name="_thumbnail_id"]').val(attachment.id);
            });

            frame.open();
        });

        $(document).on('click', '.laundromat-image-upload .remove-image', function(e) {
            e.preventDefault();
            var container = $(this).closest('.image-upload-container');
            container.find('.image-preview').hide();
            container.find('.image-preview img').attr('src', '');
            container.find('.image-upload-buttons').show();
            container.find('input[name="_thumbnail_id"]').val('');
        });
    });
    </script>
    <?php
}

/**
 * Add Meta Boxes
 */
add_action('add_meta_boxes', 'laundromat_add_meta_boxes');

function laundromat_add_meta_boxes()
{
    // Location Details Meta Box
    add_meta_box(
        'location_details',
        __('Location Details', 'laundromat'),
        'laundromat_location_meta_box_callback',
        'locations',
        'normal',
        'high'
    );

    // Service Details Meta Box
    add_meta_box(
        'service_details',
        __('Service Details', 'laundromat'),
        'laundromat_service_meta_box_callback',
        'services',
        'normal',
        'high'
    );

    // Contact Details Meta Box
    add_meta_box(
        'contact_details',
        __('Contact Details', 'laundromat'),
        'laundromat_contact_details_meta_box_callback',
        'contact_messages',
        'side',
        'high'
    );

    // Instruction Details Meta Box
    add_meta_box(
        'instruction_details',
        __('Instruction Details', 'laundromat'),
        'laundromat_instruction_meta_box_callback',
        'instructions',
        'normal',
        'high'
    );

    // Tips Details Meta Box
    add_meta_box(
        'tip_details',
        __('Tip Details', 'laundromat'),
        'laundromat_tip_meta_box_callback',
        'tips',
        'normal',
        'high'
    );

    // FAQ Details Meta Box
    add_meta_box(
        'faq_details',
        __('FAQ Details', 'laundromat'),
        'laundromat_faq_meta_box_callback',
        'faqs',
        'normal',
        'high'
    );

    // About Item Details Meta Box
    add_meta_box(
        'about_item_details',
        __('About Item Details', 'laundromat'),
        'laundromat_about_item_meta_box_callback',
        'about_items',
        'normal',
        'high'
    );

    // Review Details Meta Box
    add_meta_box(
        'review_details',
        __('Review Details', 'laundromat'),
        'laundromat_review_meta_box_callback',
        'reviews',
        'normal',
        'high'
    );
}

/**
 * Location Meta Box Callback
 */
function laundromat_location_meta_box_callback($post)
{
    wp_nonce_field('laundromat_location_meta_box', 'laundromat_location_meta_box_nonce');

    $address = get_post_meta($post->ID, 'address', true);
    $store_hours = get_post_meta($post->ID, 'store_hours', true);
    $phone = get_post_meta($post->ID, 'phone', true);
    $latitude = get_post_meta($post->ID, 'latitude', true);
    $longitude = get_post_meta($post->ID, 'longitude', true);
    $google_maps_url = get_post_meta($post->ID, 'google_maps_url', true);
    $map_pos_mobile_top = get_post_meta($post->ID, 'map_pos_mobile_top', true);
    $map_pos_mobile_left = get_post_meta($post->ID, 'map_pos_mobile_left', true);
    $map_pos_tablet_top = get_post_meta($post->ID, 'map_pos_tablet_top', true);
    $map_pos_tablet_left = get_post_meta($post->ID, 'map_pos_tablet_left', true);
    $map_pos_medium_top = get_post_meta($post->ID, 'map_pos_medium_top', true);
    $map_pos_medium_left = get_post_meta($post->ID, 'map_pos_medium_left', true);
    $map_pos_large_top = get_post_meta($post->ID, 'map_pos_large_top', true);
    $map_pos_large_left = get_post_meta($post->ID, 'map_pos_large_left', true);
    ?>
    <style>
        .laundromat-meta-box { display: grid; gap: 15px; }
        .laundromat-meta-box .field-group { display: grid; gap: 5px; }
        .laundromat-meta-box label { font-weight: 600; }
        .laundromat-meta-box input[type="text"],
        .laundromat-meta-box input[type="number"] { width: 100%; padding: 8px; }
        .laundromat-meta-box .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .laundromat-meta-box .field-section { background: #f9f9f9; padding: 15px; border-radius: 4px; margin-top: 10px; }
        .laundromat-meta-box .field-section h4 { margin: 0 0 10px 0; }
    </style>
    <div class="laundromat-meta-box">
        <div class="field-group">
            <label for="address"><?php _e('Full Address', 'laundromat'); ?></label>
            <input type="text" id="address" name="address" value="<?php echo esc_attr($address); ?>" placeholder="<?php esc_attr_e('Ethniki Palaiokastritsas, Kerkira 491 00, Greece', 'laundromat'); ?>">
        </div>

        <div class="field-row">
            <div class="field-group">
                <label for="store_hours"><?php _e('Store Hours', 'laundromat'); ?></label>
                <input type="text" id="store_hours" name="store_hours" value="<?php echo esc_attr($store_hours); ?>" placeholder="<?php esc_attr_e('Mon-Sun 7am - 11pm', 'laundromat'); ?>">
            </div>
            <div class="field-group">
                <label for="phone"><?php _e('Phone', 'laundromat'); ?></label>
                <input type="text" id="phone" name="phone" value="<?php echo esc_attr($phone); ?>" placeholder="<?php esc_attr_e('8 800 600 14 41', 'laundromat'); ?>">
            </div>
        </div>

        <div class="field-row">
            <div class="field-group">
                <label for="latitude"><?php _e('Latitude', 'laundromat'); ?></label>
                <input type="number" step="any" id="latitude" name="latitude" value="<?php echo esc_attr($latitude); ?>" placeholder="<?php esc_attr_e('39.6243', 'laundromat'); ?>">
            </div>
            <div class="field-group">
                <label for="longitude"><?php _e('Longitude', 'laundromat'); ?></label>
                <input type="number" step="any" id="longitude" name="longitude" value="<?php echo esc_attr($longitude); ?>" placeholder="<?php esc_attr_e('19.9217', 'laundromat'); ?>">
            </div>
        </div>

        <div class="field-group">
            <label for="google_maps_url"><?php _e('Google Maps URL', 'laundromat'); ?></label>
            <input type="text" id="google_maps_url" name="google_maps_url" value="<?php echo esc_attr($google_maps_url); ?>" placeholder="<?php esc_attr_e('https://goo.gl/maps/...', 'laundromat'); ?>">
            <p class="description"><?php _e('Link to this location on Google Maps.', 'laundromat'); ?></p>
        </div>

        <div class="field-section map-visual-picker">
            <h4><?php _e('Map Marker Alignment', 'laundromat'); ?></h4>
            
            <div class="field-row" style="margin-bottom: 20px;">
                <div class="field-group">
                    <label><?php _e('Mobile Position', 'laundromat'); ?></label>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="map_pos_mobile_top" name="map_pos_mobile_top" value="<?php echo esc_attr($map_pos_mobile_top); ?>" placeholder="Top %" style="width: 80px;">
                        <input type="text" id="map_pos_mobile_left" name="map_pos_mobile_left" value="<?php echo esc_attr($map_pos_mobile_left); ?>" placeholder="Left %" style="width: 80px;">
                    </div>
                </div>
                <div class="field-group">
                    <label><?php _e('Tablet Position', 'laundromat'); ?></label>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="map_pos_tablet_top" name="map_pos_tablet_top" value="<?php echo esc_attr($map_pos_tablet_top); ?>" placeholder="Top %" style="width: 80px;">
                        <input type="text" id="map_pos_tablet_left" name="map_pos_tablet_left" value="<?php echo esc_attr($map_pos_tablet_left); ?>" placeholder="Left %" style="width: 80px;">
                    </div>
                </div>
            </div>

            <div class="field-row" style="margin-bottom: 20px;">
                <div class="field-group">
                    <label><?php _e('Medium Position', 'laundromat'); ?></label>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="map_pos_medium_top" name="map_pos_medium_top" value="<?php echo esc_attr($map_pos_medium_top); ?>" placeholder="Top %" style="width: 80px;">
                        <input type="text" id="map_pos_medium_left" name="map_pos_medium_left" value="<?php echo esc_attr($map_pos_medium_left); ?>" placeholder="Left %" style="width: 80px;">
                    </div>
                </div>
                <div class="field-group">
                    <label><?php _e('Large Position', 'laundromat'); ?></label>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="map_pos_large_top" name="map_pos_large_top" value="<?php echo esc_attr($map_pos_large_top); ?>" placeholder="Top %" style="width: 80px;">
                        <input type="text" id="map_pos_large_left" name="map_pos_large_left" value="<?php echo esc_attr($map_pos_large_left); ?>" placeholder="Left %" style="width: 80px;">
                    </div>
                </div>
            </div>


            <div class="map-picker-tabs" style="margin-bottom: 10px; border-bottom: 1px solid #ccc; display: flex; flex-wrap: wrap; gap: 6px;">
                <button type="button" class="button picker-tab-btn" data-tab="mobile"><?php _e('Mobile Map Preview', 'laundromat'); ?></button>
                <button type="button" class="button picker-tab-btn" data-tab="tablet"><?php _e('Tablet Map Preview', 'laundromat'); ?></button>
                <button type="button" class="button picker-tab-btn" data-tab="medium"><?php _e('Medium Map Preview', 'laundromat'); ?></button>
                <button type="button" class="button picker-tab-btn" data-tab="large"><?php _e('Large Map Preview', 'laundromat'); ?></button>
            </div>
            
            <div class="map-picker-content mobile-picker" id="mobile-map-picker" data-scale="mobile">
                <div class="map-container-relative">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/mobile-map-image.png" draggable="false">
                    <div class="picker-marker" id="mobile-marker"></div>
                </div>
            </div>

            <div class="map-picker-content tablet-picker" id="tablet-map-picker" data-scale="tablet">
                <div class="map-container-relative">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/tablet-map-image.png" draggable="false">
                    <div class="picker-marker" id="tablet-marker"></div>
                </div>
            </div>

            <div class="map-picker-content medium-picker" id="medium-map-picker" data-scale="medium">
                <div class="map-container-relative">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/medium-map-image.png" draggable="false">
                    <div class="picker-marker" id="medium-marker"></div>
                </div>
            </div>

            <div class="map-picker-content large-picker" id="large-map-picker" data-scale="large">
                <div class="map-container-relative">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/large-map-image.png" draggable="false">
                    <div class="picker-marker" id="large-marker"></div>
                </div>
            </div>
            
            
            <p class="description" style="margin-top: 10px;"><?php _e('Click on the map preview to set the marker position. You can also manually adjust the percentage values above.', 'laundromat'); ?></p>
        </div>
    </div>

    <style>
        .map-container-relative { 
            position: relative; 
            display: inline-block; 
            cursor: crosshair; 
            border: 1px solid #ccc; 
            margin-top: 5px;
            background: #eee;
        }
        .map-container-relative img { 
            display: block; 
            max-width: 100%; 
            height: auto; 
            user-select: none;
            -webkit-user-drag: none;
        }
        .picker-marker { 
            position: absolute; 
            width: 14px; 
            height: 14px; 
            background: #3a6d90; 
            border: 2px solid #fff; 
            border-radius: 50%; 
            transform: translate(-50%, -50%); 
            pointer-events: none; 
            box-shadow: 0 0 5px rgba(0,0,0,0.5); 
            z-index: 10;
        }
        .map-picker-content { display: none; background: #fff; padding: 10px; border: 1px solid #ddd; border-top: none; }
        .map-picker-content.active { display: block; }
        .picker-tab-btn.active { background: #fff !important; border-bottom: 1px solid #fff !important; margin-bottom: -1px; z-index: 2; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
    </style>

    <script>
    jQuery(document).ready(function($) {
        console.log('Map Picker: Initializing...');

        // Tabs logic
        $('.picker-tab-btn').on('click', function(e) {
            e.preventDefault();
            $('.picker-tab-btn').removeClass('active button-primary').addClass('button-secondary');
            $(this).addClass('active button-primary').removeClass('button-secondary');
            
            $('.map-picker-content').hide().removeClass('active');
            var tabId = $(this).data('tab');
            $('#' + tabId + '-map-picker').show().addClass('active');
            
            updateMarkersFromInputs();
        });

        // Initialize first tab
        $('.picker-tab-btn[data-tab="mobile"]').trigger('click');

        // Update markers from inputs
        function updateMarkersFromInputs() {
            var ensurePercent = function(val) {
                if (val === undefined || val === null || val === '') return '0%';
                val = val.toString().trim();
                if (val && !val.includes('%') && !isNaN(val)) return val + '%';
                return val || '0%';
            };

            var mTop = ensurePercent($('#map_pos_mobile_top').val());
            var mLeft = ensurePercent($('#map_pos_mobile_left').val());
            var tTop = ensurePercent($('#map_pos_tablet_top').val());
            var tLeft = ensurePercent($('#map_pos_tablet_left').val());
            var medTop = ensurePercent($('#map_pos_medium_top').val());
            var medLeft = ensurePercent($('#map_pos_medium_left').val());
            var lTop = ensurePercent($('#map_pos_large_top').val());
            var lLeft = ensurePercent($('#map_pos_large_left').val());
            
            console.log('Map Picker: Updating markers:', { mTop, mLeft, tTop, tLeft, medTop, medLeft, lTop, lLeft });
            
            $('#mobile-marker').css({ 'top': mTop, 'left': mLeft });
            $('#tablet-marker').css({ 'top': tTop, 'left': tLeft });
            $('#medium-marker').css({ 'top': medTop, 'left': medLeft });
            $('#large-marker').css({ 'top': lTop, 'left': lLeft });
        }

        // Auto-fix units on blur
        $('input[id^="map_pos_"]').on('blur', function() {
            var val = $(this).val().trim();
            if (val && !val.includes('%') && !isNaN(val)) {
                $(this).val(val + '%');
                updateMarkersFromInputs();
            }
        });

        $('input[id^="map_pos_"]').on('input change', updateMarkersFromInputs);
        
        // Initial marker update
        setTimeout(updateMarkersFromInputs, 500);

        // Click on map to set position
        $(document).on('click', '.map-container-relative', function(e) {
            var $container = $(this);
            var offset = $container.offset();
            var x = e.pageX - offset.left;
            var y = e.pageY - offset.top;
            var w = $container.width();
            var h = $container.height();
            
            if (w === 0 || h === 0) {
                console.error('Map Picker: Container dimensions are 0');
                return;
            }

            var xPct = Math.round((x / w) * 1000) / 10 + '%';
            var yPct = Math.round((y / h) * 1000) / 10 + '%';
            
            console.log('Map Picker: Clicked at', { x, y, xPct, yPct });

            var scale = $container.closest('.map-picker-content').data('scale') || 'mobile';
            if (scale === 'mobile') {
                $('#map_pos_mobile_top').val(yPct);
                $('#map_pos_mobile_left').val(xPct);
            } else if (scale === 'tablet') {
                $('#map_pos_tablet_top').val(yPct);
                $('#map_pos_tablet_left').val(xPct);
            } else if (scale === 'medium') {
                $('#map_pos_medium_top').val(yPct);
                $('#map_pos_medium_left').val(xPct);
            } else if (scale === 'large') {
                $('#map_pos_large_top').val(yPct);
                $('#map_pos_large_left').val(xPct);
            }
            updateMarkersFromInputs();
        });
    });
    </script>
    <?php
}

/**
 * Contact Details Meta Box Callback
 */
function laundromat_contact_details_meta_box_callback($post)
{
    $name = get_post_meta($post->ID, 'contact_name', true);
    $email = get_post_meta($post->ID, 'contact_email', true);
    $phone = get_post_meta($post->ID, 'contact_phone', true);
    ?>
    <style>
        .contact-details-box { display: grid; gap: 12px; }
        .contact-details-box .contact-field { display: grid; gap: 4px; }
        .contact-details-box .contact-label { font-weight: 600; color: #1d2327; font-size: 13px; }
        .contact-details-box .contact-value { color: #2c3338; font-size: 13px; word-break: break-word; }
        .contact-details-box .contact-value a { color: #2271b1; text-decoration: none; }
        .contact-details-box .contact-value a:hover { color: #135e96; text-decoration: underline; }
        .contact-details-box .no-value { color: #646970; font-style: italic; }
    </style>
    <div class="contact-details-box">
        <div class="contact-field">
            <div class="contact-label"><?php _e('Name', 'laundromat'); ?></div>
            <div class="contact-value">
                <?php echo $name ? esc_html($name) : '<span class="no-value">' . __('Not provided', 'laundromat') . '</span>'; ?>
            </div>
        </div>

        <div class="contact-field">
            <div class="contact-label"><?php _e('Email', 'laundromat'); ?></div>
            <div class="contact-value">
                <?php if ($email): ?>
                    <a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a>
                <?php else: ?>
                    <span class="no-value"><?php _e('Not provided', 'laundromat'); ?></span>
                <?php endif; ?>
            </div>
        </div>

        <div class="contact-field">
            <div class="contact-label"><?php _e('Phone', 'laundromat'); ?></div>
            <div class="contact-value">
                <?php if ($phone): ?>
                    <a href="tel:<?php echo esc_attr($phone); ?>"><?php echo esc_html($phone); ?></a>
                <?php else: ?>
                    <span class="no-value"><?php _e('Not provided', 'laundromat'); ?></span>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <?php
}

/**
 * Service Meta Box Callback
 */
function laundromat_service_meta_box_callback($post)
{
    wp_nonce_field('laundromat_service_meta_box', 'laundromat_service_meta_box_nonce');

    $service_category = get_post_meta($post->ID, 'service_category', true);
    $price_rows_json = get_post_meta($post->ID, 'price_rows', true);
    $price_rows = $price_rows_json ? json_decode($price_rows_json, true) : [];
    $action_link_text = get_post_meta($post->ID, 'action_link_text', true);
    $action_link_url = get_post_meta($post->ID, 'action_link_url', true);

    // Pad array to 5 rows for display
    while (count($price_rows) < 5) {
        $price_rows[] = ['feature' => '', 'time' => '', 'time_unit' => 'min', 'price' => ''];
    }
    ?>
    <style>
        .laundromat-meta-box { display: grid; gap: 15px; }
        .laundromat-meta-box .field-group { display: grid; gap: 5px; }
        .laundromat-meta-box label { font-weight: 600; }
        .laundromat-meta-box input[type="text"],
        .laundromat-meta-box input[type="number"],
        .laundromat-meta-box select,
        .laundromat-meta-box textarea { width: 100%; padding: 8px; }
        .laundromat-meta-box textarea { min-height: 80px; resize: vertical; }
        .laundromat-meta-box .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .laundromat-meta-box .field-section { background: #f9f9f9; padding: 15px; border-radius: 4px; margin-top: 10px; }
        .laundromat-meta-box .field-section h4 { margin: 0 0 10px 0; }
        .price-row { display: grid; grid-template-columns: 2fr 1fr 100px 1fr; gap: 10px; align-items: end; margin-bottom: 10px; }
        .price-row .field-group { margin: 0; }
        .price-row input, .price-row select { padding: 6px 8px; }
        .price-row-header { display: grid; grid-template-columns: 2fr 1fr 100px 1fr; gap: 10px; margin-bottom: 5px; }
        .price-row-header span { font-weight: 600; font-size: 13px; }
    </style>
    <div class="laundromat-meta-box">
        <div class="field-group">
            <label for="service_title"><?php _e('Title', 'laundromat'); ?></label>
            <input type="text" id="service_title" name="service_title" value="<?php echo esc_attr($post->post_title); ?>" placeholder="<?php esc_attr_e('Washing machines', 'laundromat'); ?>">
        </div>

        <div class="field-group">
            <label for="service_description"><?php _e('Description', 'laundromat'); ?></label>
            <?php
            wp_editor($post->post_content, 'service_description', [
                'textarea_name' => 'service_description',
                'textarea_rows' => 8,
                'media_buttons' => true,
                'teeny' => false,
                'quicktags' => true,
                'tinymce' => [
                    'toolbar1' => 'bold,italic,underline,link,image,code,fontsizeselect,alignleft,aligncenter,alignright,bullist,numlist,wp_adv',
                    'toolbar2' => 'formatselect,removeformat,undo,redo',
                    'block_formats' => 'Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4', 'image_advtab' => true, 'fontsize_formats' => '8pt 9pt 10pt 11pt 12pt 13pt 14pt 16pt 18pt 20pt 24pt 30pt 36pt 48pt 60pt 72pt',
                ],
            ]);
            ?>
            <p class="description"><?php _e('Use the formatting buttons above to add headings, lists, and links.', 'laundromat'); ?></p>
        </div>

        <div class="field-section">
            <h4><?php _e('Price Table', 'laundromat'); ?></h4>
            <p class="description"><?php _e('Enter pricing rows for this service. Empty rows will be ignored.', 'laundromat'); ?></p>

            <div class="price-row-header">
                <span><?php _e('Feature', 'laundromat'); ?></span>
                <span><?php _e('Time', 'laundromat'); ?></span>
                <span><?php _e('Unit', 'laundromat'); ?></span>
                <span><?php _e('Price ($)', 'laundromat'); ?></span>
            </div>

            <div id="price-rows-container">
            <?php for ($i = 0; $i < 5; $i++): $row = $price_rows[$i]; ?>
            <div class="price-row">
                <div class="field-group">
                    <input type="text" name="price_rows[<?php echo $i; ?>][feature]" value="<?php echo esc_attr($row['feature'] ?? ''); ?>" placeholder="<?php esc_attr_e('Detergent included', 'laundromat'); ?>">
                </div>
                <div class="field-group">
                    <input type="number" min="0" name="price_rows[<?php echo $i; ?>][time]" value="<?php echo esc_attr($row['time'] ?? ''); ?>" placeholder="<?php esc_attr_e('30', 'laundromat'); ?>">
                </div>
                <div class="field-group">
                    <select name="price_rows[<?php echo $i; ?>][time_unit]">
                        <option value="min" <?php selected($row['time_unit'] ?? 'min', 'min'); ?>><?php _e('min', 'laundromat'); ?></option>
                        <option value="hours" <?php selected($row['time_unit'] ?? '', 'hours'); ?>><?php _e('hours', 'laundromat'); ?></option>
                    </select>
                </div>
                <div class="field-group">
                    <input type="number" step="0.01" min="0" name="price_rows[<?php echo $i; ?>][price]" value="<?php echo esc_attr($row['price'] ?? ''); ?>" placeholder="<?php esc_attr_e('15', 'laundromat'); ?>">
                </div>
            </div>
            <?php endfor; ?>
            </div>
            <button type="button" class="button" id="add-price-row" style="margin-top: 10px;"><?php _e('+ Add Row', 'laundromat'); ?></button>
            <script>
            (function() {
                var rowIndex = 5;
                document.getElementById('add-price-row').addEventListener('click', function() {
                    var container = document.getElementById('price-rows-container');
                    var row = document.createElement('div');
                    row.className = 'price-row';
                    row.innerHTML = '<div class="field-group"><input type="text" name="price_rows[' + rowIndex + '][feature]" placeholder="<?php echo esc_js(__('Detergent included', 'laundromat')); ?>"></div>' +
                        '<div class="field-group"><input type="number" min="0" name="price_rows[' + rowIndex + '][time]" placeholder="<?php echo esc_js(__('30', 'laundromat')); ?>"></div>' +
                        '<div class="field-group"><select name="price_rows[' + rowIndex + '][time_unit]"><option value="min"><?php echo esc_js(__('min', 'laundromat')); ?></option><option value="hours"><?php echo esc_js(__('hours', 'laundromat')); ?></option></select></div>' +
                        '<div class="field-group"><input type="number" step="0.01" min="0" name="price_rows[' + rowIndex + '][price]" placeholder="<?php echo esc_js(__('15', 'laundromat')); ?>"></div>';
                    container.appendChild(row);
                    rowIndex++;
                });
            })();
            </script>
        </div>

        <div class="field-section">
            <h4><?php _e('Action Link', 'laundromat'); ?></h4>
            <p class="description"><?php _e('Optional link displayed below the price table (e.g., "How to use the washing machines").', 'laundromat'); ?></p>

            <div class="field-row">
                <div class="field-group">
                    <label for="action_link_text"><?php _e('Link Text', 'laundromat'); ?></label>
                    <input type="text" id="action_link_text" name="action_link_text" value="<?php echo esc_attr($action_link_text); ?>" placeholder="<?php esc_attr_e('How to use the washing machines', 'laundromat'); ?>">
                </div>
                <div class="field-group">
                    <label for="action_link_url"><?php _e('Link URL', 'laundromat'); ?></label>
                    <input type="text" id="action_link_url" name="action_link_url" value="<?php echo esc_attr($action_link_url); ?>" placeholder="<?php esc_attr_e('instructions.html', 'laundromat'); ?>">
                </div>
            </div>
        </div>

        <?php laundromat_render_image_upload_field($post->ID, __('Service Image', 'laundromat'), __('Image displayed on the service card. Recommended size: 600x400px.', 'laundromat')); ?>
    </div>
    <?php
}

/**
 * Instruction Meta Box Callback
 */
function laundromat_instruction_meta_box_callback($post)
{
    wp_nonce_field('laundromat_instruction_meta_box', 'laundromat_instruction_meta_box_nonce');
    ?>
    <style>
        .laundromat-meta-box { display: grid; gap: 15px; }
        .laundromat-meta-box .field-group { display: grid; gap: 5px; }
        .laundromat-meta-box label { font-weight: 600; }
        .laundromat-meta-box input[type="text"],
        .laundromat-meta-box textarea { width: 100%; padding: 8px; }
        .laundromat-meta-box textarea { min-height: 120px; resize: vertical; }
    </style>
    <div class="laundromat-meta-box">
        <div class="field-group">
            <label for="instruction_title"><?php _e('Title', 'laundromat'); ?></label>
            <input type="text" id="instruction_title" name="instruction_title" value="<?php echo esc_attr($post->post_title); ?>" placeholder="<?php esc_attr_e('How to use the washing machines', 'laundromat'); ?>">
        </div>

        <div class="field-group">
            <label for="instruction_description"><?php _e('Content', 'laundromat'); ?></label>
            <?php
            wp_editor($post->post_content, 'instruction_description', [
                'textarea_name' => 'instruction_description',
                'textarea_rows' => 12,
                'media_buttons' => true,
                'teeny' => false,
                'quicktags' => true,
                'tinymce' => [
                    'toolbar1' => 'bold,italic,underline,link,image,code,fontsizeselect,alignleft,aligncenter,alignright,bullist,numlist,wp_adv',
                    'toolbar2' => 'formatselect,removeformat,undo,redo',
                    'block_formats' => 'Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4', 'image_advtab' => true, 'fontsize_formats' => '8pt 9pt 10pt 11pt 12pt 13pt 14pt 16pt 18pt 20pt 24pt 30pt 36pt 48pt 60pt 72pt',
                ],
            ]);
            ?>
            <p class="description"><?php _e('Use the formatting buttons above to add headings, lists, links, and images.', 'laundromat'); ?></p>
        </div>

        <?php laundromat_render_image_upload_field($post->ID, __('Featured Image', 'laundromat'), __('Main image for the instruction. Recommended size: 800x600px.', 'laundromat')); ?>
    </div>
    <?php
}

/**
 * Tip Meta Box Callback
 */
function laundromat_tip_meta_box_callback($post)
{
    wp_nonce_field('laundromat_tip_meta_box', 'laundromat_tip_meta_box_nonce');
    ?>
    <style>
        .laundromat-meta-box { display: grid; gap: 15px; }
        .laundromat-meta-box .field-group { display: grid; gap: 5px; }
        .laundromat-meta-box label { font-weight: 600; }
        .laundromat-meta-box input[type="text"],
        .laundromat-meta-box textarea { width: 100%; padding: 8px; }
        .laundromat-meta-box textarea { min-height: 120px; resize: vertical; }
    </style>
    <div class="laundromat-meta-box">
        <div class="field-group">
            <label for="tip_title"><?php _e('Title', 'laundromat'); ?></label>
            <input type="text" id="tip_title" name="tip_title" value="<?php echo esc_attr($post->post_title); ?>" placeholder="<?php esc_attr_e('How to separate laundry', 'laundromat'); ?>">
        </div>

        <div class="field-group">
            <label for="tip_description"><?php _e('Content', 'laundromat'); ?></label>
            <?php
            wp_editor($post->post_content, 'tip_description', [
                'textarea_name' => 'tip_description',
                'textarea_rows' => 12,
                'media_buttons' => true,
                'teeny' => false,
                'quicktags' => true,
                'tinymce' => [
                    'toolbar1' => 'bold,italic,underline,link,image,code,fontsizeselect,alignleft,aligncenter,alignright,bullist,numlist,wp_adv',
                    'toolbar2' => 'formatselect,removeformat,undo,redo',
                    'block_formats' => 'Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4', 'image_advtab' => true, 'fontsize_formats' => '8pt 9pt 10pt 11pt 12pt 13pt 14pt 16pt 18pt 20pt 24pt 30pt 36pt 48pt 60pt 72pt',
                ],
            ]);
            ?>
            <p class="description"><?php _e('Use the formatting buttons above to add headings, lists, links, and images.', 'laundromat'); ?></p>
        </div>

        <?php laundromat_render_image_upload_field($post->ID, __('Featured Image', 'laundromat'), __('Main image for the tip. Recommended size: 800x600px.', 'laundromat')); ?>
    </div>
    <?php
}

/**
 * FAQ Meta Box Callback
 */
function laundromat_faq_meta_box_callback($post)
{
    wp_nonce_field('laundromat_faq_meta_box', 'laundromat_faq_meta_box_nonce');
    ?>
    <style>
        .laundromat-meta-box { display: grid; gap: 15px; }
        .laundromat-meta-box .field-group { display: grid; gap: 5px; }
        .laundromat-meta-box label { font-weight: 600; }
        .laundromat-meta-box input[type="text"],
        .laundromat-meta-box textarea { width: 100%; padding: 8px; }
        .laundromat-meta-box textarea { min-height: 100px; resize: vertical; }
    </style>
    <div class="laundromat-meta-box">
        <div class="field-group">
            <label for="faq_question"><?php _e('Question', 'laundromat'); ?></label>
            <input type="text" id="faq_question" name="faq_question" value="<?php echo esc_attr($post->post_title); ?>" placeholder="<?php esc_attr_e('What are your opening hours?', 'laundromat'); ?>">
        </div>

        <div class="field-group">
            <label for="faq_answer"><?php _e('Answer', 'laundromat'); ?></label>
            <textarea id="faq_answer" name="faq_answer" placeholder="<?php esc_attr_e('The answer to the question...', 'laundromat'); ?>"><?php echo esc_textarea($post->post_content); ?></textarea>
        </div>
    </div>
    <?php
}

/**
 * About Item Meta Box Callback
 */
function laundromat_about_item_meta_box_callback($post)
{
    wp_nonce_field('laundromat_about_item_meta_box', 'laundromat_about_item_meta_box_nonce');

    $secondary_title = get_post_meta($post->ID, 'secondary_title', true);
    $description = get_post_meta($post->ID, 'description', true);
    ?>
    <style>
        .laundromat-meta-box { display: grid; gap: 15px; }
        .laundromat-meta-box .field-group { display: grid; gap: 5px; }
        .laundromat-meta-box label { font-weight: 600; }
        .laundromat-meta-box input[type="text"],
        .laundromat-meta-box textarea { width: 100%; padding: 8px; }
        .laundromat-meta-box textarea { min-height: 80px; resize: vertical; }
    </style>
    <div class="laundromat-meta-box">
        <div class="field-group">
            <label for="about_item_title"><?php _e('Title', 'laundromat'); ?></label>
            <input type="text" id="about_item_title" name="about_item_title" value="<?php echo esc_attr($post->post_title); ?>" placeholder="<?php esc_attr_e('365 days', 'laundromat'); ?>">
            <p class="description"><?php _e('Main title displayed on the card (e.g., "365 days", ">60 min", "low prices")', 'laundromat'); ?></p>
        </div>

        <div class="field-group">
            <label for="secondary_title"><?php _e('Secondary Title', 'laundromat'); ?></label>
            <input type="text" id="secondary_title" name="secondary_title" value="<?php echo esc_attr($secondary_title); ?>" placeholder="<?php esc_attr_e('Open 365 days, 07:00–00:00', 'laundromat'); ?>">
            <p class="description"><?php _e('Detailed information or subtitle', 'laundromat'); ?></p>
        </div>

        <div class="field-group">
            <label for="description"><?php _e('Description', 'laundromat'); ?></label>
            <textarea id="description" name="description" placeholder="<?php esc_attr_e('Laundry that fits your life, not the other way around', 'laundromat'); ?>"><?php echo esc_textarea($description); ?></textarea>
            <p class="description"><?php _e('Short description or tagline for the card', 'laundromat'); ?></p>
        </div>

        <?php laundromat_render_image_upload_field($post->ID, __('Icon Image', 'laundromat'), __('Icon displayed on the card. Recommended size: 100x100px, PNG with transparent background.', 'laundromat')); ?>
    </div>
    <?php
}

/**
 * Review Meta Box Callback
 */
function laundromat_review_meta_box_callback($post)
{
    wp_nonce_field('laundromat_review_meta_box', 'laundromat_review_meta_box_nonce');
    ?>
    <style>
        .laundromat-meta-box { display: grid; gap: 15px; }
        .laundromat-meta-box .field-group { display: grid; gap: 5px; }
        .laundromat-meta-box label { font-weight: 600; }
        .laundromat-meta-box input[type="text"],
        .laundromat-meta-box textarea { width: 100%; padding: 8px; }
        .laundromat-meta-box textarea { min-height: 120px; resize: vertical; }
    </style>
    <div class="laundromat-meta-box">
        <div class="field-group">
            <label for="review_author_name"><?php _e('Author Name', 'laundromat'); ?></label>
            <input type="text" id="review_author_name" name="review_author_name" value="<?php echo esc_attr($post->post_title); ?>" placeholder="<?php esc_attr_e('Andrey', 'laundromat'); ?>">
            <p class="description"><?php _e('The name of the person who wrote this review', 'laundromat'); ?></p>
        </div>

        <div class="field-group">
            <label for="review_text"><?php _e('Review Text', 'laundromat'); ?></label>
            <textarea id="review_text" name="review_text" placeholder="<?php esc_attr_e('Write the review text here...', 'laundromat'); ?>"><?php echo esc_textarea($post->post_content); ?></textarea>
            <p class="description"><?php _e('The full text of the review', 'laundromat'); ?></p>
        </div>

        <div class="field-group">
            <label for="aggregator_url"><?php _e('Review Source URL', 'laundromat'); ?></label>
            <input type="text" id="aggregator_url" name="aggregator_url" value="<?php echo esc_attr(get_post_meta($post->ID, 'aggregator_url', true)); ?>" placeholder="<?php esc_attr_e('https://google.com/maps/...', 'laundromat'); ?>">
            <p class="description"><?php _e('Link to the original review in an aggregator (Google, TripAdvisor, etc.) for the "Read More" button.', 'laundromat'); ?></p>
        </div>

        <?php laundromat_render_image_upload_field($post->ID, __('Profile Photo', 'laundromat'), __('Author photo. Recommended size: 80x80px or larger. If not provided, a default icon will be shown.', 'laundromat')); ?>
    </div>
    <?php
}

/**
 * Save Meta Box Data
 */
add_action('save_post', 'laundromat_save_meta_boxes');

function laundromat_save_meta_boxes($post_id)
{
    // Check autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Check permissions
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    // Save thumbnail for CPTs with inline image upload
    $post_types_with_upload = ['services', 'instructions', 'tips', 'about_items', 'reviews'];
    if (in_array(get_post_type($post_id), $post_types_with_upload) && isset($_POST['_thumbnail_id'])) {
        $thumbnail_id = intval($_POST['_thumbnail_id']);
        if ($thumbnail_id > 0) {
            set_post_thumbnail($post_id, $thumbnail_id);
        } else {
            delete_post_thumbnail($post_id);
        }
    }

    // Save Location Meta
    if (isset($_POST['laundromat_location_meta_box_nonce']) &&
        wp_verify_nonce($_POST['laundromat_location_meta_box_nonce'], 'laundromat_location_meta_box')) {

        $location_fields = [
            'address', 'store_hours', 'phone', 'google_maps_url',
            'map_pos_mobile_top', 'map_pos_mobile_left',
            'map_pos_tablet_top', 'map_pos_tablet_left',
            'map_pos_medium_top', 'map_pos_medium_left',
            'map_pos_large_top', 'map_pos_large_left',
        ];

        foreach ($location_fields as $field) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
            }
        }

        // Numeric fields
        if (isset($_POST['latitude'])) {
            update_post_meta($post_id, 'latitude', floatval($_POST['latitude']));
        }
        if (isset($_POST['longitude'])) {
            update_post_meta($post_id, 'longitude', floatval($_POST['longitude']));
        }
    }

    // Save Service Meta
    if (isset($_POST['laundromat_service_meta_box_nonce']) &&
        wp_verify_nonce($_POST['laundromat_service_meta_box_nonce'], 'laundromat_service_meta_box')) {

        // Save title and description
        if (isset($_POST['service_title']) || isset($_POST['service_description'])) {
            // Unhook to prevent infinite loop
            remove_action('save_post', 'laundromat_save_meta_boxes');

            wp_update_post([
                'ID' => $post_id,
                'post_title' => sanitize_text_field($_POST['service_title'] ?? ''),
                'post_content' => wp_kses_post($_POST['service_description'] ?? ''),
            ]);

            // Re-hook
            add_action('save_post', 'laundromat_save_meta_boxes');
        }

        if (isset($_POST['service_category'])) {
            update_post_meta($post_id, 'service_category', sanitize_text_field($_POST['service_category']));
        }

        // Save price rows as JSON
        if (isset($_POST['price_rows']) && is_array($_POST['price_rows'])) {
            $price_rows = [];
            foreach ($_POST['price_rows'] as $row) {
                // Skip empty rows
                if (empty($row['feature']) && empty($row['time']) && empty($row['price'])) {
                    continue;
                }
                $price_rows[] = [
                    'feature' => sanitize_text_field($row['feature'] ?? ''),
                    'time' => sanitize_text_field($row['time'] ?? ''),
                    'time_unit' => sanitize_text_field($row['time_unit'] ?? 'min'),
                    'price' => sanitize_text_field($row['price'] ?? ''),
                ];
            }
            update_post_meta($post_id, 'price_rows', wp_json_encode($price_rows));
        }

        // Save action link fields
        if (isset($_POST['action_link_text'])) {
            update_post_meta($post_id, 'action_link_text', sanitize_text_field($_POST['action_link_text']));
        }
        if (isset($_POST['action_link_url'])) {
            update_post_meta($post_id, 'action_link_url', esc_url_raw($_POST['action_link_url']));
        }
    }

    // Save Instruction Meta
    if (isset($_POST['laundromat_instruction_meta_box_nonce']) &&
        wp_verify_nonce($_POST['laundromat_instruction_meta_box_nonce'], 'laundromat_instruction_meta_box')) {

        if (isset($_POST['instruction_title']) || isset($_POST['instruction_description'])) {
            remove_action('save_post', 'laundromat_save_meta_boxes');

            wp_update_post([
                'ID' => $post_id,
                'post_title' => sanitize_text_field($_POST['instruction_title'] ?? ''),
                'post_content' => wp_kses_post($_POST['instruction_description'] ?? ''),
            ]);

            add_action('save_post', 'laundromat_save_meta_boxes');
        }
    }

    // Save Tip Meta
    if (isset($_POST['laundromat_tip_meta_box_nonce']) &&
        wp_verify_nonce($_POST['laundromat_tip_meta_box_nonce'], 'laundromat_tip_meta_box')) {

        if (isset($_POST['tip_title']) || isset($_POST['tip_description'])) {
            remove_action('save_post', 'laundromat_save_meta_boxes');

            wp_update_post([
                'ID' => $post_id,
                'post_title' => sanitize_text_field($_POST['tip_title'] ?? ''),
                'post_content' => wp_kses_post($_POST['tip_description'] ?? ''),
            ]);

            add_action('save_post', 'laundromat_save_meta_boxes');
        }
    }

    // Save FAQ Meta
    if (isset($_POST['laundromat_faq_meta_box_nonce']) &&
        wp_verify_nonce($_POST['laundromat_faq_meta_box_nonce'], 'laundromat_faq_meta_box')) {

        if (isset($_POST['faq_question']) || isset($_POST['faq_answer'])) {
            remove_action('save_post', 'laundromat_save_meta_boxes');

            wp_update_post([
                'ID' => $post_id,
                'post_title' => sanitize_text_field($_POST['faq_question'] ?? ''),
                'post_content' => wp_kses_post($_POST['faq_answer'] ?? ''),
            ]);

            add_action('save_post', 'laundromat_save_meta_boxes');
        }
    }

    // Save About Item Meta
    if (isset($_POST['laundromat_about_item_meta_box_nonce']) &&
        wp_verify_nonce($_POST['laundromat_about_item_meta_box_nonce'], 'laundromat_about_item_meta_box')) {

        // Save title
        if (isset($_POST['about_item_title'])) {
            remove_action('save_post', 'laundromat_save_meta_boxes');

            wp_update_post([
                'ID' => $post_id,
                'post_title' => sanitize_text_field($_POST['about_item_title'] ?? ''),
            ]);

            add_action('save_post', 'laundromat_save_meta_boxes');
        }

        // Save meta fields
        if (isset($_POST['secondary_title'])) {
            update_post_meta($post_id, 'secondary_title', sanitize_text_field($_POST['secondary_title']));
        }

        if (isset($_POST['description'])) {
            update_post_meta($post_id, 'description', sanitize_text_field($_POST['description']));
        }
    }

    // Save Review Meta
    if (isset($_POST['laundromat_review_meta_box_nonce']) &&
        wp_verify_nonce($_POST['laundromat_review_meta_box_nonce'], 'laundromat_review_meta_box')) {

        if (isset($_POST['review_author_name']) || isset($_POST['review_text'])) {
            remove_action('save_post', 'laundromat_save_meta_boxes');

            wp_update_post([
                'ID' => $post_id,
                'post_title' => sanitize_text_field($_POST['review_author_name'] ?? ''),
                'post_content' => wp_kses_post($_POST['review_text'] ?? ''),
            ]);

            add_action('save_post', 'laundromat_save_meta_boxes');
        }

        if (isset($_POST['aggregator_url'])) {
            update_post_meta($post_id, 'aggregator_url', esc_url_raw($_POST['aggregator_url']));
        }
    }
}
