import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    user: null,

    accessToken: null,

    isAuthenticated: false,

    loading: false,

    error: null

};

const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {

        loginSuccess: (state, action) => {

            state.user = action.payload.user;

            state.accessToken =
                action.payload.accessToken;

            state.isAuthenticated = true;

            state.error = null;

        },

        logoutSuccess: (state) => {

            state.user = null;

            state.accessToken = null;

            state.isAuthenticated = false;

        },

        setLoading: (state, action) => {

            state.loading = action.payload;

        },

        setError: (state, action) => {

            state.error = action.payload;

        }

    }

});

export const {

    loginSuccess,

    logoutSuccess,

    setLoading,

    setError

} = authSlice.actions;

export default authSlice.reducer;