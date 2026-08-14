import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createOrder } from "../../services/order.service";

const Checkout = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cartItems = useSelector(
        (state) => state.cart.items
    );

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
    });


    const subtotal = useMemo(() => {

        return cartItems.reduce(
            (total, item) =>
                total +
                Number(item.price) *
                Number(item.quantity),
            0
        );

    }, [cartItems]);


    const shippingCost = 0;

    const totalAmount =
        subtotal + shippingCost;


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        if (cartItems.length === 0) {

            toast.error(
                "Your cart is empty"
            );

            navigate("/products");

            return;
        }


        try {

            setLoading(true);


            const orderItems =
                cartItems.map((item) => ({
                    product:
                        item.productId ||
                        item.product?._id ||
                        item.product,

                    quantity:
                        item.quantity,
                }));


            const response =
                await createOrder({

                    items:
                        orderItems,

                    shippingAddress:
                        formData,

                    paymentMethod:
                        "cod",

                    notes: "",
                });


            const order =
                response.data.data;


            toast.success(
                "Order placed successfully"
            );


            navigate(
                `/orders/${order._id}`
            );


        } catch (error) {

            console.error(
                "Create order error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to place order"
            );

        } finally {

            setLoading(false);

        }
    };


    if (cartItems.length === 0) {

        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">

                <h1 className="text-2xl font-bold">
                    Your cart is empty
                </h1>

                <button
                    onClick={() =>
                        navigate("/products")
                    }
                    className="mt-5 rounded-md bg-[#ff9900] px-6 py-3 font-semibold"
                >
                    Continue Shopping
                </button>

            </div>
        );
    }


    return (

        <div className="min-h-screen bg-gray-100 py-8">

            <div className="mx-auto max-w-7xl px-4">

                <h1 className="mb-6 text-3xl font-bold">
                    Checkout
                </h1>


                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-6 lg:grid-cols-3"
                >

                    {/* SHIPPING ADDRESS */}

                    <div className="lg:col-span-2">

                        <div className="rounded-lg bg-white p-6 shadow-sm">

                            <h2 className="mb-5 text-xl font-bold">
                                Delivery Address
                            </h2>


                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                <div className="md:col-span-2">

                                    <label className="mb-1 block text-sm font-medium">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        value={
                                            formData.fullName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
                                        placeholder="Enter full name"
                                    />

                                </div>


                                <div>

                                    <label className="mb-1 block text-sm font-medium">
                                        Phone
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={
                                            formData.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
                                        placeholder="Enter phone number"
                                    />

                                </div>


                                <div>

                                    <label className="mb-1 block text-sm font-medium">
                                        Postal Code
                                    </label>

                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={
                                            formData.postalCode
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
                                        placeholder="Postal code"
                                    />

                                </div>


                                <div className="md:col-span-2">

                                    <label className="mb-1 block text-sm font-medium">
                                        Address Line 1
                                    </label>

                                    <input
                                        type="text"
                                        name="addressLine1"
                                        value={
                                            formData.addressLine1
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
                                        placeholder="House / street address"
                                    />

                                </div>


                                <div className="md:col-span-2">

                                    <label className="mb-1 block text-sm font-medium">
                                        Address Line 2
                                    </label>

                                    <input
                                        type="text"
                                        name="addressLine2"
                                        value={
                                            formData.addressLine2
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
                                        placeholder="Apartment, landmark, etc."
                                    />

                                </div>


                                <div>

                                    <label className="mb-1 block text-sm font-medium">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={
                                            formData.city
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
                                        placeholder="City"
                                    />

                                </div>


                                <div>

                                    <label className="mb-1 block text-sm font-medium">
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={
                                            formData.state
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
                                        placeholder="State"
                                    />

                                </div>


                                <div>

                                    <label className="mb-1 block text-sm font-medium">
                                        Country
                                    </label>

                                    <input
                                        type="text"
                                        name="country"
                                        value={
                                            formData.country
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* PAYMENT */}

                        <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">

                            <h2 className="mb-4 text-xl font-bold">
                                Payment Method
                            </h2>


                            <label className="flex cursor-pointer items-center gap-3 rounded-md border p-4">

                                <input
                                    type="radio"
                                    checked
                                    readOnly
                                />

                                <div>

                                    <p className="font-semibold">
                                        Cash on Delivery
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Pay when your order is delivered.
                                    </p>

                                </div>

                            </label>

                        </div>

                    </div>


                    {/* ORDER SUMMARY */}

                    <div>

                        <div className="sticky top-5 rounded-lg bg-white p-6 shadow-sm">

                            <h2 className="mb-5 text-xl font-bold">
                                Order Summary
                            </h2>


                            <div className="space-y-3">

                                {cartItems.map(
                                    (item) => (

                                        <div
                                            key={
                                                item.productId ||
                                                item.product?._id ||
                                                item.product
                                            }
                                            className="flex justify-between gap-4 text-sm"
                                        >

                                            <span>
                                                {item.name}
                                                {" × "}
                                                {item.quantity}
                                            </span>

                                            <span className="font-medium">
                                                ₹
                                                {(
                                                    Number(item.price) *
                                                    Number(item.quantity)
                                                ).toLocaleString("en-IN")}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>


                            <div className="my-5 border-t" />


                            <div className="flex justify-between">

                                <span>
                                    Subtotal
                                </span>

                                <span>
                                    ₹
                                    {subtotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </span>

                            </div>


                            <div className="mt-3 flex justify-between">

                                <span>
                                    Delivery
                                </span>

                                <span className="font-medium text-green-600">
                                    FREE
                                </span>

                            </div>


                            <div className="my-5 border-t" />


                            <div className="flex justify-between text-lg font-bold">

                                <span>
                                    Order Total
                                </span>

                                <span>
                                    ₹
                                    {totalAmount.toLocaleString(
                                        "en-IN"
                                    )}
                                </span>

                            </div>


                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-6 w-full rounded-md bg-[#ff9900] px-4 py-3 font-bold hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Placing Order..."
                                    : "Place Order"
                                }
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/cart")
                                }
                                className="mt-3 w-full rounded-md border px-4 py-3 font-semibold"
                            >
                                Back to Cart
                            </button>

                        </div>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default Checkout;