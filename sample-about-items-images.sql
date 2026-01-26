-- Sample About Items for Laundromat (with image icons)
-- Insert this data into your WordPress database to populate the About section slider
-- Replace wp_ with your actual table prefix if different

-- IMPORTANT: Before running this, upload icon images to WordPress Media Library:
-- 1. Go to WordPress Admin → Media → Add New
-- 2. Upload 3 icon images (100x100px PNG with transparent background)
-- 3. Note the attachment IDs (shown in URL when clicking each image)
-- 4. Replace @icon_1_id, @icon_2_id, @icon_3_id below with actual IDs

-- About Item 1: 365 days
INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_name, post_modified, post_modified_gmt, post_type, post_mime_type, comment_count)
VALUES (1, NOW(), UTC_TIMESTAMP(), '', '365 days', '', 'publish', 'closed', 'closed', '365-days', NOW(), UTC_TIMESTAMP(), 'about_items', '', 0);

SET @about_item_1_id = LAST_INSERT_ID();

-- Set featured image (replace 123 with actual attachment ID from Media Library)
-- Example: If your uploaded clock icon has ID 123
-- UPDATE wp_posts SET post_parent = @about_item_1_id WHERE ID = 123;
-- INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@about_item_1_id, '_thumbnail_id', '123');

INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES
(@about_item_1_id, 'secondary_title', 'Open 365 days, 07:00–00:00'),
(@about_item_1_id, 'description', 'Laundry that fits your life, not the other way around');

-- About Item 2: >60 min
INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_name, post_modified, post_modified_gmt, post_type, post_mime_type, comment_count)
VALUES (1, NOW(), UTC_TIMESTAMP(), '', '>60 min', '', 'publish', 'closed', 'closed', 'under-60-min', NOW(), UTC_TIMESTAMP(), 'about_items', '', 0);

SET @about_item_2_id = LAST_INSERT_ID();

-- Set featured image (replace 124 with actual attachment ID from Media Library)
-- Example: If your uploaded timer icon has ID 124
-- UPDATE wp_posts SET post_parent = @about_item_2_id WHERE ID = 124;
-- INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@about_item_2_id, '_thumbnail_id', '124');

INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES
(@about_item_2_id, 'secondary_title', 'Wash & Dry in under 60min'),
(@about_item_2_id, 'description', 'Less time washing, more time living');

-- About Item 3: low prices
INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_name, post_modified, post_modified_gmt, post_type, post_mime_type, comment_count)
VALUES (1, NOW(), UTC_TIMESTAMP(), '', 'low prices', '', 'publish', 'closed', 'closed', 'low-prices', NOW(), UTC_TIMESTAMP(), 'about_items', '', 0);

SET @about_item_3_id = LAST_INSERT_ID();

-- Set featured image (replace 125 with actual attachment ID from Media Library)
-- Example: If your uploaded price tag icon has ID 125
-- UPDATE wp_posts SET post_parent = @about_item_3_id WHERE ID = 125;
-- INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@about_item_3_id, '_thumbnail_id', '125');

INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES
(@about_item_3_id, 'secondary_title', 'Clean laundry at low prices'),
(@about_item_3_id, 'description', 'Quality service without breaking the bank');

-- Success message
SELECT 'Sample About Items inserted successfully! Remember to set featured images via WordPress admin.' AS message;

-- INSTRUCTIONS TO SET FEATURED IMAGES:
-- Method 1: Via WordPress Admin (RECOMMENDED)
-- 1. Go to WordPress Admin → About Items
-- 2. Click on each item to edit
-- 3. In the "Featured Image" box (right sidebar), click "Set featured image"
-- 4. Upload or select an icon image
-- 5. Click "Set featured image"
-- 6. Click "Update"
--
-- Method 2: Via SQL (ADVANCED)
-- 1. Upload images to Media Library first
-- 2. Note the attachment IDs
-- 3. Run these queries for each item:
--    UPDATE wp_posts SET post_parent = {about_item_id} WHERE ID = {attachment_id};
--    INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES ({about_item_id}, '_thumbnail_id', '{attachment_id}');
