import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { sign } = jwt;
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        index: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return sign(
        {
            _id: this.id,
            email: this.email
        },
        process.env.RefreshTokenSecret,
        {
            expiresIn: process.env.RefreshExpiery
        }
    );
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
    return sign(
        {
            _id: this.id,
            email: this.email
        },
        process.env.AccessTokenSecret,
        {
            expiresIn: process.env.AccessExpiery
        }
    );
};

export const User = mongoose.model('User', userSchema);
