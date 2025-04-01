import mongoose, { Document, Schema, SchemaType } from "mongoose";
import { generateInviteCode } from "../utils/uuid";

export interface OrganizationDocument extends Document {
    name: string;
    description: string;
    mission:string;
    logo: string | null;
    address: string;
    phoneNumber: string;
    email: string;
    website:string | null;

    socialMediaLink: Array<string>;
    establishedDate: Date | null;
    isVerified: boolean;

    owner: mongoose.Types.ObjectId;
    inviteCode: string;
    createAt: Date;
    updateAt: Date;
}

const organizationSchema = new Schema<OrganizationDocument>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: false, default: "" },
        mission: { type: String, required: false, default: "" },
        logo: { type: String, default: null },
        address: { type: String, required: true, trim: true },
        phoneNumber: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        website: { type: String, required: false, default: null },
        socialMediaLink: { type: [String], required: false, default: [] },
        establishedDate: { type: Date, required: false, default: null },
        isVerified: { type: Boolean, default: false },
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

organizationSchema.methods.resetInviteCode = function () {
    this.inviteCode = generateInviteCode();
};

const organizationModel = mongoose.model<OrganizationDocument>(
    "Organization",
    organizationSchema
);
export default organizationModel;
