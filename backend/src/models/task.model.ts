import mongoose, { Document, Schema } from "mongoose";
import { TaskStatusEnumType, TaskPriorityEnumType, TaskStatusEnum, TaskPriorityEnum } from "../enums/task.enums";

export interface TaskDocument extends Document {
    taskCode: String;
    title: string;
    description: string |null;
    project:mongoose.Types.ObjectId;
    workspace: mongoose.Types.ObjectId;
    status: TaskStatusEnumType;
    priority:TaskPriorityEnumType;
    assignedTo:mongoose.Types.ObjectId; 
    createBy: mongoose.Types.ObjectId;
    dueDate:Date | null;
    createAt: Date;
    updateAt: Date;
}
const taskSchema = new Schema<TaskDocument>(
    {
        taskCode: { type: String, required: true ,trim: true},
        title: { type: String, required: true ,trim: true},
        description: { type: String, required: false, default: null },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        status: { 
            type: String, 
            required: true, 
            enum: Object.values(TaskStatusEnum), 
            default: TaskStatusEnum.TODO
        },
        priority: { 
            type: String, 
            required: true, 
            enum: Object.values(TaskPriorityEnum), 
            default: TaskPriorityEnum.MEDIUM
        },
        assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null},
        createBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        dueDate: { type: Date, required: false, default: null },
    },
    {
        timestamps: {
            createdAt: "createAt",
            updatedAt: "updateAt",
        },
    }
);

const TaskModel = mongoose.model<TaskDocument>("Task", taskSchema);
export default TaskModel;