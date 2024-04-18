"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Icons } from "./icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    // Use next-auth's signIn function for login
    const result = await signIn("credentials", {
      callbackUrl: "/dashboard",
      reload: true,
      redirect: true,
      email,
      password,
    });

    if (result?.ok) {
      // Handle successful login
      console.log("Logged in successfully!");
      setIsLoading(false);
    } else {
      // Handle login error
      setError("Login failed");
      setIsLoading(false);
      console.log("Login failed");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative">
      <div className="flex flex-col md:flex-row justify-center shadow-lg overflow-hidden h-full bg-white w-full">
        {/* Left side image */}
        <div className="w-full lg:w-1/2 relative hidden lg:flex">
          <img
            src="/login/login-bg.jpg"
            alt="Login Image"
            className="h-full w-full object-cover"
          />
          {/* Text overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
            <h1 className="text-[40px] font-bold">Wicked ChatBots</h1>
            <p className="text-[14px] mt-4">
              Your ultimate solution for intelligent conversational agents.
            </p>
          </div>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute left-4 top-4 md:left-8 md:top-8 text-white"
            )}
          >
            <>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back
            </>
          </Link>
        </div>

        {/* Right side form */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col gap-y-2 justify-center items-center">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute left-4 top-4 md:left-8 md:top-8 text-[#0F172A] lg:hidden"
            )}
          >
            <>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back
            </>
          </Link>
          <Icons.bot className="mx-auto h-8 w-8" />
          <h2 className="text-[35px] md:text-[40px] font-semibold mb-4 text-center text-[#0F172A] tracking-tight">
            Sign in
          </h2>
          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 w-[50%]"
              role="alert"
            >
              <p>{error}</p>
            </div>
          )}
          <form
            onSubmit={handleLogin}
            className="w-full md:w-[80%] flex flex-col gap-y-2 text-[#0F172A]"
          >
            {/* Email */}
            <div className="mb-4 space-y-2">
              <label htmlFor="email" className="font-medium">
                Enter your email{" "}
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4 space-y-2">
              <label htmlFor="password" className="font-medium">
                Enter your password{" "}
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#ffffff] border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-[12px] bg-[#0F172A] flex justify-center items-center text-white rounded-md hover:bg-[#272E3F] transition duration-200"
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
