import mongoose, { Document, Schema } from "mongoose";
import { RoleDocument } from "./roles-permission.model";

export interface MemberDocument extends Document {
    userId: mongoose.Types.ObjectId;
    orgId: mongoose.Types.ObjectId;
    role: RoleDocument;
    joinAt:Date;
    isApproved: boolean;
    volunteerHours: number;
    createAt: Date;
    updateAt: Date;
}
const memberSchema = new Schema<MemberDocument>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orgId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    isApproved: { type: Boolean, default: false },
    volunteerHours: { type: Number, default: 0 },
    joinAt: { type: Date, default:Date.now }
}, {
    timestamps: {
        createdAt: "createAt",
        updatedAt: "updateAt",
    },
})
const MemberModel = mongoose.model<MemberDocument>("Member", memberSchema);

export default MemberModel;