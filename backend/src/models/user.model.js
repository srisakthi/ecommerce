import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const userSchema = new mongoose.Schema(

    {

        firstName:{

            type:String,

            required:true,

            trim:true

        },

        lastName:{

            type:String,

            required:true,

            trim:true

        },

        email:{

            type:String,

            required:true,

            unique:true,

            lowercase:true,

            trim:true

        },

        password:{

            type:String,

            required:true

        },

        role:{

            type:String,

            enum:[
                "customer",
                "seller",
                "admin"
            ],

            default:"customer"

        },

        isEmailVerified:{

            type:Boolean,

            default:false

        },

        refreshToken:{

            type:String,

            default:null

        }

    },

    {

        timestamps:true

    }

);
userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);

});
userSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(password, this.password);

};
userSchema.methods.generateAccessToken = function () {

    return jwt.sign(
        {
            id: this._id,
            role: this.role,
            email: this.email
        },
        config.jwtSecret,
        {
            expiresIn: "15m"
        }
    );

};
userSchema.methods.generateRefreshToken = function () {

    return jwt.sign(
        {
            id: this._id
        },
        config.jwtSecret,
        {
            expiresIn: "7d"
        }
    );

};
const User = mongoose.model(
    "User",
    userSchema
);

export default User;