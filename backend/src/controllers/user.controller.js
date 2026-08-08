import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

const profile = asyncHandler(async (req, res) => {

    return res.status(200).json(

        new ApiResponse(

            200,

            "Profile fetched successfully",

            req.user

        )

    );

});

export default {

    profile

};