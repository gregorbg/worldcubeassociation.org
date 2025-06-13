import { sqliteTable, AnySQLiteColumn, uniqueIndex, index, integer, text, numeric, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const media = sqliteTable("media", {
	id: integer().primaryKey().notNull(),
	alt: text().notNull(),
	updatedAt: text("updated_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
	createdAt: text("created_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
	url: text(),
	thumbnailURL: text("thumbnail_u_r_l"),
	filename: text(),
	mimeType: text("mime_type"),
	filesize: numeric(),
	width: numeric(),
	height: numeric(),
	focalX: numeric("focal_x"),
	focalY: numeric("focal_y"),
},
(table) => [
	uniqueIndex("media_filename_idx").on(table.filename),
	index("media_created_at_idx").on(table.createdAt),
	index("media_updated_at_idx").on(table.updatedAt),
]);

export const testimonials = sqliteTable("testimonials", {
	id: integer().primaryKey().notNull(),
	imageId: integer("image_id").references(() => media.id, { onDelete: "set null" } ),
	punchline: text().notNull(),
	fullTestimonial: text("full_testimonial").notNull(),
	whoDunnit: text("who_dunnit").notNull(),
	updatedAt: text("updated_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
	createdAt: text("created_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
},
(table) => [
	index("testimonials_created_at_idx").on(table.createdAt),
	index("testimonials_updated_at_idx").on(table.updatedAt),
	index("testimonials_image_idx").on(table.imageId),
]);

export const usersAccounts = sqliteTable("users_accounts", {
	order: integer("_order").notNull(),
	parentId: text("_parent_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	id: text().primaryKey().notNull(),
	provider: text().notNull(),
	providerAccountId: text("provider_account_id").notNull(),
	type: text().notNull(),
},
(table) => [
	index("users_accounts_provider_account_id_idx").on(table.providerAccountId),
	index("users_accounts_parent_id_idx").on(table.parentId),
	index("users_accounts_order_idx").on(table.order),
]);

export const payloadLockedDocuments = sqliteTable("payload_locked_documents", {
	id: integer().primaryKey().notNull(),
	globalSlug: text("global_slug"),
	updatedAt: text("updated_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
	createdAt: text("created_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
},
(table) => [
	index("payload_locked_documents_created_at_idx").on(table.createdAt),
	index("payload_locked_documents_updated_at_idx").on(table.updatedAt),
	index("payload_locked_documents_global_slug_idx").on(table.globalSlug),
]);

export const payloadPreferences = sqliteTable("payload_preferences", {
	id: integer().primaryKey().notNull(),
	key: text(),
	value: text(),
	updatedAt: text("updated_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
	createdAt: text("created_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
},
(table) => [
	index("payload_preferences_created_at_idx").on(table.createdAt),
	index("payload_preferences_updated_at_idx").on(table.updatedAt),
	index("payload_preferences_key_idx").on(table.key),
]);

export const payloadPreferencesRels = sqliteTable("payload_preferences_rels", {
	id: integer().primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull().references(() => payloadPreferences.id, { onDelete: "cascade" } ),
	path: text().notNull(),
	usersId: text("users_id").references(() => users.id, { onDelete: "cascade" } ),
},
(table) => [
	index("payload_preferences_rels_users_id_idx").on(table.usersId),
	index("payload_preferences_rels_path_idx").on(table.path),
	index("payload_preferences_rels_parent_idx").on(table.parentId),
	index("payload_preferences_rels_order_idx").on(table.order),
]);

export const payloadMigrations = sqliteTable("payload_migrations", {
	id: integer().primaryKey().notNull(),
	name: text(),
	batch: numeric(),
	updatedAt: text("updated_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
	createdAt: text("created_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
},
(table) => [
	index("payload_migrations_created_at_idx").on(table.createdAt),
	index("payload_migrations_updated_at_idx").on(table.updatedAt),
]);

export const navBlocksLinkItem = sqliteTable("nav_blocks_link_item", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull().references(() => nav.id, { onDelete: "cascade" } ),
	path: text("_path").notNull(),
	id: text().primaryKey().notNull(),
	displayText: text("display_text").notNull(),
	targetLink: text("target_link").notNull(),
	displayIcon: text("display_icon"),
	blockName: text("block_name"),
},
(table) => [
	index("nav_blocks_link_item_path_idx").on(table.path),
	index("nav_blocks_link_item_parent_id_idx").on(table.parentId),
	index("nav_blocks_link_item_order_idx").on(table.order),
]);

export const navBlocksNestedDropdown = sqliteTable("nav_blocks_nested_dropdown", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull().references(() => nav.id, { onDelete: "cascade" } ),
	path: text("_path").notNull(),
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	displayIcon: text("display_icon"),
	blockName: text("block_name"),
},
(table) => [
	index("nav_blocks_nested_dropdown_path_idx").on(table.path),
	index("nav_blocks_nested_dropdown_parent_id_idx").on(table.parentId),
	index("nav_blocks_nested_dropdown_order_idx").on(table.order),
]);

export const navBlocksVisualDivider = sqliteTable("nav_blocks_visual_divider", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull().references(() => nav.id, { onDelete: "cascade" } ),
	path: text("_path").notNull(),
	id: text().primaryKey().notNull(),
	blockName: text("block_name"),
},
(table) => [
	index("nav_blocks_visual_divider_path_idx").on(table.path),
	index("nav_blocks_visual_divider_parent_id_idx").on(table.parentId),
	index("nav_blocks_visual_divider_order_idx").on(table.order),
]);

export const navBlocksNavDropdown = sqliteTable("nav_blocks_nav_dropdown", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull().references(() => nav.id, { onDelete: "cascade" } ),
	path: text("_path").notNull(),
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	displayIcon: text("display_icon"),
	blockName: text("block_name"),
},
(table) => [
	index("nav_blocks_nav_dropdown_path_idx").on(table.path),
	index("nav_blocks_nav_dropdown_parent_id_idx").on(table.parentId),
	index("nav_blocks_nav_dropdown_order_idx").on(table.order),
]);

export const homeBlocksTextCard = sqliteTable("home_blocks_text_card", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull().references(() => home.id, { onDelete: "cascade" } ),
	path: text("_path").notNull(),
	id: text().primaryKey().notNull(),
	heading: text().notNull(),
	body: text().notNull(),
	variant: text().default("info").notNull(),
	separatorAfterHeading: integer("separator_after_heading").default(false).notNull(),
	buttonText: text("button_text"),
	buttonLink: text("button_link"),
	headerImageId: integer("header_image_id").references(() => media.id, { onDelete: "set null" } ),
	colorPalette: text("color_palette").notNull(),
	blockName: text("block_name"),
},
(table) => [
	index("home_blocks_text_card_header_image_idx").on(table.headerImageId),
	index("home_blocks_text_card_path_idx").on(table.path),
	index("home_blocks_text_card_parent_id_idx").on(table.parentId),
	index("home_blocks_text_card_order_idx").on(table.order),
]);

export const homeBlocksImageOnlyCard = sqliteTable("home_blocks_image_only_card", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull().references(() => home.id, { onDelete: "cascade" } ),
	path: text("_path").notNull(),
	id: text().primaryKey().notNull(),
	mainImageId: integer("main_image_id").notNull().references(() => media.id, { onDelete: "set null" } ),
	heading: text(),
	colorPalette: text("color_palette").notNull(),
	blockName: text("block_name"),
},
(table) => [
	index("home_blocks_image_only_card_main_image_idx").on(table.mainImageId),
	index("home_blocks_image_only_card_path_idx").on(table.path),
	index("home_blocks_image_only_card_parent_id_idx").on(table.parentId),
	index("home_blocks_image_only_card_order_idx").on(table.order),
]);

export const homeBlocksTestimonialSlide = sqliteTable("home_blocks_testimonial_slide", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull().references(() => home.id, { onDelete: "cascade" } ),
	path: text("_path").notNull(),
	id: text().primaryKey().notNull(),
	testimonialId: integer("testimonial_id").notNull().references(() => testimonials.id, { onDelete: "set null" } ),
	colorPalette: text("color_palette").notNull(),
	blockName: text("block_name"),
},
(table) => [
	index("home_blocks_testimonial_slide_testimonial_idx").on(table.testimonialId),
	index("home_blocks_testimonial_slide_path_idx").on(table.path),
	index("home_blocks_testimonial_slide_parent_id_idx").on(table.parentId),
	index("home_blocks_testimonial_slide_order_idx").on(table.order),
]);

export const homeBlocksTestimonialsSpinner = sqliteTable("home_blocks_testimonials_spinner", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull().references(() => home.id, { onDelete: "cascade" } ),
	path: text("_path").notNull(),
	id: text().primaryKey().notNull(),
	blockName: text("block_name"),
},
(table) => [
	index("home_blocks_testimonials_spinner_path_idx").on(table.path),
	index("home_blocks_testimonials_spinner_parent_id_idx").on(table.parentId),
	index("home_blocks_testimonials_spinner_order_idx").on(table.order),
]);

export const homeBlocksFeaturedCompetitions = sqliteTable("home_blocks_featured_competitions", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull().references(() => home.id, { onDelete: "cascade" } ),
	path: text("_path").notNull(),
	id: text().primaryKey().notNull(),
	competition1ID: text("competition1_i_d").notNull(),
	colorPalette1: text("color_palette1").notNull(),
	competition2ID: text("competition2_i_d").notNull(),
	colorPalette2: text("color_palette2").notNull(),
	blockName: text("block_name"),
},
(table) => [
	index("home_blocks_featured_competitions_path_idx").on(table.path),
	index("home_blocks_featured_competitions_parent_id_idx").on(table.parentId),
	index("home_blocks_featured_competitions_order_idx").on(table.order),
]);

export const homeBlocksTwoBlocksLeaf = sqliteTable("home_blocks_two_blocks_leaf", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull().references(() => home.id, { onDelete: "cascade" } ),
	path: text("_path").notNull(),
	id: text().primaryKey().notNull(),
	type: text().notNull(),
	alignment: text().notNull(),
	blockName: text("block_name"),
},
(table) => [
	index("home_blocks_two_blocks_leaf_path_idx").on(table.path),
	index("home_blocks_two_blocks_leaf_parent_id_idx").on(table.parentId),
	index("home_blocks_two_blocks_leaf_order_idx").on(table.order),
]);

export const homeBlocksTwoBlocksBranch = sqliteTable("home_blocks_two_blocks_branch", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull().references(() => home.id, { onDelete: "cascade" } ),
	path: text("_path").notNull(),
	id: text().primaryKey().notNull(),
	type: text().notNull(),
	alignment: text().notNull(),
	blockName: text("block_name"),
},
(table) => [
	index("home_blocks_two_blocks_branch_path_idx").on(table.path),
	index("home_blocks_two_blocks_branch_parent_id_idx").on(table.parentId),
	index("home_blocks_two_blocks_branch_order_idx").on(table.order),
]);

export const homeBlocksTwoBlocks = sqliteTable("home_blocks_two_blocks", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull().references(() => home.id, { onDelete: "cascade" } ),
	path: text("_path").notNull(),
	id: text().primaryKey().notNull(),
	type: text().notNull(),
	alignment: text().notNull(),
	blockName: text("block_name"),
},
(table) => [
	index("home_blocks_two_blocks_path_idx").on(table.path),
	index("home_blocks_two_blocks_parent_id_idx").on(table.parentId),
	index("home_blocks_two_blocks_order_idx").on(table.order),
]);

