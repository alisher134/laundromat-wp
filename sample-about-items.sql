-- Sample About Items for Laundromat
-- Insert this data into your WordPress database to populate the About section slider
-- Replace wp_ with your actual table prefix if different

-- About Item 1: 365 days
INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_name, post_modified, post_modified_gmt, post_type, post_mime_type, comment_count)
VALUES (1, NOW(), UTC_TIMESTAMP(), '', '365 days', '', 'publish', 'closed', 'closed', '365-days', NOW(), UTC_TIMESTAMP(), 'about_items', '', 0);

SET @about_item_1_id = LAST_INSERT_ID();

INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES
(@about_item_1_id, 'secondary_title', 'Open 365 days, 07:00–00:00'),
(@about_item_1_id, 'description', 'Laundry that fits your life, not the other way around'),
(@about_item_1_id, 'icon_svg', '<svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.013 2.66675C9.63178 2.66675 8.30678 3.21717 7.33536 4.1886C6.36393 5.16003 5.81351 6.48503 5.81351 7.86621C5.81351 9.2474 6.36393 10.5724 7.33536 11.5438C8.30678 12.5152 9.63178 13.0657 11.013 13.0657C12.3942 13.0657 13.7192 12.5152 14.6906 11.5438C15.662 10.5724 16.2124 9.2474 16.2124 7.86621C16.2124 6.48503 15.662 5.16003 14.6906 4.1886C13.7192 3.21717 12.3942 2.66675 11.013 2.66675ZM3.42139 2.27459C4.90049 0.795487 6.9102 -0.0332489 11.013 -0.0332489C13.1157 -0.0332489 15.1324 0.795487 16.6043 2.27459C18.0833 3.74651 18.9124 5.76323 18.9124 7.86621C18.9124 9.96919 18.0833 11.9859 16.6043 13.4578C15.1324 14.9369 13.1157 15.7657 11.013 15.7657C8.9102 15.7657 6.89349 14.9369 5.42157 13.4578C3.94247 11.9859 3.11351 9.96919 3.11351 7.86621C3.11351 5.76323 3.94247 3.74651 5.42157 2.27459H3.42139Z" fill="#3A6D90"/><path d="M8.20947 14.014C8.7738 14.6371 9.56109 15.0291 10.4122 15.1109C11.2633 15.1926 12.1147 14.9583 12.7942 14.4549C13.4738 13.9515 13.9309 13.2164 14.0731 12.3989C14.2153 11.5808 14.0319 10.7414 13.5601 10.0494M13.2082 9.61752C12.7738 9.16822 12.2172 8.84636 11.6026 8.68994" stroke="white" stroke-width="1.06719"/></svg>');

-- About Item 2: >60 min
INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_name, post_modified, post_modified_gmt, post_type, post_mime_type, comment_count)
VALUES (1, NOW(), UTC_TIMESTAMP(), '', '>60 min', '', 'publish', 'closed', 'closed', 'under-60-min', NOW(), UTC_TIMESTAMP(), 'about_items', '', 0);

SET @about_item_2_id = LAST_INSERT_ID();

INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES
(@about_item_2_id, 'secondary_title', 'Wash & Dry in under 60min'),
(@about_item_2_id, 'description', 'Less time washing, more time living'),
(@about_item_2_id, 'icon_svg', '<svg viewBox="0 0 26 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8184 0.732422C11.6465 0.732422 10.5228 1.19859 9.69384 2.02756C8.86487 2.85653 8.3987 3.98023 8.3987 5.15215V7.67534H3.61719V27.2676H22.0195V7.67534H17.238V5.15215C17.238 3.98023 16.7718 2.85653 15.9429 2.02756C15.1139 1.19859 13.9902 0.732422 12.8184 0.732422Z" fill="#3A6D90"/><path d="M7.59375 12.5664C7.59375 16.7421 10.7556 20.1445 14.7031 20.1445C18.6506 20.1445 21.8125 16.7421 21.8125 12.5664" fill="#3A6D90"/></svg>');

-- About Item 3: low prices
INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_name, post_modified, post_modified_gmt, post_type, post_mime_type, comment_count)
VALUES (1, NOW(), UTC_TIMESTAMP(), '', 'low prices', '', 'publish', 'closed', 'closed', 'low-prices', NOW(), UTC_TIMESTAMP(), 'about_items', '', 0);

SET @about_item_3_id = LAST_INSERT_ID();

INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES
(@about_item_3_id, 'secondary_title', 'Clean laundry at low prices'),
(@about_item_3_id, 'description', 'Quality service without breaking the bank'),
(@about_item_3_id, 'icon_svg', '<svg viewBox="0 0 37 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27.64 34.46C27.36 34.46 27.08 34.37 26.86 34.18L19.81 28.57C19.22 28.12 18.92 27.42 18.99 26.71L20.15 13.83C20.26 12.65 21.29 11.74 22.49 11.74C22.58 11.74 22.66 11.74 22.75 11.75L35.63 12.91C36.34 12.98 37.04 13.28 37.49 13.87C37.95 14.46 38.12 15.2 38 15.93L35.88 28.8C35.77 29.54 35.35 30.18 34.74 30.56C34.13 30.94 33.38 31.04 32.69 30.83L28.28 34.29C28.08 34.4 27.86 34.46 27.64 34.46Z" fill="#3A6D90"/><path d="M14 14.271C14.86 15.239 16.06 15.848 17.35 15.975C18.65 16.102 19.95 15.738 20.98 14.956C22.02 14.174 22.7101 13.032 22.9301 11.762C23.1401 10.491 22.87 9.187 22.15 8.112M21.61 7.44101C20.95 6.74301 20.1 6.243 19.17 6" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>');

-- Set language for all items (English by default)
-- Adjust this based on your Polylang language term IDs
-- You can find these in wp_term_taxonomy where taxonomy = 'language'
-- Example: if English language term_id is 2
-- INSERT INTO wp_term_relationships (object_id, term_taxonomy_id) VALUES
-- (@about_item_1_id, 2),
-- (@about_item_2_id, 2),
-- (@about_item_3_id, 2);

-- Success message
SELECT 'Sample About Items inserted successfully!' AS message;
