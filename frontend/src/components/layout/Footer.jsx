import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <footer className="bg-[#232F3E] text-white py-8">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Brand and Copyright */}
                    <div className="text-center md:text-left">
                        <div className="text-xl font-bold mb-2">NexCart</div>
                        <p className="text-sm text-gray-400">
                            &copy; {currentTime.getFullYear()} NexCart. All rights reserved.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
                        <span className="hover:text-white hover:underline cursor-pointer transition-colors">
                            Terms & Conditions
                        </span>
                        <span>|</span>
                        <span className="hover:text-white hover:underline cursor-pointer transition-colors">
                            Privacy Policy
                        </span>
                        <span>|</span>
                        <span className="hover:text-white hover:underline cursor-pointer transition-colors">
                            Help Center
                        </span>
                    </div>

                    {/* Date and Time */}
                    <div className="text-center md:text-right text-sm text-gray-400">
                        <div className="font-semibold text-gray-200">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                        <div>
                            {currentTime.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;