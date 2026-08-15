import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";
import Order from "../models/Order.js";

const getDashboardStats = async (req, res) => {
    let productFilter = { isDeleted: false };
    let orderFilter = {};

    if (req.user.role === "seller") {
        productFilter.seller = req.user.id;
        
        // Find products owned by this seller
        const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
        const sellerProductIds = sellerProducts.map(p => p._id);
        
        orderFilter = { "items.product": { $in: sellerProductIds } };
    }

    const [
        totalProducts,
        totalCategories,
        totalUsers,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        revenueData,
        lowStockProducts,
        recentOrders,
    ] = await Promise.all([
        Product.countDocuments(productFilter),
        Category.countDocuments(),
        User.countDocuments(),
        Order.countDocuments(orderFilter),
        Order.countDocuments({ ...orderFilter, orderStatus: "pending" }),
        Order.countDocuments({ ...orderFilter, orderStatus: "delivered" }),
        Order.aggregate([
            { $match: { ...orderFilter, orderStatus: { $ne: "cancelled" } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
        Product.countDocuments({ ...productFilter, stock: { $lte: 10 } }),
        Order.find(orderFilter)
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 })
            .limit(5),
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    return res.json({
        success: true,
        data: {
            totalProducts,
            totalCategories,
            totalUsers,
            totalOrders,
            pendingOrders,
            deliveredOrders,
            totalRevenue,
            lowStockProducts,
            recentOrders,
        },
    });
};

export default {
    getDashboardStats,
};