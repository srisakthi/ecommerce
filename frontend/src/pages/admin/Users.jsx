import { useState, useEffect } from "react";
import { getAllUsers, updateUserAdmin, deleteUserAdmin, createUserAdmin } from "../../services/user.service";
import { Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [createForm, setCreateForm] = useState({
        firstName: "", lastName: "", email: "", password: "", role: "customer"
    });
    const [editForm, setEditForm] = useState({
        id: "", firstName: "", lastName: "", email: "", role: "customer"
    });

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            if (res.data?.data) {
                setUsers(res.data.data);
            }
        } catch (err) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserAdmin(userId, { role: newRole });
            toast.success("Role updated successfully");
            fetchUsers();
        } catch (err) {
            toast.error("Failed to update role");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUserAdmin(userId);
            toast.success("User deleted successfully");
            fetchUsers();
        } catch (err) {
            toast.error("Failed to delete user");
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await createUserAdmin(createForm);
            toast.success("User created successfully");
            setShowCreateModal(false);
            setCreateForm({ firstName: "", lastName: "", email: "", password: "", role: "customer" });
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create user");
        }
    };

    const openEditModal = (user) => {
        setEditForm({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        });
        setShowEditModal(true);
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            await updateUserAdmin(editForm.id, { 
                firstName: editForm.firstName, 
                lastName: editForm.lastName, 
                email: editForm.email, 
                role: editForm.role 
            });
            toast.success("User updated successfully");
            setShowEditModal(false);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update user");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading users...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <span className="text-sm text-gray-500 font-medium">Total Users: {users.length}</span>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Create User
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b text-xs font-semibold text-gray-600 uppercase">
                            <th className="py-3 px-4">User</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Role</th>
                            <th className="py-3 px-4">Joined Date</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {users.map((u) => (
                            <tr key={u._id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium">
                                    {u.firstName} {u.lastName}
                                </td>
                                <td className="py-3 px-4 text-gray-600">{u.email}</td>
                                <td className="py-3 px-4">
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                        className="border rounded px-2 py-1 bg-white text-xs font-semibold"
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="seller">Seller</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="py-3 px-4 text-gray-500">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => openEditModal(u)}
                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1 rounded transition-colors"
                                            title="Edit User"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Create New User</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="flex gap-4">
                                <input required type="text" placeholder="First Name" value={createForm.firstName} onChange={e => setCreateForm({...createForm, firstName: e.target.value})} className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <input required type="text" placeholder="Last Name" value={createForm.lastName} onChange={e => setCreateForm({...createForm, lastName: e.target.value})} className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <input required type="email" placeholder="Email" value={createForm.email} onChange={e => setCreateForm({...createForm, email: e.target.value})} className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <input required type="password" placeholder="Password" value={createForm.password} onChange={e => setCreateForm({...createForm, password: e.target.value})} className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <select value={createForm.role} onChange={e => setCreateForm({...createForm, role: e.target.value})} className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="customer">Customer</option>
                                <option value="seller">Seller</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Edit User</h2>
                        <form onSubmit={handleEditUser} className="space-y-4">
                            <div className="flex gap-4">
                                <input required type="text" placeholder="First Name" value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})} className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <input required type="text" placeholder="Last Name" value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})} className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <input required type="email" placeholder="Email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="customer">Customer</option>
                                <option value="seller">Seller</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
