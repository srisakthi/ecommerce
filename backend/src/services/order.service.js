import Order from "../models/Order.js";
import Product from "../models/product.model.js";

const generateOrderNumber = () => {

    const timestamp =
        Date.now();

    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );

    return `ORD-${timestamp}-${random}`;
};


const createOrder = async (
    userId,
    orderData
) => {

    const {
        items,
        shippingAddress,
        paymentMethod = "cod",
        notes = "",
    } = orderData;


    if (
        !items ||
        !Array.isArray(items) ||
        items.length === 0
    ) {
        throw new Error(
            "Order must contain at least one item"
        );
    }


    if (!shippingAddress) {
        throw new Error(
            "Shipping address is required"
        );
    }


    const productIds =
        items.map(
            (item) => item.product
        );


    const products =
        await Product.find({
            _id: {
                $in: productIds,
            },

            isDeleted: false,

            status: "published",
        });


    if (
        products.length !==
        productIds.length
    ) {
        throw new Error(
            "One or more products are unavailable"
        );
    }


    let subtotal = 0;


    const orderItems =
        items.map((item) => {

            const product =
                products.find(
                    (product) =>
                        product._id.toString() ===
                        item.product.toString()
                );


            if (!product) {
                throw new Error(
                    "Product not found"
                );
            }


            if (
                product.stock <
                item.quantity
            ) {
                throw new Error(
                    `${product.name} does not have enough stock`
                );
            }


            const price =
                product.salePrice ||
                product.price;


            subtotal +=
                price *
                item.quantity;


            return {
                product:
                    product._id,

                name:
                    product.name,

                price,

                quantity:
                    item.quantity,

                thumbnail:
                    product.thumbnail ||
                    "",
            };
        });


    const shippingCost = 0;

    const totalAmount =
        subtotal +
        shippingCost;


    const order =
        await Order.create({

            orderNumber:
                generateOrderNumber(),

            user: userId,

            items:
                orderItems,

            shippingAddress,

            subtotal,

            shippingCost,

            totalAmount,

            paymentMethod,

            paymentStatus:
                "pending",

            orderStatus:
                "pending",

            notes,
        });


    // Reduce product stock

    for (
        const item of orderItems
    ) {

        await Product.findByIdAndUpdate(
            item.product,
            {
                $inc: {
                    stock:
                        -item.quantity,
                },
            }
        );
    }


    return order;
};


const getMyOrders = async (
    userId
) => {

    return Order.find({
        user: userId,
    })
        .populate(
            "items.product",
            "name slug thumbnail"
        )
        .sort({
            createdAt: -1,
        });
};


const getOrderById = async (
    orderId,
    userId
) => {

    return Order.findOne({
        _id: orderId,
        user: userId,
    })
        .populate(
            "items.product",
            "name slug thumbnail"
        );
};


const getAllOrders = async () => {

    return Order.find()
        .populate(
            "user",
            "name email"
        )
        .sort({
            createdAt: -1,
        });
};


const updateOrderStatus = async (
    orderId,
    orderStatus
) => {

    const order =
        await Order.findByIdAndUpdate(
            orderId,
            {
                orderStatus,
            },
            {
                new: true,
                runValidators: true,
            }
        );


    if (!order) {
        throw new Error(
            "Order not found"
        );
    }


    return order;
};


export default {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
};