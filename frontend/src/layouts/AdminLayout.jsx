import Sidebar from "@/components/admin/Sidebar";

const AdminLayout = ({ children }) => {

    return (

        <div className="flex min-h-screen bg-gray-100">

            <Sidebar />

            <main className="flex-1 overflow-y-auto">

                {children}

            </main>

        </div>

    );

};

export default AdminLayout;