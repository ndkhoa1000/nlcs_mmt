import mongoose, { Document, Schema } from "mongoose";
import { RoleDocument } from "./roles-permission.model";

export interface MemberDocument extends Document {
    userId: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    role: RoleDocument;
    joinAt:Date;
    createAt: Date;
    updateAt: Date;
}
const memberSchema = new Schema<MemberDocument>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    joinAt: { type: Date, default:Date.now }
}, {
    timestamps: {
        createdAt: "createAt",
        updatedAt: "updateAt",
    },
})
const MemberModel = mongoose.model<MemberDocument>("Member", memberSchema);

export default MemberModel;