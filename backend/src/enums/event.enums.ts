
export const EventStatusEnum = {
    PENDING: "PENDING",
    ACTIVE: "ACTIVE",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
    POSTPONED: "POSTPONED",
} as const

export const EventPriorityEnum = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    URGENT: "URGENT",
} as const;
export type EventStatusEnumType = keyof typeof EventStatusEnum;
export type EventPriorityEnumType = keyof typeof EventPriorityEnum;
