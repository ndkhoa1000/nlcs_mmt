import mongoose, { Document, Schema } from "mongoose";

export interface AttendanceDocument extends Document {
    eventId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    isPresent: boolean;
    checkInTime: Date | null;
    checkOutTime: Date | null;
    hoursContributed: number;
    feedback: string | null;
    createAt: Date;
    updateAt: Date;
}

const attendanceSchema = new Schema<AttendanceDocument>(
    {
        eventId: { 
            type: Schema.Types.ObjectId, 
            ref: "Event", 
            required: true 
        },
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        isPresent: { 
            type: Boolean, 
            required: true, 
            default: true 
        },
        checkInTime: { 
            type: Date, 
            required: false, 
            default: Date.now 
        },
        checkOutTime: { 
            type: Date, 
            required: false, 
            default: null,
            validate: {
                validator: function(this: AttendanceDocument, value: Date) {
                    return !value || !this.checkInTime || value >= this.checkInTime;
                },
                message: "Check-out time must be after check-in time."
            }
        },
        hoursContributed: { 
            type: Number, 
            required: false, 
            default: 0,
            min: 0 
        },
        feedback: { 
            type: String, 
            required: false, 
            default: null 
        },
    },
    {
        timestamps: {
            createdAt: "createAt",
            updatedAt: "updateAt",
        },
    }
);

// Index for faster queries by event and user
attendanceSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const AttendanceModel = mongoose.model<AttendanceDocument>("Attendance", attendanceSchema);
export default AttendanceModel;