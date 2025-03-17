import mongoose, { Document, Schema } from "mongoose";
import { PermissionType, Permissions, Roles, RoleType } from "../enums/roles.enums";
import { RolePermissions } from "../utils/role-permissions";

export interface RoleDocument extends Document {
    name: RoleType;
    permission: Array<PermissionType>;
    createAt: Date;
    updateAt: Date;
}

const roleSchema = new Schema<RoleDocument>({
    name: { 
        type: String, 
        required: true, 
        enum: Object.values(Roles),
        unique: true 
    },
    permission: { 
        type: [String], 
        required: true, 
        enum: Object.values(Permissions),
        default: function (this: RoleDocument){
            return RolePermissions[this.name];
        }
    },
}, {
    timestamps: {
        createdAt: "createAt",
        updatedAt: "updateAt",
    },
})
const RoleModel = mongoose.model<RoleDocument>("Role", roleSchema);

export default RoleModel;