import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";

const getDashboardStats = async (req, res) => {

    const [

        totalProducts,

        totalCategories,

        totalUsers

    ] = await Promise.all([

        Product.countDocuments(),

        Category.countDocuments(),

        User.countDocuments()

    ]);

    return res.json({

        success: true,

        data: {

            totalProducts,

            totalCategories,

            totalUsers,

            totalOrders: 0

        }

    });

};

export default {

    getDashboardStats

};