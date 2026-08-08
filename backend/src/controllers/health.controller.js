import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import healthService from "../services/health.service.js";

const healthCheck = asyncHandler(async (req, res) => {

    const data = await healthService.getHealthStatus();
    //throw new Error("Async Handler Working");

    return res.status(200).json(
        new ApiResponse(
            200,
            "Server is healthy",
            data
        )
    );

});

export default {
    healthCheck
};