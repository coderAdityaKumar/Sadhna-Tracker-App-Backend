import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: {
        type: String,
        unique: [true, 'username already exists'],
        required: [true, 'username is a required field'],
        lowercase: true
    },
    firstName: {
        type: String,
        required: [true, 'first name is a required field']
    },
    lastName: {
        type: String
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is required field']
    },
    sadhna: [
        {
        type: Schema.Types.ObjectId,
        ref: "Sadhna"
        }
    ],
    verificationToken: {
        type: String
    },
    hostel: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'password is a required field']
    }
}, {timestamps: true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.genereateToken = async function() {
    const token = await jwt.sign(
        {
            _id: this._id
        },
    process.env.JWT_SECRET, 
    { expiresIn: '10d'}
    )
    return token;
}

const User = mongoose.model("User", userSchema);

export default User;