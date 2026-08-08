import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const CustomerLayout = ({ children }) => {

    return (

        <>

            <Header/>

            <MenuBar/>

            <main>

            {children}

            </main>

            <Footer/>

        </>

    );

};

export default CustomerLayout;