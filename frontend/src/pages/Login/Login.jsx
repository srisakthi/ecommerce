import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
    loginSuccess,
    setLoading,
    setError,
} from "../../features/auth/authSlice";

import { loginUser } from "../../services/auth.service";

import { setAccessToken } from "../../utils/token";

import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Login = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {

        register,

        handleSubmit,

    } = useForm();

    const onSubmit = async (data) => {

        try {

            dispatch(setLoading(true));

            const response = await loginUser(data);

            dispatch(

                loginSuccess(

                    response.data.data

                )

            );

            setAccessToken(

                response.data.data.accessToken

            );

            toast.success("Login Successful");

            if (
                response.data.data.user.role === "admin" ||
                response.data.data.user.role === "seller"
            ) {

                navigate("/admin");

            } else {

                navigate("/");

            }

        }

        catch (error) {

            dispatch(

                setError(

                    error.response?.data?.message ||

                    "Login failed"

                )

            );

            toast.error(

                error.response?.data?.message ||

                "Login failed"

            );

        }

        finally {

            dispatch(

                setLoading(false)

            );

        }

    };

    return (

            <AuthCard

                title="Welcome Back"

                subtitle="Login to continue"

            >

                <form

                    onSubmit={handleSubmit(onSubmit)}

                    className="space-y-5"

                >

                    <div>

                        <Label>

                            Email

                        </Label>

                        <Input

                            type="email"

                            placeholder="Enter your email"

                            {...register("email")}

                        />

                    </div>

                    <div>

                        <Label>

                            Password

                        </Label>

                        <Input

                            type="password"

                            placeholder="Enter your password"

                            {...register("password")}

                        />

                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#FF9900] hover:bg-[#E68A00] text-black font-semibold"
                    >

                        Login

                    </Button>

                </form>

                <div className="mt-6 text-center text-sm">

                    Don't have an account?

                    <Link

                        to="/register"

                        className="ml-2 text-blue-600 font-semibold"

                    >

                        Register

                    </Link>

                </div>

            </AuthCard>


    );

};

export default Login;