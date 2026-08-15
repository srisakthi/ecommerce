import { Link } from "react-router-dom";

const Navbar = () => {

    return (

        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 30px",
                background: "#131921",
                color: "white",
                alignItems: "center"
            }}
        >

            <h2>SwiftMart</h2>

            <div>

                <Link
                    to="/"
                    style={{
                        color:"white",
                        marginRight:"20px"
                    }}
                >
                    Home
                </Link>

                <Link
                    to="/dashboard"
                    style={{
                        color:"white",
                        marginRight:"20px"
                    }}
                >
                    Dashboard
                </Link>

                <Link
                    to="/login"
                    style={{
                        color:"white"
                    }}
                >
                    Login
                </Link>

            </div>

        </nav>

    );

};

export default Navbar;