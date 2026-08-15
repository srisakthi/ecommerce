import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import orderService from "../services/order.service.js";

const createOrder = asyncHandler(
    async (req, res) => {

        const order =
            await orderService.createOrder(
                req.user.id,
                req.body
            );

        return res.status(201).json(
            new ApiResponse(
                201,
                "Order created successfully",
                order
            )
        );
    }
);

const getMyOrders = asyncHandler(
    async (req, res) => {

        const orders =
            await orderService.getMyOrders(
                req.user.id
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Orders fetched successfully",
                orders
            )
        );
    }
);

const getMyOrderById =
    asyncHandler(
        async (req, res) => {

            const order =
                await orderService.getOrderById(
                    req.params.id,
                    req.user.id
                );

            if (!order) {

                return res.status(404).json(
                    new ApiResponse(
                        404,
                        "Order not found"
                    )
                );
            }

            return res.status(200).json(
                new ApiResponse(
                    200,
                    "Order fetched successfully",
                    order
                )
            );
        }
    );

const getAllOrders =
    asyncHandler(
        async (req, res) => {

            const orders =
                await orderService.getAllOrders(req.user);

            return res.status(200).json(
                new ApiResponse(
                    200,
                    "Orders fetched successfully",
                    orders
                )
            );
        }
    );

const updateOrderStatus =
    asyncHandler(
        async (req, res) => {

            const order =
                await orderService.updateOrderStatus(
                    req.params.id,
                    req.body.orderStatus,
                    req.user
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    "Order status updated successfully",
                    order
                )
            );
        }
    );

export default {
    createOrder,
    getMyOrders,
    getMyOrderById,
    getAllOrders,
    updateOrderStatus,
};