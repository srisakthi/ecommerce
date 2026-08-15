import ApiError from "../utils/ApiError.js";
import userRepository from "../repositories/user.repository.js";
import generateTokens from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../models/user.model.js";

const registerUser = async (userData) => {
    const { firstName, lastName, email, password } = userData;

    if (!firstName || !lastName || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        throw new ApiError(409, "Email already exists");
    }

    const user = await userRepository.createUser({
        firstName,
        lastName,
        email,
        password,
    });

    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
    };
};

const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    return {
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
};

const logoutUser = async (userId) => {
    await userRepository.clearRefreshToken(userId);
};

const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new ApiError(401, "Refresh token required");
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, config.jwtSecret);
    } catch {
        throw new ApiError(401, "Invalid refresh token");
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
        throw new ApiError(401, "User not found");
    }

    if (user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Refresh token mismatch");
    }

    const accessToken = user.generateAccessToken();
    return { accessToken };
};

const forgotPassword = async (email) => {
    if (!email) {
        throw new ApiError(400, "Email is required");
    }
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new ApiError(404, "User with this email does not exist");
    }
    const resetToken = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "1h" });
    return { resetToken, message: "Password reset token generated" };
};

const resetPassword = async (resetToken, newPassword) => {
    if (!resetToken || !newPassword) {
        throw new ApiError(400, "Token and new password are required");
    }
    let decoded;
    try {
        decoded = jwt.verify(resetToken, config.jwtSecret);
    } catch {
        throw new ApiError(401, "Invalid or expired reset token");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.password = newPassword;
    await user.save();
    return { message: "Password reset successfully" };
};

export default {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
};