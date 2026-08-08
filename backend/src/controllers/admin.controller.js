import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

const dashboard = asyncHandler(async (req, res) => {

    return res.status(200).json(

        new ApiResponse(

            200,

            "Welcome Admin",

            {
                user: req.user
            }

        )

    );

});

export default {
    dashboard
};