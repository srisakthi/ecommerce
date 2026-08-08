import jwt from "jsonwebtoken";
import config from "../config/config.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import userRepository from "../repositories/user.repository.js";

const verifyJWT = asyncHandler(async (req, res, next) => {

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {

        token = req.headers.authorization.split(" ")[1];

    }

    if (!token) {

        throw new ApiError(
            401,
            "Access token required"
        );

    }

    const decoded = jwt.verify(
        token,
        config.jwtSecret
    );

    const user =
        await userRepository.findById(decoded.id);

    if (!user) {

        throw new ApiError(
            401,
            "User not found"
        );

    }

    req.user = {

        id: user._id,

        email: user.email,

        role: user.role

    };

    next();

});

export default verifyJWT;