import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import addressService from "../services/address.service.js";

const getMyAddresses = asyncHandler(async (req, res) => {
    const addresses = await addressService.getMyAddresses(req.user.id);
    return res.status(200).json(
        new ApiResponse(200, "Addresses fetched successfully", addresses)
    );
});

const getAddressById = asyncHandler(async (req, res) => {
    const address = await addressService.getAddressById(req.params.id, req.user.id);
    return res.status(200).json(
        new ApiResponse(200, "Address fetched successfully", address)
    );
});

const createAddress = asyncHandler(async (req, res) => {
    const address = await addressService.createAddress(req.user.id, req.body);
    return res.status(201).json(
        new ApiResponse(201, "Address created successfully", address)
    );
});

const updateAddress = asyncHandler(async (req, res) => {
    const address = await addressService.updateAddress(req.params.id, req.user.id, req.body);
    return res.status(200).json(
        new ApiResponse(200, "Address updated successfully", address)
    );
});

const deleteAddress = asyncHandler(async (req, res) => {
    await addressService.deleteAddress(req.params.id, req.user.id);
    return res.status(200).json(
        new ApiResponse(200, "Address deleted successfully")
    );
});

export default {
    getMyAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
};
