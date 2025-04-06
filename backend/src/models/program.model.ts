import mongoose, { Document, Schema } from "mongoose";

export interface ProgramDocument extends Document {
    name: string;
    description: string | null;
    organization: mongoose.Types.ObjectId;
    startDate:Date | null;
    endDate: Date |null;
    sponsors: Array<string>;
    documents: Array<string>;
    createBy: mongoose.Types.ObjectId;
    createAt: Date;
    updateAt: Date;
}
const programSchema = new Schema<ProgramDocument>(
    {
        name: { type: String, required: true ,trim: true},
        description: { type: String, required: false, default: null },
        organization: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        startDate: { type: Date, required: false, default: null },
        endDate: { type: Date, required: false, default: null },
        sponsors: { type: [String], required: false, default: null },
        documents : { type: [String], required: false, default: [] },
        createBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: {
            createdAt: "createAt",
            updatedAt: "updateAt",
        },
    }
);

const ProgramModel = mongoose.model<ProgramDocument>("Program", programSchema);
export default ProgramModel;