export const homeBlocksFullWidth = sqliteTable("home_blocks_full_width", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull().references(() => home.id, { onDelete: "cascade" } ),
	path: text("_path").notNull(),
	id: text().primaryKey().notNull(),
	blockName: text("block_name"),
},
(table) => [
	index("home_blocks_full_width_path_idx").on(table.path),
	index("home_blocks_full_width_parent_id_idx").on(table.parentId),
	index("home_blocks_full_width_order_idx").on(table.order),
]);

export const homeRels = sqliteTable("home_rels", {
	id: integer().primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull().references(() => home.id, { onDelete: "cascade" } ),
	path: text().notNull(),
	announcementsId: integer("announcements_id").references(() => announcements.id, { onDelete: "cascade" } ),
},
(table) => [
	index("home_rels_announcements_id_idx").on(table.announcementsId),
	index("home_rels_path_idx").on(table.path),
	index("home_rels_parent_idx").on(table.parentId),
	index("home_rels_order_idx").on(table.order),
]);

export const homeBlocksAnnouncementsSection = sqliteTable("home_blocks_announcements_section", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull().references(() => home.id, { onDelete: "cascade" } ),
	path: text("_path").notNull(),
	id: text().primaryKey().notNull(),
	mainAnnouncementId: integer("main_announcement_id").notNull().references(() => announcements.id, { onDelete: "set null" } ),
	colorPalette: text("color_palette").notNull(),
	blockName: text("block_name"),
},
(table) => [
	index("home_blocks_announcements_section_main_announcement_idx").on(table.mainAnnouncementId),
	index("home_blocks_announcements_section_path_idx").on(table.path),
	index("home_blocks_announcements_section_parent_id_idx").on(table.parentId),
	index("home_blocks_announcements_section_order_idx").on(table.order),
]);

