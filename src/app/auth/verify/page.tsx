"use client";

import { VerifyResetCode } from "@/lib/auth-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const verifySchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .regex(/^\d{6}$/, "Code must be exactly 6 digits"),
});

type VerifyFromData = z.infer<typeof verifySchema>;

export default function VerifyCode() {
  const [error, setError] = useState<string | null>(null);
  const [loading, isLoading] = useState(false);
  const [email, setEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VerifyFromData>({
    resolver: zodResolver(verifySchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const codeValue = watch("code");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verifyEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    // sessionStorage.removeItem("verifyEmail");
  }, []);

  async function onSubmit(data: VerifyFromData) {
    isLoading(true);
    const formData = new FormData();
    formData.append("code", data.code);
    formData.append("email", email);

    try {
      await VerifyResetCode(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to verify code");
    } finally {
      isLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md w-full">
        <div className="flex flex-col rounded-2xl">
          <div className="mx-auto h-12 w-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="pb-4 gap-4 text-center">
            <div>
              <h1 className="text-2xl font-semibold text-white">Check Your Email</h1>
            </div>
            <div>
              <p className="text-white/90">
                We sent a 6-digit code to <span className="font-medium">{email}</span>
              </p>
            </div>
          </div>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-white mb-1">
              Verification Code
            </label>
            <input
              {...register("code")}
              type="text"
              id="code"
              maxLength={6}
              placeholder="000000"
              className="w-full px-3 text-white py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-2xl font-mono tracking-widest"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
              }}
            />
            {errors.code && <div className="mt-1 text-sm text-red-600">{errors.code.message}</div>}
          </div>
          <button
            type="submit"
            disabled={loading || !codeValue || codeValue.length !== 6}
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
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
