import { useState, useEffect } from "react";
import { getAllReviewsAdmin, deleteReview } from "../../services/review.service";
import { deleteUserAdmin } from "../../services/user.service";
import toast from "react-hot-toast";

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await getAllReviewsAdmin();
            if (res.data?.data) {
                setReviews(res.data.data);
            }
        } catch (err) {
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this review?")) return;
        try {
            await deleteReview(id);
            toast.success("Review deleted");
            fetchReviews();
        } catch (err) {
            toast.error("Failed to delete review");
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to completely remove user ${userName}? This action cannot be undone.`)) return;
        try {
            await deleteUserAdmin(userId);
            toast.success(`User ${userName} has been removed.`);
            fetchReviews();
        } catch (err) {
            toast.error("Failed to delete user");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading reviews...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Review Moderation</h1>
                    <p className="text-sm text-gray-500">Monitor customer product ratings and reviews</p>
                </div>
                <span className="text-sm font-semibold text-gray-500">Total Reviews: {reviews.length}</span>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b text-xs font-semibold text-gray-600 uppercase">
                            <th className="py-3 px-4">Product</th>
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-4">Rating</th>
                            <th className="py-3 px-4">Comment</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {reviews.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    No customer reviews yet.
                                </td>
                            </tr>
                        ) : (
                            reviews.map((r) => (
                                <tr key={r._id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium max-w-xs truncate">{r.product?.name || "N/A"}</td>
                                    <td className="py-3 px-4 text-gray-600">{r.user?.firstName} {r.user?.lastName}</td>
                                    <td className="py-3 px-4">
                                        <span className="font-bold text-yellow-600">★ {r.rating} / 5</span>
                                    </td>
                                    <td className="py-3 px-4 max-w-sm">
                                        {r.title && <p className="font-semibold text-xs text-gray-900">{r.title}</p>}
                                        <p className="text-gray-600 text-xs line-clamp-2">{r.comment}</p>
                                    </td>
                                    <td className="py-3 px-4 text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-right flex flex-col items-end gap-1">
                                        <button onClick={() => handleDelete(r._id)} className="text-red-600 font-semibold text-xs hover:underline">
                                            Delete Review
                                        </button>
                                        {r.user?._id && (
                                            <button onClick={() => handleDeleteUser(r.user._id, r.user.firstName)} className="text-gray-500 font-semibold text-xs hover:text-red-600 hover:underline">
                                                Ban User
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReviews;
