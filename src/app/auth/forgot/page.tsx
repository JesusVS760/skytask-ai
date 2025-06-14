"use client";

import { sendVerifyCode } from "@/lib/auth-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { z } from "zod";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type forgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const [error, setError] = useState<string | null>(null);
  const [loading, isLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<forgotFormData>({
    resolver: zodResolver(forgotSchema),
    mode: "onChange",
  });

  async function onSubmit(data: forgotFormData) {
    isLoading(true);
    const formData = new FormData();
    formData.append("email", data.email);
    let shouldRedirect = false;

    try {
      const { success } = await sendVerifyCode(formData);
      if (success) {
        toast("Succesfully sent code ✔️!");
        sessionStorage.setItem("verifyEmail", data.email);
        shouldRedirect = true;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create account");
    } finally {
      isLoading(false);
    }
    if (shouldRedirect) {
      redirect("/auth/verify");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Toaster />
      <div className="flex items-center flex-col justify-center">
        <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Forgot Password?</h1>
          </div>
          <div>
            <p className="text-white/90">Enter email to get access.</p>
          </div>
        </div>
      </div>
      <div className=" bg-white rounded-2xl shadow-xl p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                autoComplete="email"
                placeholder="Enter your email..."
                className="w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.email && (
                <div className="mt-1 text-sm text-red-600">{errors.email.message}</div>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !isValid}
            className="w-full flex justify-center py-3 cursor-pointer px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...{" "}
              </>
            ) : (
              "Send verification code"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
