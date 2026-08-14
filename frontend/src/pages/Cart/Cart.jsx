import {
    Minus,
    Plus,
    Trash2,
    ShoppingCart,
    ArrowRight,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
} from "@/features/cart/cartSlice";

import { useNavigate } from "react-router-dom";

const API_BASE_URL =
    "http://localhost:5000";

const Cart = () => {

    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();

    const items =
        useSelector(
            (state) =>
                state.cart.items
        );

    const getImageUrl = (
        image
    ) => {

        if (!image) {
            return "";
        }

        if (
            image.startsWith(
                "http"
            )
        ) {
            return image;
        }

        return `${API_BASE_URL}${image}`;
    };


    // =====================================
    // TOTAL ITEMS
    // =====================================

    const totalItems =
        items.reduce(
            (total, item) =>
                total +
                item.quantity,
            0
        );


    // =====================================
    // SUBTOTAL
    // =====================================

    const subtotal =
        items.reduce(
            (total, item) =>
                total +
                item.price *
                    item.quantity,
            0
        );


    // =====================================
    // EMPTY CART
    // =====================================

    if (items.length === 0) {

        return (

            <div className="min-h-screen bg-gray-100">

                <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">

                    <div className="rounded-xl bg-white px-6 py-16 text-center shadow-sm">

                        <ShoppingCart
                            size={64}
                            className="mx-auto text-gray-300"
                        />

                        <h1 className="mt-6 text-2xl font-bold">

                            Your Cart is Empty

                        </h1>

                        <p className="mt-2 text-gray-500">

                            Looks like you haven't
                            added anything to your
                            cart yet.

                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/products"
                                )
                            }
                            className="mt-6 rounded-lg bg-[#FF9900] px-6 py-3 font-semibold hover:bg-[#e88a00]"
                        >

                            Continue Shopping

                        </button>

                    </div>

                </div>

            </div>

        );
    }


    return (

        <div className="min-h-screen bg-gray-100">

            {/* PAGE HEADER */}

            <div className="border-b bg-white">

                <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">

                    <h1 className="text-3xl font-bold">

                        Shopping Cart

                    </h1>

                    <p className="mt-1 text-gray-500">

                        {totalItems}{" "}
                        {totalItems === 1
                            ? "item"
                            : "items"}{" "}
                        in your cart

                    </p>

                </div>

            </div>


            <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">

                <div className="grid gap-6 lg:grid-cols-3">


                    {/* =================================
                        CART ITEMS
                    ================================= */}

                    <div className="space-y-4 lg:col-span-2">

                        {items.map(
                            (item) => (

                                <div
                                    key={
                                        item.productId
                                    }
                                    className="rounded-xl bg-white p-5 shadow-sm"
                                >

                                    <div className="flex gap-5">


                                        {/* IMAGE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/products/${item.productId}`
                                                )
                                            }
                                            className="flex h-32 w-32 shrink-0 items-center justify-center rounded-lg bg-gray-50 p-3"
                                        >

                                            {item.thumbnail ? (

                                                <img
                                                    src={getImageUrl(
                                                        item.thumbnail
                                                    )}
                                                    alt={
                                                        item.name
                                                    }
                                                    className="h-full w-full object-contain"
                                                />

                                            ) : (

                                                <span className="text-4xl">
                                                    📦
                                                </span>

                                            )}

                                        </button>


                                        {/* INFORMATION */}

                                        <div className="flex flex-1 flex-col">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/products/${item.productId}`
                                                    )
                                                }
                                                className="text-left text-lg font-semibold hover:text-blue-600"
                                            >

                                                {
                                                    item.name
                                                }

                                            </button>


                                            <p className="mt-1 text-sm text-gray-500">

                                                ₹
                                                {item.price.toLocaleString(
                                                    "en-IN"
                                                )}{" "}
                                                each

                                            </p>


                                            <div className="mt-auto flex flex-wrap items-center justify-between gap-4">


                                                {/* QUANTITY */}

                                                <div className="flex items-center overflow-hidden rounded-lg border">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            dispatch(
                                                                decreaseQuantity(
                                                                    item.productId
                                                                )
                                                            )
                                                        }
                                                        className="p-2 hover:bg-gray-100"
                                                    >

                                                        <Minus
                                                            size={
                                                                16
                                                            }
                                                        />

                                                    </button>


                                                    <span className="min-w-10 border-x px-3 py-2 text-center font-semibold">

                                                        {
                                                            item.quantity
                                                        }

                                                    </span>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            dispatch(
                                                                increaseQuantity(
                                                                    item.productId
                                                                )
                                                            )
                                                        }
                                                        disabled={
                                                            item.quantity >=
                                                            item.stock
                                                        }
                                                        className="p-2 hover:bg-gray-100 disabled:opacity-40"
                                                    >

                                                        <Plus
                                                            size={
                                                                16
                                                            }
                                                        />

                                                    </button>

                                                </div>


                                                {/* REMOVE */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        dispatch(
                                                            removeFromCart(
                                                                item.productId
                                                            )
                                                        )
                                                    }
                                                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                                                >

                                                    <Trash2
                                                        size={
                                                            16
                                                        }
                                                    />

                                                    Remove

                                                </button>


                                                {/* ITEM TOTAL */}

                                                <p className="text-lg font-bold">

                                                    ₹
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}

                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>


                    {/* =================================
                        ORDER SUMMARY
                    ================================= */}

                    <div>

                        <div className="sticky top-6 rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="text-xl font-bold">

                                Order Summary

                            </h2>


                            <div className="mt-6 space-y-4">

                                <div className="flex justify-between text-gray-600">

                                    <span>
                                        Items (
                                        {
                                            totalItems
                                        }
                                        )
                                    </span>

                                    <span>
                                        ₹
                                        {subtotal.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>

                                </div>


                                <div className="flex justify-between text-gray-600">

                                    <span>
                                        Delivery
                                    </span>

                                    <span className="font-semibold text-green-600">

                                        FREE

                                    </span>

                                </div>


                                <div className="border-t pt-4">

                                    <div className="flex justify-between">

                                        <span className="text-lg font-bold">

                                            Order Total

                                        </span>

                                        <span className="text-2xl font-bold">

                                            ₹
                                            {subtotal.toLocaleString(
                                                "en-IN"
                                            )}

                                        </span>

                                    </div>

                                </div>

                            </div>

                            <button
                                onClick={() => navigate("/checkout")}
                                className="..."
                            >
                                Proceed to Checkout →
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/products"
                                    )
                                }
                                className="mt-3 w-full rounded-lg border py-3 font-semibold hover:bg-gray-50"
                            >

                                Continue Shopping

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
};

export default Cart;