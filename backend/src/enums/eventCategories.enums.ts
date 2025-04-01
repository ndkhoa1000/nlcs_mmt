export const eventCategories = {
    CLIMATE:'CLIMATE',
    ENVIRONMENT:'ENVIRONMENT', 
    SOCIAL:'SOCIAL',
    EDUCATION:'EDUCATION',
    HEALTH:'HEALTH',
    CULTURE:'CULTURE',
    ANIMALS:'ANIMALS',
    COMMUNITY:'COMMUNITY',
    SPORTS:'SPORTS',
    OTHER:'OTHER'
} as const;

export type eventCategoryType = keyof typeof eventCategories;