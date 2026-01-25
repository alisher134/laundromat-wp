<?php
/**
 * Headless Theme - Redirect to admin
 *
 * This is a headless theme, there is no frontend.
 * All requests are redirected to the admin panel.
 *
 * @package Laundromat
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Redirect to admin dashboard
wp_redirect(admin_url());
exit;
