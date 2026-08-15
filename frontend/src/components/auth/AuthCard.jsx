import { Card, CardContent } from "@/components/ui/card";

const AuthCard = ({ title, subtitle, children }) => {
    return (
        <Card className="w-full max-w-md shadow-xl rounded-2xl">
            <CardContent className="p-8">
                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-[#131921]">
                        SwiftMart
                    </h1>

                    <h2 className="text-2xl font-semibold mt-6">
                        {title}
                    </h2>

                    <p className="text-gray-500 mt-2">
                        {subtitle}
                    </p>

                </div>

                {children}

            </CardContent>
        </Card>
    );
};

export default AuthCard;