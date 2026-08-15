import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import userService from "../services/user.service.js";

const profile = asyncHandler(async (req, res) => {
    const user = await userService.getProfile(req.user.id);
    return res.status(200).json(
        new ApiResponse(200, "Profile fetched successfully", user)
    );
});

const updateProfile = asyncHandler(async (req, res) => {
    const updatedUser = await userService.updateProfile(req.user.id, req.body);
    return res.status(200).json(
        new ApiResponse(200, "Profile updated successfully", updatedUser)
    );
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    return res.status(200).json(
        new ApiResponse(200, "Users fetched successfully", users)
    );
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json(
        new ApiResponse(200, "User fetched successfully", user)
    );
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await userService.updateUserAdmin(req.params.id, req.body);
    return res.status(200).json(
        new ApiResponse(200, "User updated successfully", user)
    );
});

const deleteUser = asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id);
    return res.status(200).json(
        new ApiResponse(200, "User deleted successfully")
    );
});

const createUser = asyncHandler(async (req, res) => {
    const user = await userService.createUserAdmin(req.body);
    return res.status(201).json(
        new ApiResponse(201, "User created successfully", user)
    );
});

export default {
    profile,
    updateProfile,
    getAllUsers,
    getUserById,
    updateUser,
    createUser,
    deleteUser,
};