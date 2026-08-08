import User from "../models/user.model.js";

const findByEmail = async (email) => {
    return await User.findOne({ email });
};

const createUser = async (userData) => {
    return await User.create(userData);
};

const findById = async (id) => {
    return await User.findById(id);
};
const updateRefreshToken = async (
    userId,
    refreshToken
) => {

    return await User.findByIdAndUpdate(
        userId,
        {
            refreshToken
        },
        {
            new:true
        }
    );

};
const clearRefreshToken = async (userId) => {

    return await User.findByIdAndUpdate(
        userId,
        {
            refreshToken: null
        },
        {
            new: true
        }
    );

};

export default{

    findByEmail,
 
    createUser,
 
    findById,
 
    updateRefreshToken, 
    
    clearRefreshToken
 
 }