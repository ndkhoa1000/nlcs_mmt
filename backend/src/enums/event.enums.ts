export const EventStatusEnum = {
    ON_PREPARE: "ON_PREPARE",
    ON_GOING: "ON_GOING",
    COMPLETED: "COMPLETED",
} as const

export const EventPriorityEnum = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
} as const;
export type EventStatusEnumType = keyof typeof EventStatusEnum;
export type EventPriorityEnumType = keyof typeof EventPriorityEnum;
