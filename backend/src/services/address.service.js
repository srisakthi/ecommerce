import Address from "../models/address.model.js";
import ApiError from "../utils/ApiError.js";

const getMyAddresses = async (userId) => {
    return Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
};

const getAddressById = async (addressId, userId) => {
    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
        throw new ApiError(404, "Address not found");
    }
    return address;
};

const createAddress = async (userId, addressData) => {
    if (addressData.isDefault) {
        await Address.updateMany({ user: userId }, { isDefault: false });
    }

    const existingCount = await Address.countDocuments({ user: userId });
    const isDefault = existingCount === 0 ? true : !!addressData.isDefault;

    const address = await Address.create({
        ...addressData,
        user: userId,
        isDefault,
    });
    return address;
};

const updateAddress = async (addressId, userId, addressData) => {
    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    if (addressData.isDefault) {
        await Address.updateMany({ user: userId }, { isDefault: false });
    }

    Object.assign(address, addressData);
    await address.save();
    return address;
};

const deleteAddress = async (addressId, userId) => {
    const address = await Address.findOneAndDelete({ _id: addressId, user: userId });
    if (!address) {
        throw new ApiError(404, "Address not found");
    }
    return true;
};

export default {
    getMyAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
};
