import Header from "@/components/admin/Header";

import DashboardCard from "@/components/admin/DashboardCard";

const Dashboard = () => {

    return (

        <>

            <Header />

            <div className="p-8">

                <div className="grid grid-cols-4 gap-6">

                    <DashboardCard

                        title="Products"

                        value="125"

                        color="bg-blue-600"

                    />

                    <DashboardCard

                        title="Categories"

                        value="18"

                        color="bg-green-600"

                    />

                    <DashboardCard

                        title="Orders"

                        value="560"

                        color="bg-orange-500"

                    />

                    <DashboardCard

                        title="Users"

                        value="280"

                        color="bg-purple-600"

                    />

                </div>

            </div>

        </>

    );

};

export default Dashboard;