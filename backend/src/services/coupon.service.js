import Coupon from "../models/coupon.model.js";
import ApiError from "../utils/ApiError.js";

const createCoupon = async (couponData) => {
    const existing = await Coupon.findOne({ code: couponData.code.toUpperCase() });
    if (existing) {
        throw new ApiError(409, "Coupon code already exists");
    }
    const coupon = await Coupon.create({
        ...couponData,
        code: couponData.code.toUpperCase(),
    });
    return coupon;
};

const getAllCoupons = async () => {
    return Coupon.find().sort({ createdAt: -1 });
};

const getCouponById = async (id) => {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
        throw new ApiError(404, "Coupon not found");
    }
    return coupon;
};

const updateCoupon = async (id, updateData) => {
    if (updateData.code) {
        updateData.code = updateData.code.toUpperCase();
    }
    const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!coupon) {
        throw new ApiError(404, "Coupon not found");
    }
    return coupon;
};

const deleteCoupon = async (id) => {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
        throw new ApiError(404, "Coupon not found");
    }
    return true;
};

const validateCoupon = async (code, subtotal) => {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
        throw new ApiError(404, "Invalid or expired coupon code");
    }

    if (new Date() > new Date(coupon.expiryDate)) {
        throw new ApiError(400, "Coupon has expired");
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        throw new ApiError(400, "Coupon usage limit reached");
    }

    if (subtotal < coupon.minOrderValue) {
        throw new ApiError(400, `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`);
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
        discountAmount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
        }
    } else {
        discountAmount = coupon.discountValue;
    }

    if (discountAmount > subtotal) {
        discountAmount = subtotal;
    }

    return {
        coupon: {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
        },
        discountAmount,
    };
};

export default {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
};
