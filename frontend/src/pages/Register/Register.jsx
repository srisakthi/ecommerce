import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

import toast from "react-hot-toast";

import { registerUser } from "../../services/auth.service";

import AuthCard from "../../components/auth/AuthCard";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Register = () => {

    const navigate = useNavigate();

    const {

        register,

        handleSubmit,

        watch

    } = useForm();

    const onSubmit = async (data) => {

        try {

            const {

                confirmPassword,
            
                ...userData
            
            } = data;
            
            if (data.password !== data.confirmPassword) {
            
                toast.error("Passwords do not match");
            
                return;
            
            }
            
            await registerUser(userData);

            toast.success("Registration Successful");

            navigate("/login");

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Registration Failed"

            );

        }

    };

    return (

        <AuthCard

            title="Create Account"

            subtitle="Register to continue"

        >

            <form

                onSubmit={handleSubmit(onSubmit)}

                className="space-y-5"

            >

                <div>

                    <Label>First Name</Label>

                    <Input

                        {...register("firstName")}

                        placeholder="First Name"

                    />

                </div>

                <div>

                    <Label>Last Name</Label>

                    <Input

                        {...register("lastName")}

                        placeholder="Last Name"

                    />

                </div>

                <div>

                    <Label>Email</Label>

                    <Input

                        type="email"

                        {...register("email")}

                        placeholder="Email"

                    />

                </div>

                <div>

                    <Label>Password</Label>

                    <Input

                        type="password"

                        {...register("password")}

                        placeholder="Password"

                    />

                </div>

                <div>

                    <Label>Confirm Password</Label>

                    <Input

                        type="password"

                        {...register("confirmPassword")}

                        placeholder="Confirm Password"

                    />

                </div>

                <Button

                    type="submit"

                    className="w-full bg-[#FF9900] hover:bg-[#E68A00] text-black font-semibold"

                >

                    Register

                </Button>

            </form>

            <div className="mt-6 text-center text-sm">

                Already have an account?

                <Link

                    to="/login"

                    className="ml-2 text-blue-600 font-semibold"

                >

                    Login

                </Link>

            </div>

        </AuthCard>

    );

};

export default Register;