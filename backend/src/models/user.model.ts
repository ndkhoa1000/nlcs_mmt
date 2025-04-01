import mongoose,{Document, Schema} from "mongoose";
import { hashValue, compareValue } from "../utils/bcrypt";
import { number, string } from "zod";

export interface UserDocument extends Document{
    name: string;
    email: string;
    password: string;
    profilePicture: string | null;

    DateOfBirth: Date | null;
    phoneNumber: string | null;
    EmergencyContact: string |null;
    Address: string |null;
    Skills: string | null;
    totalVolunteerHours: number;
    
    isActive: Boolean;
    lastLogin: Date | null;
    createAt: Date;
    updateAt: Date;
    currentOrganization: mongoose.Types.ObjectId | null;
    comparePassword (value: string): Promise<boolean>;
    omitPassword(): Omit<UserDocument, "password">;    
}

const userSchema = new Schema<UserDocument>({
    name: {type:String, required:true, trim: true},
    email: {type:String, required:true, unique:true, trim: true, lowercase: true},
    password: {type:String, required:true},
    profilePicture: {type:String, default:null},

    DateOfBirth:{type:Date, default:null},
    phoneNumber:{type:String, default:null},
    Address:{type:String, default:null},
    Skills:{type:String, default:null},
    EmergencyContact:{type:String, default:null},
    totalVolunteerHours:{type:Number, default:0},

    isActive: {type:Boolean, default:true},
    lastLogin: {type:Date, default:null},
    createAt: {type:Date, default:Date.now},
    updateAt: {type:Date, default:Date.now},
    currentOrganization: {
        type:Schema.Types.ObjectId, 
        ref:"Organization", 
        default:null
    },
},
{
    timestamps: {
        createdAt: "createAt",
        updatedAt: "updatedAt",
    }
})

userSchema.pre("save", async function (next){
    if(this.isModified("password")){
        if(this.password){
            this.password = await hashValue(this.password);
        }
    }
    next();
})

userSchema.methods.omitPassword = function(): Omit<UserDocument, "password">{
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.methods.comparePassword = async function(value:string){
    return compareValue(value, this.password);
}

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
