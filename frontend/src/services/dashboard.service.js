import api from "../api/axios";

const getDashboardStats = () => {
    return api.get("/dashboard/stats");
};

export default {
    getDashboardStats
};