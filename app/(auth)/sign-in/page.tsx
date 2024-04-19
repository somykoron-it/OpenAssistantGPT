import Link from "next/link";

import { Metadata } from "next";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import GithubLoginForm from "@/components/github-login-form";
import GoogleLoginForm from "@/components/google-login-form";
import LoginPage from "@/components/login";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function Login() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-black flex h-screen w-screen flex-col items-center justify-center">
      <LoginPage />
    </div>
  );
}
