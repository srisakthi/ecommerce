import { FaBars } from "react-icons/fa";

const MenuBar = () => {

    return (

        <div className="bg-[#232F3E] text-white">

            <div className="max-w-[1500px] mx-auto flex gap-6 px-5 py-3">

                <div className="flex items-center gap-2">

                    <FaBars/>

                    All

                </div>

                <div>

                    Today's Deals

                </div>

                <div>

                    Customer Service

                </div>

                <div>

                    Registry

                </div>

                <div>

                    Gift Cards

                </div>

                <div>

                    Sell

                </div>

            </div>

        </div>

    );

};

export default MenuBar;