export const faqCategories = sqliteTable("faq_categories", {
	id: integer().primaryKey().notNull(),
	title: text().notNull(),
	colorPalette: text("color_palette").notNull(),
	updatedAt: text("updated_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
	createdAt: text("created_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
},
(table) => [
	index("faq_categories_created_at_idx").on(table.createdAt),
	index("faq_categories_updated_at_idx").on(table.updatedAt),
]);

export const faqQuestions = sqliteTable("faq_questions", {
	id: integer().primaryKey().notNull(),
	categoryId: integer("category_id").notNull().references(() => faqCategories.id, { onDelete: "set null" } ),
	question: text().notNull(),
	answer: text().notNull(),
	updatedAt: text("updated_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
	createdAt: text("created_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
},
(table) => [
	index("faq_questions_created_at_idx").on(table.createdAt),
	index("faq_questions_updated_at_idx").on(table.updatedAt),
	index("faq_questions_category_idx").on(table.categoryId),
]);

export const payloadLockedDocumentsRels = sqliteTable("payload_locked_documents_rels", {
	id: integer().primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull().references(() => payloadLockedDocuments.id, { onDelete: "cascade" } ),
	path: text().notNull(),
	mediaId: integer("media_id").references(() => media.id, { onDelete: "cascade" } ),
	testimonialsId: integer("testimonials_id").references(() => testimonials.id, { onDelete: "cascade" } ),
	announcementsId: integer("announcements_id").references(() => announcements.id, { onDelete: "cascade" } ),
	faqCategoriesId: integer("faq_categories_id").references(() => faqCategories.id, { onDelete: "cascade" } ),
	faqQuestionsId: integer("faq_questions_id").references(() => faqQuestions.id, { onDelete: "cascade" } ),
	usersId: text("users_id").references(() => users.id, { onDelete: "cascade" } ),
},
(table) => [
	index("payload_locked_documents_rels_users_id_idx").on(table.usersId),
	index("payload_locked_documents_rels_faq_questions_id_idx").on(table.faqQuestionsId),
	index("payload_locked_documents_rels_faq_categories_id_idx").on(table.faqCategoriesId),
	index("payload_locked_documents_rels_announcements_id_idx").on(table.announcementsId),
	index("payload_locked_documents_rels_testimonials_id_idx").on(table.testimonialsId),
	index("payload_locked_documents_rels_media_id_idx").on(table.mediaId),
	index("payload_locked_documents_rels_path_idx").on(table.path),
	index("payload_locked_documents_rels_parent_idx").on(table.parentId),
	index("payload_locked_documents_rels_order_idx").on(table.order),
]);

export const users = sqliteTable("users", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	emailVerified: text("email_verified").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`"),
	name: text(),
	image: text(),
	updatedAt: text("updated_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
	createdAt: text("created_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
},
(table) => [
	index("users_created_at_idx").on(table.createdAt),
	index("users_updated_at_idx").on(table.updatedAt),
	uniqueIndex("users_email_idx").on(table.email),
]);

export const nav = sqliteTable("nav", {
	id: integer().primaryKey().notNull(),
	updatedAt: text("updated_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`"),
	createdAt: text("created_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`"),
});

export const homeBlocksImageBanner = sqliteTable("home_blocks_image_banner", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull().references(() => home.id, { onDelete: "cascade" } ),
	path: text("_path").notNull(),
	id: text().primaryKey().notNull(),
	heading: text().notNull(),
	body: text().notNull(),
	mainImageId: integer("main_image_id").notNull().references(() => media.id, { onDelete: "set null" } ),
	colorPalette: text("color_palette").notNull(),
	bgColor: text("bg_color").notNull(),
	headingColor: text("heading_color").notNull(),
	textColor: text("text_color").notNull(),
	bgImageId: integer("bg_image_id").references(() => media.id, { onDelete: "set null" } ),
	bgSize: numeric("bg_size").default(100),
	bgPos: text("bg_pos").default("right"),
	blockName: text("block_name"),
},
(table) => [
	index("home_blocks_image_banner_bg_image_idx").on(table.bgImageId),
	index("home_blocks_image_banner_main_image_idx").on(table.mainImageId),
	index("home_blocks_image_banner_path_idx").on(table.path),
	index("home_blocks_image_banner_parent_id_idx").on(table.parentId),
	index("home_blocks_image_banner_order_idx").on(table.order),
]);

export const home = sqliteTable("home", {
	id: integer().primaryKey().notNull(),
	updatedAt: text("updated_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`"),
	createdAt: text("created_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`"),
});

export const announcements = sqliteTable("announcements", {
	id: integer().primaryKey().notNull(),
	imageId: integer("image_id").references(() => media.id, { onDelete: "set null" } ),
	title: text().notNull(),
	content: text().notNull(),
	publishedAt: text("published_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
	publishedById: text("published_by_id").notNull().references(() => users.id, { onDelete: "set null" } ),
	updatedAt: text("updated_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
	createdAt: text("created_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
},
(table) => [
	index("announcements_created_at_idx").on(table.createdAt),
	index("announcements_updated_at_idx").on(table.updatedAt),
	index("announcements_published_by_idx").on(table.publishedById),
	index("announcements_image_idx").on(table.imageId),
]);

