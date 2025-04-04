import mongoose, { Document, Schema } from "mongoose";
import { EventStatusEnumType, EventPriorityEnumType, EventStatusEnum, EventPriorityEnum } from "../enums/event.enums";
import { eventCategories } from "../enums/eventCategories.enums";

export interface EventDocument extends Document {
    title: string;
    description: string |null;
    program:mongoose.Types.ObjectId | null;
    organization: mongoose.Types.ObjectId;
    category: Array<string>;
    
    location: String;
    status: EventStatusEnumType;
    priority:EventPriorityEnumType;
    assignedTo:Array<mongoose.Types.ObjectId>; 
    cohost: Array<mongoose.Types.ObjectId>;
    requiredVolunteer: number;
    registeredVolunteer: number;
    registrationDeadline: Date | null;
    startTime: Date |null;
    endTime: Date | null;
    documents: Array<string>;
    needTraining: boolean;

    createBy: mongoose.Types.ObjectId;
    createAt: Date;
    updateAt: Date;
}
const eventSchema = new Schema<EventDocument>(
    {
        title: { type: String, required: true ,trim: true},
        description: { type: String, required: false, default: null },
        program: {type: Schema.Types.ObjectId, ref: "Program", required: false},
        organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true},
        category: { type: [String], enums: Object.values(eventCategories), required: false, default: [] },
        location: { type: String, required: true, trim: true },
        requiredVolunteer: { type: Number, required: true, default: 0},
        registeredVolunteer: { type: Number, required: true, default: 0,
            validate: function(this:EventDocument, value: number) {
                return value <= this.requiredVolunteer;
            }, message: 'Full! Registered volunteer cannot be greater than required volunteer.'
        },
        registrationDeadline: { type: Date, required: false, default: null },
        startTime: { type: Date, required: false, default: null },
        endTime: { type: Date, required: false, default: null,
            validate: function(this: EventDocument, value: Date){
                return !this.endTime || !value || (this.startTime && value >= this.startTime);
            }, message: 'Star time must be before end time.'
         },
        documents: { type: [String], required: false, default: [] },
        needTraining: { type: Boolean, required: false, default: false },
        status: { 
            type: String, 
            required: true, 
            enum: Object.values(EventStatusEnum), 
            default: EventStatusEnum.PENDING,
        },
        priority: { 
            type: String, 
            required: true, 
            enum: Object.values(EventPriorityEnum), 
            default: EventPriorityEnum.MEDIUM
        },
        cohost: { type: [Schema.Types.ObjectId], ref: "Organization", required: false, default: []},
        assignedTo: { type: [Schema.Types.ObjectId], ref: "User", required: false, default: []},
        createBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: {
            createdAt: "createAt",
            updatedAt: "updateAt",
        },
    }
);

const EventModel = mongoose.model<EventDocument>("Event", eventSchema);
export default EventModel;