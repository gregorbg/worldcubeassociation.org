-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `media` (
	`id` integer PRIMARY KEY NOT NULL,
	`alt` text NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`url` text,
	`thumbnail_u_r_l` text,
	`filename` text,
	`mime_type` text,
	`filesize` numeric,
	`width` numeric,
	`height` numeric,
	`focal_x` numeric,
	`focal_y` numeric
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_filename_idx` ON `media` (`filename`);--> statement-breakpoint
CREATE INDEX `media_created_at_idx` ON `media` (`created_at`);--> statement-breakpoint
CREATE INDEX `media_updated_at_idx` ON `media` (`updated_at`);--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY NOT NULL,
	`image_id` integer,
	`punchline` text NOT NULL,
	`full_testimonial` text NOT NULL,
	`who_dunnit` text NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `testimonials_created_at_idx` ON `testimonials` (`created_at`);--> statement-breakpoint
CREATE INDEX `testimonials_updated_at_idx` ON `testimonials` (`updated_at`);--> statement-breakpoint
CREATE INDEX `testimonials_image_idx` ON `testimonials` (`image_id`);--> statement-breakpoint
CREATE TABLE `users_accounts` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`type` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `users_accounts_provider_account_id_idx` ON `users_accounts` (`provider_account_id`);--> statement-breakpoint
CREATE INDEX `users_accounts_parent_id_idx` ON `users_accounts` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `users_accounts_order_idx` ON `users_accounts` (`_order`);--> statement-breakpoint
CREATE TABLE `payload_locked_documents` (
	`id` integer PRIMARY KEY NOT NULL,
	`global_slug` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `payload_locked_documents_created_at_idx` ON `payload_locked_documents` (`created_at`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_updated_at_idx` ON `payload_locked_documents` (`updated_at`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_global_slug_idx` ON `payload_locked_documents` (`global_slug`);--> statement-breakpoint
CREATE TABLE `payload_preferences` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text,
	`value` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `payload_preferences_created_at_idx` ON `payload_preferences` (`created_at`);--> statement-breakpoint
CREATE INDEX `payload_preferences_updated_at_idx` ON `payload_preferences` (`updated_at`);--> statement-breakpoint
CREATE INDEX `payload_preferences_key_idx` ON `payload_preferences` (`key`);--> statement-breakpoint
CREATE TABLE `payload_preferences_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` text,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_preferences`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_users_id_idx` ON `payload_preferences_rels` (`users_id`);--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_path_idx` ON `payload_preferences_rels` (`path`);--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_parent_idx` ON `payload_preferences_rels` (`parent_id`);--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_order_idx` ON `payload_preferences_rels` (`order`);--> statement-breakpoint
CREATE TABLE `payload_migrations` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`batch` numeric,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `payload_migrations_created_at_idx` ON `payload_migrations` (`created_at`);--> statement-breakpoint
CREATE INDEX `payload_migrations_updated_at_idx` ON `payload_migrations` (`updated_at`);--> statement-breakpoint
CREATE TABLE `nav_blocks_link_item` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`display_text` text NOT NULL,
	`target_link` text NOT NULL,
	`display_icon` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `nav`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `nav_blocks_link_item_path_idx` ON `nav_blocks_link_item` (`_path`);--> statement-breakpoint
CREATE INDEX `nav_blocks_link_item_parent_id_idx` ON `nav_blocks_link_item` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `nav_blocks_link_item_order_idx` ON `nav_blocks_link_item` (`_order`);--> statement-breakpoint
CREATE TABLE `nav_blocks_nested_dropdown` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`display_icon` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `nav`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `nav_blocks_nested_dropdown_path_idx` ON `nav_blocks_nested_dropdown` (`_path`);--> statement-breakpoint
CREATE INDEX `nav_blocks_nested_dropdown_parent_id_idx` ON `nav_blocks_nested_dropdown` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `nav_blocks_nested_dropdown_order_idx` ON `nav_blocks_nested_dropdown` (`_order`);--> statement-breakpoint
CREATE TABLE `nav_blocks_visual_divider` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `nav`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `nav_blocks_visual_divider_path_idx` ON `nav_blocks_visual_divider` (`_path`);--> statement-breakpoint
CREATE INDEX `nav_blocks_visual_divider_parent_id_idx` ON `nav_blocks_visual_divider` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `nav_blocks_visual_divider_order_idx` ON `nav_blocks_visual_divider` (`_order`);--> statement-breakpoint
CREATE TABLE `nav_blocks_nav_dropdown` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`display_icon` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `nav`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `nav_blocks_nav_dropdown_path_idx` ON `nav_blocks_nav_dropdown` (`_path`);--> statement-breakpoint
CREATE INDEX `nav_blocks_nav_dropdown_parent_id_idx` ON `nav_blocks_nav_dropdown` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `nav_blocks_nav_dropdown_order_idx` ON `nav_blocks_nav_dropdown` (`_order`);--> statement-breakpoint
CREATE TABLE `home_blocks_text_card` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`heading` text NOT NULL,
	`body` text NOT NULL,
	`variant` text DEFAULT 'info' NOT NULL,
	`separator_after_heading` integer DEFAULT false NOT NULL,
	`button_text` text,
	`button_link` text,
	`header_image_id` integer,
	`color_palette` text NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`header_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `home_blocks_text_card_header_image_idx` ON `home_blocks_text_card` (`header_image_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_text_card_path_idx` ON `home_blocks_text_card` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_text_card_parent_id_idx` ON `home_blocks_text_card` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_text_card_order_idx` ON `home_blocks_text_card` (`_order`);--> statement-breakpoint
CREATE TABLE `home_blocks_image_only_card` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`main_image_id` integer NOT NULL,
	`heading` text,
	`color_palette` text NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`main_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `home_blocks_image_only_card_main_image_idx` ON `home_blocks_image_only_card` (`main_image_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_image_only_card_path_idx` ON `home_blocks_image_only_card` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_image_only_card_parent_id_idx` ON `home_blocks_image_only_card` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_image_only_card_order_idx` ON `home_blocks_image_only_card` (`_order`);--> statement-breakpoint
CREATE TABLE `home_blocks_testimonial_slide` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`testimonial_id` integer NOT NULL,
	`color_palette` text NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`testimonial_id`) REFERENCES `testimonials`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `home_blocks_testimonial_slide_testimonial_idx` ON `home_blocks_testimonial_slide` (`testimonial_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_testimonial_slide_path_idx` ON `home_blocks_testimonial_slide` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_testimonial_slide_parent_id_idx` ON `home_blocks_testimonial_slide` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_testimonial_slide_order_idx` ON `home_blocks_testimonial_slide` (`_order`);--> statement-breakpoint
CREATE TABLE `home_blocks_testimonials_spinner` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `home_blocks_testimonials_spinner_path_idx` ON `home_blocks_testimonials_spinner` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_testimonials_spinner_parent_id_idx` ON `home_blocks_testimonials_spinner` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_testimonials_spinner_order_idx` ON `home_blocks_testimonials_spinner` (`_order`);--> statement-breakpoint
CREATE TABLE `home_blocks_featured_competitions` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`competition1_i_d` text NOT NULL,
	`color_palette1` text NOT NULL,
	`competition2_i_d` text NOT NULL,
	`color_palette2` text NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `home_blocks_featured_competitions_path_idx` ON `home_blocks_featured_competitions` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_featured_competitions_parent_id_idx` ON `home_blocks_featured_competitions` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_featured_competitions_order_idx` ON `home_blocks_featured_competitions` (`_order`);--> statement-breakpoint
CREATE TABLE `home_blocks_two_blocks_leaf` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`alignment` text NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_leaf_path_idx` ON `home_blocks_two_blocks_leaf` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_leaf_parent_id_idx` ON `home_blocks_two_blocks_leaf` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_leaf_order_idx` ON `home_blocks_two_blocks_leaf` (`_order`);--> statement-breakpoint
CREATE TABLE `home_blocks_two_blocks_branch` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`alignment` text NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_branch_path_idx` ON `home_blocks_two_blocks_branch` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_branch_parent_id_idx` ON `home_blocks_two_blocks_branch` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_branch_order_idx` ON `home_blocks_two_blocks_branch` (`_order`);--> statement-breakpoint
CREATE TABLE `home_blocks_two_blocks` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`alignment` text NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_path_idx` ON `home_blocks_two_blocks` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_parent_id_idx` ON `home_blocks_two_blocks` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_order_idx` ON `home_blocks_two_blocks` (`_order`);--> statement-breakpoint
CREATE TABLE `home_blocks_full_width` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `home_blocks_full_width_path_idx` ON `home_blocks_full_width` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_full_width_parent_id_idx` ON `home_blocks_full_width` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_full_width_order_idx` ON `home_blocks_full_width` (`_order`);--> statement-breakpoint
CREATE TABLE `home_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`announcements_id` integer,
	FOREIGN KEY (`announcements_id`) REFERENCES `announcements`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `home_rels_announcements_id_idx` ON `home_rels` (`announcements_id`);--> statement-breakpoint
CREATE INDEX `home_rels_path_idx` ON `home_rels` (`path`);--> statement-breakpoint
CREATE INDEX `home_rels_parent_idx` ON `home_rels` (`parent_id`);--> statement-breakpoint
CREATE INDEX `home_rels_order_idx` ON `home_rels` (`order`);--> statement-breakpoint
CREATE TABLE `home_blocks_announcements_section` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`main_announcement_id` integer NOT NULL,
	`color_palette` text NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`main_announcement_id`) REFERENCES `announcements`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `home_blocks_announcements_section_main_announcement_idx` ON `home_blocks_announcements_section` (`main_announcement_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_announcements_section_path_idx` ON `home_blocks_announcements_section` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_announcements_section_parent_id_idx` ON `home_blocks_announcements_section` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_announcements_section_order_idx` ON `home_blocks_announcements_section` (`_order`);--> statement-breakpoint
CREATE TABLE `faq_categories` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`color_palette` text NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `faq_categories_created_at_idx` ON `faq_categories` (`created_at`);--> statement-breakpoint
CREATE INDEX `faq_categories_updated_at_idx` ON `faq_categories` (`updated_at`);--> statement-breakpoint
CREATE TABLE `faq_questions` (
	`id` integer PRIMARY KEY NOT NULL,
	`category_id` integer NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `faq_categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `faq_questions_created_at_idx` ON `faq_questions` (`created_at`);--> statement-breakpoint
CREATE INDEX `faq_questions_updated_at_idx` ON `faq_questions` (`updated_at`);--> statement-breakpoint
CREATE INDEX `faq_questions_category_idx` ON `faq_questions` (`category_id`);--> statement-breakpoint
CREATE TABLE `payload_locked_documents_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`media_id` integer,
	`testimonials_id` integer,
	`announcements_id` integer,
	`faq_categories_id` integer,
	`faq_questions_id` integer,
	`users_id` text,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faq_questions_id`) REFERENCES `faq_questions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faq_categories_id`) REFERENCES `faq_categories`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`announcements_id`) REFERENCES `announcements`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`testimonials_id`) REFERENCES `testimonials`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_locked_documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_users_id_idx` ON `payload_locked_documents_rels` (`users_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_faq_questions_id_idx` ON `payload_locked_documents_rels` (`faq_questions_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_faq_categories_id_idx` ON `payload_locked_documents_rels` (`faq_categories_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_announcements_id_idx` ON `payload_locked_documents_rels` (`announcements_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_testimonials_id_idx` ON `payload_locked_documents_rels` (`testimonials_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_media_id_idx` ON `payload_locked_documents_rels` (`media_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_path_idx` ON `payload_locked_documents_rels` (`path`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_parent_idx` ON `payload_locked_documents_rels` (`parent_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_order_idx` ON `payload_locked_documents_rels` (`order`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`email_verified` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	`name` text,
	`image` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `users_created_at_idx` ON `users` (`created_at`);--> statement-breakpoint
CREATE INDEX `users_updated_at_idx` ON `users` (`updated_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `nav` (
	`id` integer PRIMARY KEY NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
--> statement-breakpoint
CREATE TABLE `home_blocks_image_banner` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`heading` text NOT NULL,
	`body` text NOT NULL,
	`main_image_id` integer NOT NULL,
	`color_palette` text NOT NULL,
	`bg_color` text NOT NULL,
	`heading_color` text NOT NULL,
	`text_color` text NOT NULL,
	`bg_image_id` integer,
	`bg_size` numeric DEFAULT '100',
	`bg_pos` text DEFAULT 'right',
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`bg_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`main_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `home_blocks_image_banner_bg_image_idx` ON `home_blocks_image_banner` (`bg_image_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_image_banner_main_image_idx` ON `home_blocks_image_banner` (`main_image_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_image_banner_path_idx` ON `home_blocks_image_banner` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_image_banner_parent_id_idx` ON `home_blocks_image_banner` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_image_banner_order_idx` ON `home_blocks_image_banner` (`_order`);--> statement-breakpoint
CREATE TABLE `home` (
	`id` integer PRIMARY KEY NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` integer PRIMARY KEY NOT NULL,
	`image_id` integer,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`published_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`published_by_id` text NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`published_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `announcements_created_at_idx` ON `announcements` (`created_at`);--> statement-breakpoint
CREATE INDEX `announcements_updated_at_idx` ON `announcements` (`updated_at`);--> statement-breakpoint
CREATE INDEX `announcements_published_by_idx` ON `announcements` (`published_by_id`);--> statement-breakpoint
CREATE INDEX `announcements_image_idx` ON `announcements` (`image_id`);
*/