import { relations } from "drizzle-orm/relations";
import { media, testimonials, users, usersAccounts, payloadPreferencesRels, payloadPreferences, nav, navBlocksLinkItem, navBlocksNestedDropdown, navBlocksVisualDivider, navBlocksNavDropdown, home, homeBlocksTextCard, homeBlocksImageOnlyCard, homeBlocksTestimonialSlide, homeBlocksTestimonialsSpinner, homeBlocksFeaturedCompetitions, homeBlocksTwoBlocksLeaf, homeBlocksTwoBlocksBranch, homeBlocksTwoBlocks, homeBlocksFullWidth, announcements, homeRels, homeBlocksAnnouncementsSection, faqCategories, faqQuestions, payloadLockedDocumentsRels, payloadLockedDocuments, homeBlocksImageBanner } from "./schema";

export const testimonialsRelations = relations(testimonials, ({one, many}) => ({
	media: one(media, {
		fields: [testimonials.imageId],
		references: [media.id]
	}),
	homeBlocksTestimonialSlides: many(homeBlocksTestimonialSlide),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const mediaRelations = relations(media, ({many}) => ({
	testimonials: many(testimonials),
	homeBlocksTextCards: many(homeBlocksTextCard),
	homeBlocksImageOnlyCards: many(homeBlocksImageOnlyCard),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
	homeBlocksImageBanners_bgImageId: many(homeBlocksImageBanner, {
		relationName: "homeBlocksImageBanner_bgImageId_media_id"
	}),
	homeBlocksImageBanners_mainImageId: many(homeBlocksImageBanner, {
		relationName: "homeBlocksImageBanner_mainImageId_media_id"
	}),
	announcements: many(announcements),
}));

export const usersAccountsRelations = relations(usersAccounts, ({one}) => ({
	user: one(users, {
		fields: [usersAccounts.parentId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	usersAccounts: many(usersAccounts),
	payloadPreferencesRels: many(payloadPreferencesRels),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
	announcements: many(announcements),
}));

export const payloadPreferencesRelsRelations = relations(payloadPreferencesRels, ({one}) => ({
	user: one(users, {
		fields: [payloadPreferencesRels.usersId],
		references: [users.id]
	}),
	payloadPreference: one(payloadPreferences, {
		fields: [payloadPreferencesRels.parentId],
		references: [payloadPreferences.id]
	}),
}));

export const payloadPreferencesRelations = relations(payloadPreferences, ({many}) => ({
	payloadPreferencesRels: many(payloadPreferencesRels),
}));

export const navBlocksLinkItemRelations = relations(navBlocksLinkItem, ({one}) => ({
	nav: one(nav, {
		fields: [navBlocksLinkItem.parentId],
		references: [nav.id]
	}),
}));

export const navRelations = relations(nav, ({many}) => ({
	navBlocksLinkItems: many(navBlocksLinkItem),
	navBlocksNestedDropdowns: many(navBlocksNestedDropdown),
	navBlocksVisualDividers: many(navBlocksVisualDivider),
	navBlocksNavDropdowns: many(navBlocksNavDropdown),
}));

export const navBlocksNestedDropdownRelations = relations(navBlocksNestedDropdown, ({one}) => ({
	nav: one(nav, {
		fields: [navBlocksNestedDropdown.parentId],
		references: [nav.id]
	}),
}));

export const navBlocksVisualDividerRelations = relations(navBlocksVisualDivider, ({one}) => ({
	nav: one(nav, {
		fields: [navBlocksVisualDivider.parentId],
		references: [nav.id]
	}),
}));

export const navBlocksNavDropdownRelations = relations(navBlocksNavDropdown, ({one}) => ({
	nav: one(nav, {
		fields: [navBlocksNavDropdown.parentId],
		references: [nav.id]
	}),
}));

export const homeBlocksTextCardRelations = relations(homeBlocksTextCard, ({one}) => ({
	home: one(home, {
		fields: [homeBlocksTextCard.parentId],
		references: [home.id]
	}),
	media: one(media, {
		fields: [homeBlocksTextCard.headerImageId],
		references: [media.id]
	}),
}));

export const homeRelations = relations(home, ({many}) => ({
	homeBlocksTextCards: many(homeBlocksTextCard),
	homeBlocksImageOnlyCards: many(homeBlocksImageOnlyCard),
	homeBlocksTestimonialSlides: many(homeBlocksTestimonialSlide),
	homeBlocksTestimonialsSpinners: many(homeBlocksTestimonialsSpinner),
	homeBlocksFeaturedCompetitions: many(homeBlocksFeaturedCompetitions),
	homeBlocksTwoBlocksLeaves: many(homeBlocksTwoBlocksLeaf),
	homeBlocksTwoBlocksBranches: many(homeBlocksTwoBlocksBranch),
	homeBlocksTwoBlocks: many(homeBlocksTwoBlocks),
	homeBlocksFullWidths: many(homeBlocksFullWidth),
	homeRels: many(homeRels),
	homeBlocksAnnouncementsSections: many(homeBlocksAnnouncementsSection),
	homeBlocksImageBanners: many(homeBlocksImageBanner),
}));

export const homeBlocksImageOnlyCardRelations = relations(homeBlocksImageOnlyCard, ({one}) => ({
	home: one(home, {
		fields: [homeBlocksImageOnlyCard.parentId],
		references: [home.id]
	}),
	media: one(media, {
		fields: [homeBlocksImageOnlyCard.mainImageId],
		references: [media.id]
	}),
}));

export const homeBlocksTestimonialSlideRelations = relations(homeBlocksTestimonialSlide, ({one}) => ({
	home: one(home, {
		fields: [homeBlocksTestimonialSlide.parentId],
		references: [home.id]
	}),
	testimonial: one(testimonials, {
		fields: [homeBlocksTestimonialSlide.testimonialId],
		references: [testimonials.id]
	}),
}));

export const homeBlocksTestimonialsSpinnerRelations = relations(homeBlocksTestimonialsSpinner, ({one}) => ({
	home: one(home, {
		fields: [homeBlocksTestimonialsSpinner.parentId],
		references: [home.id]
	}),
}));

export const homeBlocksFeaturedCompetitionsRelations = relations(homeBlocksFeaturedCompetitions, ({one}) => ({
	home: one(home, {
		fields: [homeBlocksFeaturedCompetitions.parentId],
		references: [home.id]
	}),
}));

export const homeBlocksTwoBlocksLeafRelations = relations(homeBlocksTwoBlocksLeaf, ({one}) => ({
	home: one(home, {
		fields: [homeBlocksTwoBlocksLeaf.parentId],
		references: [home.id]
	}),
}));

export const homeBlocksTwoBlocksBranchRelations = relations(homeBlocksTwoBlocksBranch, ({one}) => ({
	home: one(home, {
		fields: [homeBlocksTwoBlocksBranch.parentId],
		references: [home.id]
	}),
}));

export const homeBlocksTwoBlocksRelations = relations(homeBlocksTwoBlocks, ({one}) => ({
	home: one(home, {
		fields: [homeBlocksTwoBlocks.parentId],
		references: [home.id]
	}),
}));

export const homeBlocksFullWidthRelations = relations(homeBlocksFullWidth, ({one}) => ({
	home: one(home, {
		fields: [homeBlocksFullWidth.parentId],
		references: [home.id]
	}),
}));

export const homeRelsRelations = relations(homeRels, ({one}) => ({
	announcement: one(announcements, {
		fields: [homeRels.announcementsId],
		references: [announcements.id]
	}),
	home: one(home, {
		fields: [homeRels.parentId],
		references: [home.id]
	}),
}));

export const announcementsRelations = relations(announcements, ({one, many}) => ({
	homeRels: many(homeRels),
	homeBlocksAnnouncementsSections: many(homeBlocksAnnouncementsSection),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
	user: one(users, {
		fields: [announcements.publishedById],
		references: [users.id]
	}),
	media: one(media, {
		fields: [announcements.imageId],
		references: [media.id]
	}),
}));

export const homeBlocksAnnouncementsSectionRelations = relations(homeBlocksAnnouncementsSection, ({one}) => ({
	home: one(home, {
		fields: [homeBlocksAnnouncementsSection.parentId],
		references: [home.id]
	}),
	announcement: one(announcements, {
		fields: [homeBlocksAnnouncementsSection.mainAnnouncementId],
		references: [announcements.id]
	}),
}));

export const faqQuestionsRelations = relations(faqQuestions, ({one, many}) => ({
	faqCategory: one(faqCategories, {
		fields: [faqQuestions.categoryId],
		references: [faqCategories.id]
	}),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const faqCategoriesRelations = relations(faqCategories, ({many}) => ({
	faqQuestions: many(faqQuestions),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const payloadLockedDocumentsRelsRelations = relations(payloadLockedDocumentsRels, ({one}) => ({
	user: one(users, {
		fields: [payloadLockedDocumentsRels.usersId],
		references: [users.id]
	}),
	faqQuestion: one(faqQuestions, {
		fields: [payloadLockedDocumentsRels.faqQuestionsId],
		references: [faqQuestions.id]
	}),
	faqCategory: one(faqCategories, {
		fields: [payloadLockedDocumentsRels.faqCategoriesId],
		references: [faqCategories.id]
	}),
	announcement: one(announcements, {
		fields: [payloadLockedDocumentsRels.announcementsId],
		references: [announcements.id]
	}),
	testimonial: one(testimonials, {
		fields: [payloadLockedDocumentsRels.testimonialsId],
		references: [testimonials.id]
	}),
	media: one(media, {
		fields: [payloadLockedDocumentsRels.mediaId],
		references: [media.id]
	}),
	payloadLockedDocument: one(payloadLockedDocuments, {
		fields: [payloadLockedDocumentsRels.parentId],
		references: [payloadLockedDocuments.id]
	}),
}));

export const payloadLockedDocumentsRelations = relations(payloadLockedDocuments, ({many}) => ({
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const homeBlocksImageBannerRelations = relations(homeBlocksImageBanner, ({one}) => ({
	home: one(home, {
		fields: [homeBlocksImageBanner.parentId],
		references: [home.id]
	}),
	media_bgImageId: one(media, {
		fields: [homeBlocksImageBanner.bgImageId],
		references: [media.id],
		relationName: "homeBlocksImageBanner_bgImageId_media_id"
	}),
	media_mainImageId: one(media, {
		fields: [homeBlocksImageBanner.mainImageId],
		references: [media.id],
		relationName: "homeBlocksImageBanner_mainImageId_media_id"
	}),
}));