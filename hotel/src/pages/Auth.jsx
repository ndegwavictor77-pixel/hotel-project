

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [mode, setMode] = useState("signup");
    const [serverError, setServerError] = useState("");

    const navigate = useNavigate();

    const {register,handleSubmit,formState: { errors },} = useForm();

    const onSubmit = async (data) => {
        try {
            setServerError("");

            // Choose endpoint based on mode
            const endpoint =
                mode === "signup"
                    ? "http://localhost:8000/auth/register"
                    : "http://localhost:8000/auth/login";
             console.log("Sending:", data);
             console.log("Endpoint:", endpoint);


            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
                    // Get response as text first
        const text = await res.text();

        console.log("Status:", res.status);
        console.log("Raw response:", text);

        let result;

        try {
            result = JSON.parse(text);
        } catch (error) {
            console.error("Response is not JSON:", text);

            throw new Error(
                "Server returned an invalid response. Check your backend."
            );
        }

        console.log("Auth response:", result);

        if (!res.ok) {
            throw new Error(
                result.message ||
                result.error ||
                "Authentication failed"
            );
        }


            // ==========================
            // SIGN UP SUCCESS
            // ==========================
            if (mode === "signup") {
                alert("Account created successfully!");

                // Switch to login
                setMode("login");
            }

            // ==========================
            // LOGIN SUCCESS
            // ==========================
            else {
                alert("Login successful!");

                // If backend returns a token
                if (result.token) {
                    localStorage.setItem(
                        "token",
                        result.token
                    );
                }

                // Save user if backend returns user
                if (result.user) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(result.user)
                    );
                }

                // Go to dashboard
                navigate("/dashboard");
            }

        } catch (error) {
            console.error("Authentication error:", error);

            setServerError(
                error.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <div className="page">

            <div className="container">

                <div className="auth-container">

                    <h1 className="page-title">
                        {mode === "signup"
                            ? "Sign Up"
                            : "Login"}
                    </h1>

                    {serverError && (
                        <div className="form-error">
                            {serverError}
                        </div>
                    )}

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        
                        {mode === "signup" && (
                            <div className="form-group">

                                <label
                                    className="form-label"
                                    htmlFor="name"
                                >
                                    Name
                                </label>

                                <input
                                    className="form-input"
                                    type="text"
                                    id="name"
                                    {...register("name", {
                                        required:
                                            "Name is required",
                                    })}
                                />

                                {errors.name && (
                                    <span className="form-error">
                                        {errors.name.message}
                                    </span>
                                )}

                            </div>
                        )}


                        
                        <div className="form-group">

                            <label
                                className="form-label"
                                htmlFor="email"
                            >
                                Email
                            </label>

                            <input
                                className="form-input"
                                type="email"
                                id="email"
                                {...register("email", {
                                    required:
                                        "Email is required",
                                })}
                            />

                            {errors.email && (
                                <span className="form-error">
                                    {errors.email.message}
                                </span>
                            )}

                        </div>


                        {/* PASSWORD */}
                        <div className="form-group">

                            <label
                                className="form-label"
                                htmlFor="password"
                            >
                                Password
                            </label>

                            <input
                                className="form-input"
                                type="password"
                                id="password"
                                {...register("password", {
                                    required:
                                        "Password is required",

                                    minLength: {
                                        value: 6,
                                        message:
                                            "Password must be at least 6 characters",
                                    },

                                    maxLength: {
                                        value: 12,
                                        message:
                                            "Password must be less than 12 characters",
                                    },
                                })}
                            />

                            {errors.password && (
                                <span className="form-error">
                                    {errors.password.message}
                                </span>
                            )}

                        </div>


                        {/* SUBMIT */}
                        <button
                            type="submit"
                            className="btn btn-secondary btn-large"
                        >
                            {mode === "signup"
                                ? "Sign Up"
                                : "Login"}
                        </button>

                    </form>


                    {/* SWITCH LOGIN / SIGNUP */}
                    <div className="auth-switch">

                        {mode === "signup" ? (

                            <p>
                                Already have an account?{" "}

                                <span
                                    className="auth-link"
                                    onClick={() =>
                                        setMode("login")
                                    }
                                >
                                    Login
                                </span>
                            </p>

                        ) : (

                            <p>
                                Don't have an account?{" "}

                                <span
                                    className="auth-link"
                                    onClick={() =>
                                        setMode("signup")
                                    }
                                >
                                    Sign up
                                </span>
                            </p>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}