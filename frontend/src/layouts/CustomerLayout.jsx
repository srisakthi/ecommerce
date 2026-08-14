import Header from "../components/layout/Header";
import MenuBar from "../components/layout/MenuBar";
import Footer from "../components/layout/Footer";

const CustomerLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">

            <Header />

            <MenuBar />

            <main>
                {children}
            </main>

            <Footer />

        </div>
    );
};

export default CustomerLayout;