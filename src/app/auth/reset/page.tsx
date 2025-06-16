"use client";

import { changePassword } from "@/lib/auth-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetSchema = z.object({
  oldPassword: z.string().min(8).max(12),
  newPassword: z.string().min(8).max(12),
});

type resetPasswordType = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const email = sessionStorage.getItem("verifyEmail");
  console.log(email);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(resetSchema),
    reValidateMode: "onChange",
  });

  async function onSubmit(data: resetPasswordType) {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("oldPassword", data.oldPassword);
    formData.append("oldPassword", data.newPassword);

    try {
      await changePassword(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to change password");
    }
  }

  const disabledButton = !isValid || loading || !password || !confirmPassword;
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white">Reset account password</h1>
        <p className="text-white/80">
          Enter a new password for <span className="text-blue-600">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-18 py-12 m-8 rounded-xl">
        <div>
          <div className="my-2">
            <input
              {...register("oldPassword")}
              type="password"
              id="oldPasword"
              maxLength={12}
              placeholder="Password"
              className="outline text-md text-black"
            />
          </div>
          {errors.oldPassword && (
            <div className="mt-1 text-sm text-red-600">{errors.oldPassword.message}</div>
          )}
          <div className="my-2">
            <input
              {...register("newPassword")}
              type="password"
              id="newPassword"
              maxLength={12}
              placeholder="Confirm Password"
              className="outline text-md text-black"
            />
          </div>
          {errors.newPassword && (
            <div className="mt-1 text-sm text-red-600">{errors.newPassword.message}</div>
          )}
        </div>
        <div>
          <button
            type="button"
            disabled={disabledButton}
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
                Updating...
              </>
            ) : (
              "Reset Password"
            )}{" "}
          </button>
        </div>
      </form>
    </div>
  );
}
