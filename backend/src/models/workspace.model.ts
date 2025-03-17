import mongoose, { Document, Schema, SchemaType } from "mongoose";
import { generateInviteCode } from "../utils/uuid";

export interface WorkspaceDocument extends Document {
    name: string;
    description: string;
    owner: mongoose.Types.ObjectId;
    inviteCode: string;
    createAt: Date;
    updateAt: Date;
}

const workspaceSchema = new Schema<WorkspaceDocument>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: false, default: "" },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        inviteCode: {
            type: String,
            required: true,
            unique: true,
            default: generateInviteCode,
        },
    },
    {
        timestamps: {
            createdAt: "createAt",
            updatedAt: "updatedAt",
        }
    }
);

workspaceSchema.methods.resetInviteCode = function () {
    this.inviteCode = generateInviteCode();
};

const workspaceModel = mongoose.model<WorkspaceDocument>(
    "Workspace",
    workspaceSchema
);
export default workspaceModel;
