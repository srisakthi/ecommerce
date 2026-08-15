import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import authService from "../services/auth.service.js";

const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
};

const register = asyncHandler(async (req, res) => {
    const user = await authService.registerUser(req.body);
    return res.status(201).json(
        new ApiResponse(201, "User registered successfully", user)
    );
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    return res
        .status(200)
        .cookie("refreshToken", result.refreshToken, cookieOptions)
        .json(
            new ApiResponse(200, "Login successful", {
                user: result.user,
                accessToken: result.accessToken,
            })
        );
});

const logout = asyncHandler(async (req, res) => {
    await authService.logoutUser(req.user.id);
    return res
        .clearCookie("refreshToken", cookieOptions)
        .status(200)
        .json(new ApiResponse(200, "Logout successful", null));
});

const refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;
    const result = await authService.refreshAccessToken(token);
    return res.status(200).json(
        new ApiResponse(200, "Access token refreshed", result)
    );
});

const forgotPassword = asyncHandler(async (req, res) => {
    const result = await authService.forgotPassword(req.body.email);
    return res.status(200).json(
        new ApiResponse(200, "Password reset token generated", result)
    );
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    return res.status(200).json(
        new ApiResponse(200, "Password reset successful", result)
    );
});

export default {
    register,
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
};