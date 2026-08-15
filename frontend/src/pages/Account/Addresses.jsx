import { useState, useEffect } from "react";
import { getAddresses, createAddress, deleteAddress } from "../../services/address.service";
import toast from "react-hot-toast";

const Addresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false,
    });

    const fetchAddrs = async () => {
        try {
            const res = await getAddresses();
            if (res.data?.data) {
                setAddresses(res.data.data);
            }
        } catch (err) {
            toast.error("Failed to load addresses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddrs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createAddress(formData);
            toast.success("Address added successfully!");
            setShowForm(false);
            setFormData({
                fullName: "",
                phone: "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                postalCode: "",
                country: "India",
                isDefault: false,
            });
            fetchAddrs();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add address");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;
        try {
            await deleteAddress(id);
            toast.success("Address deleted");
            fetchAddrs();
        } catch (err) {
            toast.error("Failed to delete address");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading addresses...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Your Saved Addresses</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-[#ff9900] px-4 py-2 rounded-md font-semibold hover:bg-orange-500"
                    >
                        {showForm ? "Cancel" : "+ Add New Address"}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Phone</label>
                            <input
                                type="text"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Postal Code</label>
                            <input
                                type="text"
                                required
                                value={formData.postalCode}
                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium">Address Line 1</label>
                            <input
                                type="text"
                                required
                                value={formData.addressLine1}
                                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium">Address Line 2</label>
                            <input
                                type="text"
                                value={formData.addressLine2}
                                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">City</label>
                            <input
                                type="text"
                                required
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">State</label>
                            <input
                                type="text"
                                required
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
                            />
                        </div>
                        <div className="md:col-span-2 flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                            />
                            <label htmlFor="isDefault" className="text-sm">Set as default address</label>
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="bg-[#ff9900] px-6 py-2 rounded-md font-bold hover:bg-orange-500">
                                Save Address
                            </button>
                        </div>
                    </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.length === 0 ? (
                        <p className="text-gray-500">No saved addresses found.</p>
                    ) : (
                        addresses.map((addr) => (
                            <div key={addr._id} className="bg-white p-5 rounded-lg shadow-sm border relative">
                                {addr.isDefault && (
                                    <span className="absolute top-3 right-3 bg-gray-200 text-xs font-semibold px-2 py-1 rounded">
                                        Default
                                    </span>
                                )}
                                <p className="font-bold text-lg">{addr.fullName}</p>
                                <p className="text-sm text-gray-600 mt-1">{addr.addressLine1}</p>
                                {addr.addressLine2 && <p className="text-sm text-gray-600">{addr.addressLine2}</p>}
                                <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.postalCode}</p>
                                <p className="text-sm text-gray-600">{addr.country}</p>
                                <p className="text-sm text-gray-600 mt-2">Phone: {addr.phone}</p>
                                <div className="mt-4 border-t pt-3 flex justify-end">
                                    <button onClick={() => handleDelete(addr._id)} className="text-red-600 text-sm font-semibold hover:underline">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Addresses;
