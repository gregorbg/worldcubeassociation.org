PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users_accounts` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`type` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_users_accounts`("_order", "_parent_id", "id", "provider", "provider_account_id", "type") SELECT "_order", "_parent_id", "id", "provider", "provider_account_id", "type" FROM `users_accounts`;--> statement-breakpoint
DROP TABLE `users_accounts`;--> statement-breakpoint
ALTER TABLE `__new_users_accounts` RENAME TO `users_accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `users_accounts_order_idx` ON `users_accounts` (`_order`);--> statement-breakpoint
CREATE INDEX `users_accounts_parent_id_idx` ON `users_accounts` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `users_accounts_provider_account_id_idx` ON `users_accounts` (`provider_account_id`);--> statement-breakpoint
CREATE TABLE `__new_payload_preferences_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` text,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_preferences`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_payload_preferences_rels`("id", "order", "parent_id", "path", "users_id") SELECT "id", "order", "parent_id", "path", "users_id" FROM `payload_preferences_rels`;--> statement-breakpoint
DROP TABLE `payload_preferences_rels`;--> statement-breakpoint
ALTER TABLE `__new_payload_preferences_rels` RENAME TO `payload_preferences_rels`;--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_order_idx` ON `payload_preferences_rels` (`order`);--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_parent_idx` ON `payload_preferences_rels` (`parent_id`);--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_path_idx` ON `payload_preferences_rels` (`path`);--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_users_id_idx` ON `payload_preferences_rels` (`users_id`);--> statement-breakpoint
CREATE TABLE `__new_nav_blocks_link_item` (
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
INSERT INTO `__new_nav_blocks_link_item`("_order", "_parent_id", "_path", "id", "display_text", "target_link", "display_icon", "block_name") SELECT "_order", "_parent_id", "_path", "id", "display_text", "target_link", "display_icon", "block_name" FROM `nav_blocks_link_item`;--> statement-breakpoint
DROP TABLE `nav_blocks_link_item`;--> statement-breakpoint
ALTER TABLE `__new_nav_blocks_link_item` RENAME TO `nav_blocks_link_item`;--> statement-breakpoint
CREATE INDEX `nav_blocks_link_item_order_idx` ON `nav_blocks_link_item` (`_order`);--> statement-breakpoint
CREATE INDEX `nav_blocks_link_item_parent_id_idx` ON `nav_blocks_link_item` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `nav_blocks_link_item_path_idx` ON `nav_blocks_link_item` (`_path`);--> statement-breakpoint
CREATE TABLE `__new_nav_blocks_nested_dropdown` (
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
INSERT INTO `__new_nav_blocks_nested_dropdown`("_order", "_parent_id", "_path", "id", "title", "display_icon", "block_name") SELECT "_order", "_parent_id", "_path", "id", "title", "display_icon", "block_name" FROM `nav_blocks_nested_dropdown`;--> statement-breakpoint
DROP TABLE `nav_blocks_nested_dropdown`;--> statement-breakpoint
ALTER TABLE `__new_nav_blocks_nested_dropdown` RENAME TO `nav_blocks_nested_dropdown`;--> statement-breakpoint
CREATE INDEX `nav_blocks_nested_dropdown_order_idx` ON `nav_blocks_nested_dropdown` (`_order`);--> statement-breakpoint
CREATE INDEX `nav_blocks_nested_dropdown_parent_id_idx` ON `nav_blocks_nested_dropdown` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `nav_blocks_nested_dropdown_path_idx` ON `nav_blocks_nested_dropdown` (`_path`);--> statement-breakpoint
CREATE TABLE `__new_nav_blocks_visual_divider` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `nav`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_nav_blocks_visual_divider`("_order", "_parent_id", "_path", "id", "block_name") SELECT "_order", "_parent_id", "_path", "id", "block_name" FROM `nav_blocks_visual_divider`;--> statement-breakpoint
DROP TABLE `nav_blocks_visual_divider`;--> statement-breakpoint
ALTER TABLE `__new_nav_blocks_visual_divider` RENAME TO `nav_blocks_visual_divider`;--> statement-breakpoint
CREATE INDEX `nav_blocks_visual_divider_order_idx` ON `nav_blocks_visual_divider` (`_order`);--> statement-breakpoint
CREATE INDEX `nav_blocks_visual_divider_parent_id_idx` ON `nav_blocks_visual_divider` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `nav_blocks_visual_divider_path_idx` ON `nav_blocks_visual_divider` (`_path`);--> statement-breakpoint
CREATE TABLE `__new_nav_blocks_nav_dropdown` (
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
INSERT INTO `__new_nav_blocks_nav_dropdown`("_order", "_parent_id", "_path", "id", "title", "display_icon", "block_name") SELECT "_order", "_parent_id", "_path", "id", "title", "display_icon", "block_name" FROM `nav_blocks_nav_dropdown`;--> statement-breakpoint
DROP TABLE `nav_blocks_nav_dropdown`;--> statement-breakpoint
ALTER TABLE `__new_nav_blocks_nav_dropdown` RENAME TO `nav_blocks_nav_dropdown`;--> statement-breakpoint
CREATE INDEX `nav_blocks_nav_dropdown_order_idx` ON `nav_blocks_nav_dropdown` (`_order`);--> statement-breakpoint
CREATE INDEX `nav_blocks_nav_dropdown_parent_id_idx` ON `nav_blocks_nav_dropdown` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `nav_blocks_nav_dropdown_path_idx` ON `nav_blocks_nav_dropdown` (`_path`);--> statement-breakpoint
CREATE TABLE `__new_home_blocks_text_card` (
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
	FOREIGN KEY (`header_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_home_blocks_text_card`("_order", "_parent_id", "_path", "id", "heading", "body", "variant", "separator_after_heading", "button_text", "button_link", "header_image_id", "color_palette", "block_name") SELECT "_order", "_parent_id", "_path", "id", "heading", "body", "variant", "separator_after_heading", "button_text", "button_link", "header_image_id", "color_palette", "block_name" FROM `home_blocks_text_card`;--> statement-breakpoint
DROP TABLE `home_blocks_text_card`;--> statement-breakpoint
ALTER TABLE `__new_home_blocks_text_card` RENAME TO `home_blocks_text_card`;--> statement-breakpoint
CREATE INDEX `home_blocks_text_card_order_idx` ON `home_blocks_text_card` (`_order`);--> statement-breakpoint
CREATE INDEX `home_blocks_text_card_parent_id_idx` ON `home_blocks_text_card` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_text_card_path_idx` ON `home_blocks_text_card` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_text_card_header_image_idx` ON `home_blocks_text_card` (`header_image_id`);--> statement-breakpoint
CREATE TABLE `__new_home_blocks_image_only_card` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`main_image_id` integer NOT NULL,
	`heading` text,
	`color_palette` text NOT NULL,
	`block_name` text,
	FOREIGN KEY (`main_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_home_blocks_image_only_card`("_order", "_parent_id", "_path", "id", "main_image_id", "heading", "color_palette", "block_name") SELECT "_order", "_parent_id", "_path", "id", "main_image_id", "heading", "color_palette", "block_name" FROM `home_blocks_image_only_card`;--> statement-breakpoint
DROP TABLE `home_blocks_image_only_card`;--> statement-breakpoint
ALTER TABLE `__new_home_blocks_image_only_card` RENAME TO `home_blocks_image_only_card`;--> statement-breakpoint
CREATE INDEX `home_blocks_image_only_card_order_idx` ON `home_blocks_image_only_card` (`_order`);--> statement-breakpoint
CREATE INDEX `home_blocks_image_only_card_parent_id_idx` ON `home_blocks_image_only_card` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_image_only_card_path_idx` ON `home_blocks_image_only_card` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_image_only_card_main_image_idx` ON `home_blocks_image_only_card` (`main_image_id`);--> statement-breakpoint
CREATE TABLE `__new_home_blocks_testimonial_slide` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`testimonial_id` integer NOT NULL,
	`color_palette` text NOT NULL,
	`block_name` text,
	FOREIGN KEY (`testimonial_id`) REFERENCES `testimonials`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_home_blocks_testimonial_slide`("_order", "_parent_id", "_path", "id", "testimonial_id", "color_palette", "block_name") SELECT "_order", "_parent_id", "_path", "id", "testimonial_id", "color_palette", "block_name" FROM `home_blocks_testimonial_slide`;--> statement-breakpoint
DROP TABLE `home_blocks_testimonial_slide`;--> statement-breakpoint
ALTER TABLE `__new_home_blocks_testimonial_slide` RENAME TO `home_blocks_testimonial_slide`;--> statement-breakpoint
CREATE INDEX `home_blocks_testimonial_slide_order_idx` ON `home_blocks_testimonial_slide` (`_order`);--> statement-breakpoint
CREATE INDEX `home_blocks_testimonial_slide_parent_id_idx` ON `home_blocks_testimonial_slide` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_testimonial_slide_path_idx` ON `home_blocks_testimonial_slide` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_testimonial_slide_testimonial_idx` ON `home_blocks_testimonial_slide` (`testimonial_id`);--> statement-breakpoint
CREATE TABLE `__new_home_blocks_testimonials_spinner` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_home_blocks_testimonials_spinner`("_order", "_parent_id", "_path", "id", "block_name") SELECT "_order", "_parent_id", "_path", "id", "block_name" FROM `home_blocks_testimonials_spinner`;--> statement-breakpoint
DROP TABLE `home_blocks_testimonials_spinner`;--> statement-breakpoint
ALTER TABLE `__new_home_blocks_testimonials_spinner` RENAME TO `home_blocks_testimonials_spinner`;--> statement-breakpoint
CREATE INDEX `home_blocks_testimonials_spinner_order_idx` ON `home_blocks_testimonials_spinner` (`_order`);--> statement-breakpoint
CREATE INDEX `home_blocks_testimonials_spinner_parent_id_idx` ON `home_blocks_testimonials_spinner` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_testimonials_spinner_path_idx` ON `home_blocks_testimonials_spinner` (`_path`);--> statement-breakpoint
CREATE TABLE `__new_home_blocks_featured_competitions` (
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
INSERT INTO `__new_home_blocks_featured_competitions`("_order", "_parent_id", "_path", "id", "competition1_i_d", "color_palette1", "competition2_i_d", "color_palette2", "block_name") SELECT "_order", "_parent_id", "_path", "id", "competition1_i_d", "color_palette1", "competition2_i_d", "color_palette2", "block_name" FROM `home_blocks_featured_competitions`;--> statement-breakpoint
DROP TABLE `home_blocks_featured_competitions`;--> statement-breakpoint
ALTER TABLE `__new_home_blocks_featured_competitions` RENAME TO `home_blocks_featured_competitions`;--> statement-breakpoint
CREATE INDEX `home_blocks_featured_competitions_order_idx` ON `home_blocks_featured_competitions` (`_order`);--> statement-breakpoint
CREATE INDEX `home_blocks_featured_competitions_parent_id_idx` ON `home_blocks_featured_competitions` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_featured_competitions_path_idx` ON `home_blocks_featured_competitions` (`_path`);--> statement-breakpoint
CREATE TABLE `__new_home_blocks_two_blocks_leaf` (
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
INSERT INTO `__new_home_blocks_two_blocks_leaf`("_order", "_parent_id", "_path", "id", "type", "alignment", "block_name") SELECT "_order", "_parent_id", "_path", "id", "type", "alignment", "block_name" FROM `home_blocks_two_blocks_leaf`;--> statement-breakpoint
DROP TABLE `home_blocks_two_blocks_leaf`;--> statement-breakpoint
ALTER TABLE `__new_home_blocks_two_blocks_leaf` RENAME TO `home_blocks_two_blocks_leaf`;--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_leaf_order_idx` ON `home_blocks_two_blocks_leaf` (`_order`);--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_leaf_parent_id_idx` ON `home_blocks_two_blocks_leaf` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_leaf_path_idx` ON `home_blocks_two_blocks_leaf` (`_path`);--> statement-breakpoint
CREATE TABLE `__new_home_blocks_two_blocks_branch` (
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
INSERT INTO `__new_home_blocks_two_blocks_branch`("_order", "_parent_id", "_path", "id", "type", "alignment", "block_name") SELECT "_order", "_parent_id", "_path", "id", "type", "alignment", "block_name" FROM `home_blocks_two_blocks_branch`;--> statement-breakpoint
DROP TABLE `home_blocks_two_blocks_branch`;--> statement-breakpoint
ALTER TABLE `__new_home_blocks_two_blocks_branch` RENAME TO `home_blocks_two_blocks_branch`;--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_branch_order_idx` ON `home_blocks_two_blocks_branch` (`_order`);--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_branch_parent_id_idx` ON `home_blocks_two_blocks_branch` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_branch_path_idx` ON `home_blocks_two_blocks_branch` (`_path`);--> statement-breakpoint
CREATE TABLE `__new_home_blocks_two_blocks` (
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
INSERT INTO `__new_home_blocks_two_blocks`("_order", "_parent_id", "_path", "id", "type", "alignment", "block_name") SELECT "_order", "_parent_id", "_path", "id", "type", "alignment", "block_name" FROM `home_blocks_two_blocks`;--> statement-breakpoint
DROP TABLE `home_blocks_two_blocks`;--> statement-breakpoint
ALTER TABLE `__new_home_blocks_two_blocks` RENAME TO `home_blocks_two_blocks`;--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_order_idx` ON `home_blocks_two_blocks` (`_order`);--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_parent_id_idx` ON `home_blocks_two_blocks` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_two_blocks_path_idx` ON `home_blocks_two_blocks` (`_path`);--> statement-breakpoint
CREATE TABLE `__new_home_blocks_full_width` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_home_blocks_full_width`("_order", "_parent_id", "_path", "id", "block_name") SELECT "_order", "_parent_id", "_path", "id", "block_name" FROM `home_blocks_full_width`;--> statement-breakpoint
DROP TABLE `home_blocks_full_width`;--> statement-breakpoint
ALTER TABLE `__new_home_blocks_full_width` RENAME TO `home_blocks_full_width`;--> statement-breakpoint
CREATE INDEX `home_blocks_full_width_order_idx` ON `home_blocks_full_width` (`_order`);--> statement-breakpoint
CREATE INDEX `home_blocks_full_width_parent_id_idx` ON `home_blocks_full_width` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_full_width_path_idx` ON `home_blocks_full_width` (`_path`);--> statement-breakpoint
CREATE TABLE `__new_home_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`announcements_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`announcements_id`) REFERENCES `announcements`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_home_rels`("id", "order", "parent_id", "path", "announcements_id") SELECT "id", "order", "parent_id", "path", "announcements_id" FROM `home_rels`;--> statement-breakpoint
DROP TABLE `home_rels`;--> statement-breakpoint
ALTER TABLE `__new_home_rels` RENAME TO `home_rels`;--> statement-breakpoint
CREATE INDEX `home_rels_order_idx` ON `home_rels` (`order`);--> statement-breakpoint
CREATE INDEX `home_rels_parent_idx` ON `home_rels` (`parent_id`);--> statement-breakpoint
CREATE INDEX `home_rels_path_idx` ON `home_rels` (`path`);--> statement-breakpoint
CREATE INDEX `home_rels_announcements_id_idx` ON `home_rels` (`announcements_id`);--> statement-breakpoint
CREATE TABLE `__new_home_blocks_announcements_section` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`main_announcement_id` integer NOT NULL,
	`color_palette` text NOT NULL,
	`block_name` text,
	FOREIGN KEY (`main_announcement_id`) REFERENCES `announcements`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_home_blocks_announcements_section`("_order", "_parent_id", "_path", "id", "main_announcement_id", "color_palette", "block_name") SELECT "_order", "_parent_id", "_path", "id", "main_announcement_id", "color_palette", "block_name" FROM `home_blocks_announcements_section`;--> statement-breakpoint
DROP TABLE `home_blocks_announcements_section`;--> statement-breakpoint
ALTER TABLE `__new_home_blocks_announcements_section` RENAME TO `home_blocks_announcements_section`;--> statement-breakpoint
CREATE INDEX `home_blocks_announcements_section_order_idx` ON `home_blocks_announcements_section` (`_order`);--> statement-breakpoint
CREATE INDEX `home_blocks_announcements_section_parent_id_idx` ON `home_blocks_announcements_section` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_announcements_section_path_idx` ON `home_blocks_announcements_section` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_announcements_section_main_announcement_idx` ON `home_blocks_announcements_section` (`main_announcement_id`);--> statement-breakpoint
CREATE TABLE `__new_payload_locked_documents_rels` (
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
	FOREIGN KEY (`parent_id`) REFERENCES `payload_locked_documents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`testimonials_id`) REFERENCES `testimonials`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`announcements_id`) REFERENCES `announcements`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faq_categories_id`) REFERENCES `faq_categories`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faq_questions_id`) REFERENCES `faq_questions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_payload_locked_documents_rels`("id", "order", "parent_id", "path", "media_id", "testimonials_id", "announcements_id", "faq_categories_id", "faq_questions_id", "users_id") SELECT "id", "order", "parent_id", "path", "media_id", "testimonials_id", "announcements_id", "faq_categories_id", "faq_questions_id", "users_id" FROM `payload_locked_documents_rels`;--> statement-breakpoint
DROP TABLE `payload_locked_documents_rels`;--> statement-breakpoint
ALTER TABLE `__new_payload_locked_documents_rels` RENAME TO `payload_locked_documents_rels`;--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_order_idx` ON `payload_locked_documents_rels` (`order`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_parent_idx` ON `payload_locked_documents_rels` (`parent_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_path_idx` ON `payload_locked_documents_rels` (`path`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_media_id_idx` ON `payload_locked_documents_rels` (`media_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_testimonials_id_idx` ON `payload_locked_documents_rels` (`testimonials_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_announcements_id_idx` ON `payload_locked_documents_rels` (`announcements_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_faq_categories_id_idx` ON `payload_locked_documents_rels` (`faq_categories_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_faq_questions_id_idx` ON `payload_locked_documents_rels` (`faq_questions_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_users_id_idx` ON `payload_locked_documents_rels` (`users_id`);--> statement-breakpoint
CREATE TABLE `__new_home_blocks_image_banner` (
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
	FOREIGN KEY (`main_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`bg_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_home_blocks_image_banner`("_order", "_parent_id", "_path", "id", "heading", "body", "main_image_id", "color_palette", "bg_color", "heading_color", "text_color", "bg_image_id", "bg_size", "bg_pos", "block_name") SELECT "_order", "_parent_id", "_path", "id", "heading", "body", "main_image_id", "color_palette", "bg_color", "heading_color", "text_color", "bg_image_id", "bg_size", "bg_pos", "block_name" FROM `home_blocks_image_banner`;--> statement-breakpoint
DROP TABLE `home_blocks_image_banner`;--> statement-breakpoint
ALTER TABLE `__new_home_blocks_image_banner` RENAME TO `home_blocks_image_banner`;--> statement-breakpoint
CREATE INDEX `home_blocks_image_banner_order_idx` ON `home_blocks_image_banner` (`_order`);--> statement-breakpoint
CREATE INDEX `home_blocks_image_banner_parent_id_idx` ON `home_blocks_image_banner` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_image_banner_path_idx` ON `home_blocks_image_banner` (`_path`);--> statement-breakpoint
CREATE INDEX `home_blocks_image_banner_main_image_idx` ON `home_blocks_image_banner` (`main_image_id`);--> statement-breakpoint
CREATE INDEX `home_blocks_image_banner_bg_image_idx` ON `home_blocks_image_banner` (`bg_image_id`);