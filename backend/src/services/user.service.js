import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const getProfile = async (userId) => {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return user;
};

const updateProfile = async (userId, updateData) => {
    const { firstName, lastName, email } = updateData;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email && email !== user.email) {
        const existing = await User.findOne({ email });
        if (existing) {
            throw new ApiError(409, "Email is already taken");
        }
        user.email = email;
    }

    await user.save();
    return User.findById(userId).select("-password -refreshToken");
};

const getAllUsers = async () => {
    return User.find().select("-password -refreshToken").sort({ createdAt: -1 });
};

const getUserById = async (id) => {
    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return user;
};

const updateUserAdmin = async (id, updateData) => {
    const { role, isEmailVerified } = updateData;
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (role && ["customer", "seller", "admin"].includes(role)) {
        user.role = role;
    }
    if (typeof isEmailVerified === "boolean") {
        user.isEmailVerified = isEmailVerified;
    }

    await user.save();
    return User.findById(id).select("-password -refreshToken");
};

const createUserAdmin = async (userData) => {
    const { firstName, lastName, email, password, role } = userData;
    const existing = await User.findOne({ email });
    if (existing) {
        throw new ApiError(409, "Email is already taken");
    }

    const user = new User({
        firstName,
        lastName,
        email,
        password,
        role: role || "customer",
        isEmailVerified: true
    });

    await user.save();
    return User.findById(user._id).select("-password -refreshToken");
};

const deleteUser = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    await User.findByIdAndDelete(id);
    return true;
};

export default {
    getProfile,
    updateProfile,
    getAllUsers,
    getUserById,
    updateUserAdmin,
    createUserAdmin,
    deleteUser,
};
