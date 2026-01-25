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
    $map_pos_mobile_top = get_post_meta($post->ID, 'map_pos_mobile_top', true);
    $map_pos_mobile_left = get_post_meta($post->ID, 'map_pos_mobile_left', true);
    $map_pos_desktop_top = get_post_meta($post->ID, 'map_pos_desktop_top', true);
    $map_pos_desktop_left = get_post_meta($post->ID, 'map_pos_desktop_left', true);
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
            <input type="text" id="address" name="address" value="<?php echo esc_attr($address); ?>" placeholder="Ethniki Palaiokastritsas, Kerkira 491 00, Greece">
        </div>

        <div class="field-row">
            <div class="field-group">
                <label for="store_hours"><?php _e('Store Hours', 'laundromat'); ?></label>
                <input type="text" id="store_hours" name="store_hours" value="<?php echo esc_attr($store_hours); ?>" placeholder="Mon-Sun 7am - 11pm">
            </div>
            <div class="field-group">
                <label for="phone"><?php _e('Phone', 'laundromat'); ?></label>
                <input type="text" id="phone" name="phone" value="<?php echo esc_attr($phone); ?>" placeholder="8 800 600 14 41">
            </div>
        </div>

        <div class="field-row">
            <div class="field-group">
                <label for="latitude"><?php _e('Latitude', 'laundromat'); ?></label>
                <input type="number" step="any" id="latitude" name="latitude" value="<?php echo esc_attr($latitude); ?>" placeholder="39.6243">
            </div>
            <div class="field-group">
                <label for="longitude"><?php _e('Longitude', 'laundromat'); ?></label>
                <input type="number" step="any" id="longitude" name="longitude" value="<?php echo esc_attr($longitude); ?>" placeholder="19.9217">
            </div>
        </div>

        <div class="field-section">
            <h4><?php _e('Map Marker Position (for static map image)', 'laundromat'); ?></h4>
            <div class="field-row">
                <div class="field-group">
                    <label for="map_pos_mobile_top"><?php _e('Mobile - Top %', 'laundromat'); ?></label>
                    <input type="text" id="map_pos_mobile_top" name="map_pos_mobile_top" value="<?php echo esc_attr($map_pos_mobile_top); ?>" placeholder="21%">
                </div>
                <div class="field-group">
                    <label for="map_pos_mobile_left"><?php _e('Mobile - Left %', 'laundromat'); ?></label>
                    <input type="text" id="map_pos_mobile_left" name="map_pos_mobile_left" value="<?php echo esc_attr($map_pos_mobile_left); ?>" placeholder="47%">
                </div>
            </div>
            <div class="field-row" style="margin-top: 10px;">
                <div class="field-group">
                    <label for="map_pos_desktop_top"><?php _e('Desktop - Top %', 'laundromat'); ?></label>
                    <input type="text" id="map_pos_desktop_top" name="map_pos_desktop_top" value="<?php echo esc_attr($map_pos_desktop_top); ?>" placeholder="21%">
                </div>
                <div class="field-group">
                    <label for="map_pos_desktop_left"><?php _e('Desktop - Left %', 'laundromat'); ?></label>
                    <input type="text" id="map_pos_desktop_left" name="map_pos_desktop_left" value="<?php echo esc_attr($map_pos_desktop_left); ?>" placeholder="36%">
                </div>
            </div>
        </div>
    </div>
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

    // Ensure we have at least one empty row for new services
    if (empty($price_rows)) {
        $price_rows = [['feature' => '', 'time' => '', 'time_unit' => 'min', 'price' => '']];
    }
    ?>
    <style>
        .laundromat-meta-box { display: grid; gap: 15px; }
        .laundromat-meta-box .field-group { display: grid; gap: 5px; }
        .laundromat-meta-box label { font-weight: 600; }
        .laundromat-meta-box input[type="text"],
        .laundromat-meta-box input[type="number"],
        .laundromat-meta-box select { width: 100%; padding: 8px; }
        .laundromat-meta-box .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .laundromat-meta-box .field-section { background: #f9f9f9; padding: 15px; border-radius: 4px; margin-top: 10px; }
        .laundromat-meta-box .field-section h4 { margin: 0 0 10px 0; }
        .price-row { display: grid; grid-template-columns: 2fr 1fr 100px 1fr 40px; gap: 10px; align-items: end; margin-bottom: 10px; padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 4px; }
        .price-row .field-group { margin: 0; }
        .price-row input, .price-row select { padding: 6px 8px; }
        .remove-row { background: #dc3232; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px; height: 36px; }
        .remove-row:hover { background: #c92c2c; }
        .add-row { background: #0073aa; color: white; border: none; padding: 8px 16px; cursor: pointer; border-radius: 4px; margin-top: 10px; }
        .add-row:hover { background: #005a8c; }
        .price-rows-container { margin-top: 10px; }
    </style>
    <div class="laundromat-meta-box">
        <div class="field-group">
            <label for="service_category"><?php _e('Service Category', 'laundromat'); ?></label>
            <select id="service_category" name="service_category">
                <option value="laundry" <?php selected($service_category, 'laundry'); ?>><?php _e('Laundry services', 'laundromat'); ?></option>
                <option value="drying" <?php selected($service_category, 'drying'); ?>><?php _e('Drying services', 'laundromat'); ?></option>
                <option value="specialCleaning" <?php selected($service_category, 'specialCleaning'); ?>><?php _e('Special cleaning', 'laundromat'); ?></option>
            </select>
        </div>

        <div class="field-section">
            <h4><?php _e('Price Table', 'laundromat'); ?></h4>
            <p class="description"><?php _e('Add pricing rows for this service. Each row shows a feature, time, and price.', 'laundromat'); ?></p>

            <div id="price-rows-container" class="price-rows-container">
                <?php foreach ($price_rows as $index => $row): ?>
                <div class="price-row" data-row-index="<?php echo $index; ?>">
                    <div class="field-group">
                        <label><?php _e('Feature', 'laundromat'); ?></label>
                        <input type="text" name="price_rows[<?php echo $index; ?>][feature]" value="<?php echo esc_attr($row['feature'] ?? ''); ?>" placeholder="Detergent included">
                    </div>
                    <div class="field-group">
                        <label><?php _e('Time', 'laundromat'); ?></label>
                        <input type="number" min="0" name="price_rows[<?php echo $index; ?>][time]" value="<?php echo esc_attr($row['time'] ?? ''); ?>" placeholder="30">
                    </div>
                    <div class="field-group">
                        <label><?php _e('Unit', 'laundromat'); ?></label>
                        <select name="price_rows[<?php echo $index; ?>][time_unit]">
                            <option value="min" <?php selected($row['time_unit'] ?? 'min', 'min'); ?>><?php _e('min', 'laundromat'); ?></option>
                            <option value="hours" <?php selected($row['time_unit'] ?? '', 'hours'); ?>><?php _e('hours', 'laundromat'); ?></option>
                        </select>
                    </div>
                    <div class="field-group">
                        <label><?php _e('Price ($)', 'laundromat'); ?></label>
                        <input type="number" step="0.01" min="0" name="price_rows[<?php echo $index; ?>][price]" value="<?php echo esc_attr($row['price'] ?? ''); ?>" placeholder="15">
                    </div>
                    <button type="button" class="remove-row" onclick="removeRow(this)" title="<?php _e('Remove row', 'laundromat'); ?>">&times;</button>
                </div>
                <?php endforeach; ?>
            </div>

            <button type="button" class="add-row" onclick="addPriceRow()"><?php _e('+ Add Row', 'laundromat'); ?></button>
        </div>

        <div class="field-section">
            <h4><?php _e('Action Link', 'laundromat'); ?></h4>
            <p class="description"><?php _e('Optional link displayed below the price table (e.g., "How to use the washing machines").', 'laundromat'); ?></p>

            <div class="field-row">
                <div class="field-group">
                    <label for="action_link_text"><?php _e('Link Text', 'laundromat'); ?></label>
                    <input type="text" id="action_link_text" name="action_link_text" value="<?php echo esc_attr($action_link_text); ?>" placeholder="How to use the washing machines">
                </div>
                <div class="field-group">
                    <label for="action_link_url"><?php _e('Link URL', 'laundromat'); ?></label>
                    <input type="text" id="action_link_url" name="action_link_url" value="<?php echo esc_attr($action_link_url); ?>" placeholder="instructions.html">
                </div>
            </div>
        </div>
    </div>

    <script>
    var rowIndex = <?php echo count($price_rows); ?>;

    function addPriceRow() {
        var container = document.getElementById('price-rows-container');
        var row = document.createElement('div');
        row.className = 'price-row';
        row.setAttribute('data-row-index', rowIndex);
        row.innerHTML = `
            <div class="field-group">
                <label><?php _e('Feature', 'laundromat'); ?></label>
                <input type="text" name="price_rows[${rowIndex}][feature]" value="" placeholder="Detergent included">
            </div>
            <div class="field-group">
                <label><?php _e('Time', 'laundromat'); ?></label>
                <input type="number" min="0" name="price_rows[${rowIndex}][time]" value="" placeholder="30">
            </div>
            <div class="field-group">
                <label><?php _e('Unit', 'laundromat'); ?></label>
                <select name="price_rows[${rowIndex}][time_unit]">
                    <option value="min"><?php _e('min', 'laundromat'); ?></option>
                    <option value="hours"><?php _e('hours', 'laundromat'); ?></option>
                </select>
            </div>
            <div class="field-group">
                <label><?php _e('Price ($)', 'laundromat'); ?></label>
                <input type="number" step="0.01" min="0" name="price_rows[${rowIndex}][price]" value="" placeholder="15">
            </div>
            <button type="button" class="remove-row" onclick="removeRow(this)" title="<?php _e('Remove row', 'laundromat'); ?>">&times;</button>
        `;
        container.appendChild(row);
        rowIndex++;
    }

    function removeRow(button) {
        var row = button.closest('.price-row');
        var container = document.getElementById('price-rows-container');
        if (container.querySelectorAll('.price-row').length > 1) {
            row.remove();
        } else {
            alert('<?php _e('At least one price row is required.', 'laundromat'); ?>');
        }
    }
    </script>
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

    // Save Location Meta
    if (isset($_POST['laundromat_location_meta_box_nonce']) &&
        wp_verify_nonce($_POST['laundromat_location_meta_box_nonce'], 'laundromat_location_meta_box')) {

        $location_fields = [
            'address', 'store_hours', 'phone',
            'map_pos_mobile_top', 'map_pos_mobile_left',
            'map_pos_desktop_top', 'map_pos_desktop_left'
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
}
