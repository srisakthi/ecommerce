import { createSlice } from "@reduxjs/toolkit";

const getInitialCart = () => {
    try {
        const savedCart =
            localStorage.getItem("cart");

        return savedCart
            ? JSON.parse(savedCart)
            : [];
    } catch (error) {
        console.error(
            "Failed to load cart:",
            error
        );

        return [];
    }
};

const initialState = {
    items: getInitialCart(),
};

const saveCart = (items) => {
    localStorage.setItem(
        "cart",
        JSON.stringify(items)
    );
};

const cartSlice = createSlice({
    name: "cart",

    initialState,

    reducers: {

        // =====================================
        // ADD PRODUCT TO CART
        // =====================================

        addToCart: (state, action) => {

            const product =
                action.payload;

            const existingItem =
                state.items.find(
                    (item) =>
                        item.productId ===
                        product.productId
                );

            if (existingItem) {

                existingItem.quantity +=
                    product.quantity;

            } else {

                state.items.push(product);

            }

            saveCart(state.items);
        },


        // =====================================
        // REMOVE PRODUCT
        // =====================================

        removeFromCart: (
            state,
            action
        ) => {

            state.items =
                state.items.filter(
                    (item) =>
                        item.productId !==
                        action.payload
                );

            saveCart(state.items);
        },


        // =====================================
        // INCREASE QUANTITY
        // =====================================

        increaseQuantity: (
            state,
            action
        ) => {

            const item =
                state.items.find(
                    (item) =>
                        item.productId ===
                        action.payload
                );

            if (
                item &&
                item.quantity <
                    item.stock
            ) {

                item.quantity += 1;

            }

            saveCart(state.items);
        },


        // =====================================
        // DECREASE QUANTITY
        // =====================================

        decreaseQuantity: (
            state,
            action
        ) => {

            const item =
                state.items.find(
                    (item) =>
                        item.productId ===
                        action.payload
                );

            if (
                item &&
                item.quantity > 1
            ) {

                item.quantity -= 1;

            }

            saveCart(state.items);
        },


        // =====================================
        // CLEAR CART
        // =====================================

        clearCart: (state) => {

            state.items = [];

            saveCart(state.items);
        },

    },
});

export const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;