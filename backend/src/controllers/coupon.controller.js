import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import couponService from "../services/coupon.service.js";

const createCoupon = asyncHandler(async (req, res) => {
    const coupon = await couponService.createCoupon(req.body);
    return res.status(201).json(
        new ApiResponse(201, "Coupon created successfully", coupon)
    );
});

const getAllCoupons = asyncHandler(async (req, res) => {
    const coupons = await couponService.getAllCoupons();
    return res.status(200).json(
        new ApiResponse(200, "Coupons fetched successfully", coupons)
    );
});

const getCouponById = asyncHandler(async (req, res) => {
    const coupon = await couponService.getCouponById(req.params.id);
    return res.status(200).json(
        new ApiResponse(200, "Coupon fetched successfully", coupon)
    );
});

const updateCoupon = asyncHandler(async (req, res) => {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    return res.status(200).json(
        new ApiResponse(200, "Coupon updated successfully", coupon)
    );
});

const deleteCoupon = asyncHandler(async (req, res) => {
    await couponService.deleteCoupon(req.params.id);
    return res.status(200).json(
        new ApiResponse(200, "Coupon deleted successfully")
    );
});

const applyCoupon = asyncHandler(async (req, res) => {
    const { code, subtotal } = req.body;
    const result = await couponService.validateCoupon(code, subtotal);
    return res.status(200).json(
        new ApiResponse(200, "Coupon applied successfully", result)
    );
});

export default {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    applyCoupon,
};
