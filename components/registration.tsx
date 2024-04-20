"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Icons } from './icons';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

const RegistrationPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError("");
      // Make a POST request to the server endpoint
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.firstName + " " + formData.lastName,
          email: formData.email,
          password: formData.password,
          magicLink: window.location.href,
        }),
      });

      if (response.ok) {
        // Parse the JSON response
        const data = await response.json();

        // Handle successful registration
        console.log("User registered successfully:", data);
        router.push("/login");
        setIsLoading(false);
        // Perform any additional actions such as redirecting to another page or displaying a success message
      } else {
        // Handle registration failure
        console.log("Failed to register user");
        // Optionally, parse and log error data from the response
        const errorData = await response.json();
        setIsLoading(false);
        setError(errorData);
        console.error("Registration error:", errorData);
      }
    } catch (error: any) {
      console.error("An error occurred:", error);
      setError(error.message);
      // Handle error
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative">
      <div className="flex flex-col md:flex-row justify-center shadow-lg overflow-hidden h-full bg-white md:w-3/4 lg:w-full">
        {/* Left side image */}
        <div className="w-full md:w-1/2 relative hidden md:flex">
          <img
            src="/login/login-bg.jpg"
            alt="Login Image"
            className="h-full w-full object-cover"
          />
          {/* Text overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
            <h1 className="text-[40px] font-bold">
            Wicked ChatBots
            </h1>
            <p className="text-[14px] mt-4">
              Your ultimate solution for intelligent conversational agents.
            </p>
          </div>
          <a
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
          </a>
        </div>
        {/* Right side form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col gap-y-2 justify-center items-center">
        <a
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
          </a>
          <Icons.bot className="mx-auto h-8 w-8" />
          <h2 className="text-[35px] md:text-[40px] font-semibold mb-4 text-center text-black tracking-tight">
            Sign up
          </h2>
          <form onSubmit={handleSubmit } className="w-full md:w-[60%] flex flex-col gap-y-2">
            {/* First Name and Last Name */}
            <div className="mb-4">
              <div className="flex space-x-4">
                <div className=" flex flex-col space-y-2 w-[80%]">
                <label htmlFor="firstName">First Name </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
                </div>
                <div className="flex flex-col space-y-2 w-[80%]">
                <label htmlFor="lastName">Last Name </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="mb-4 space-y-2">
            <label htmlFor="email">Email </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#ffffff] border rounded"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4 space-y-2">
              <label htmlFor="password">Password </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#ffffff] border rounded"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4 space-y-2">
              <label htmlFor="confirmPassword">Confirm Password </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 bg-[#ffffff] py-2 border rounded"
                required
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-2 bg-[#0F172A] text-white rounded-md hover:bg-[#272E3F] transition duration-200"
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
