import mongoose, { Document, Schema } from "mongoose";

export interface ProjectDocument extends Document {
    name: string;
    description: string | null;
    emoji: string;
    workspace: mongoose.Types.ObjectId;
    createBy: mongoose.Types.ObjectId;
    createAt: Date;
    updateAt: Date;
}
const projectSchema = new Schema<ProjectDocument>(
    {
        name: { type: String, required: true ,trim: true},
        description: { type: String, required: false, default: null },
        emoji: { type: String, required: false,trim: true, default:"📅" },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        createBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: {
            createdAt: "createAt",
            updatedAt: "updateAt",
        },
    }
);

const ProjectModel = mongoose.model<ProjectDocument>("Project", projectSchema);
export default ProjectModel;
