"use client";

import { changePassword } from "@/lib/auth-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetSchema = z.object({
  oldPassword: z.string().min(8).max(12),
  newPassword: z.string().min(8).max(12),
  email: z.string().email(),
});

type resetPasswordType = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [getEmail, setGetEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(resetSchema),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    const email = sessionStorage.getItem("verifyEmail");
    if (email) {
      setGetEmail(email);
      setValue("email", email);
    }
  }, [setValue]);

  const oldPasswordWatch = watch("oldPassword");
  const newPasswordWatch = watch("newPassword");

  useEffect(() => {
    if ((error && oldPasswordWatch) || newPasswordWatch) {
      setError(null);
    }
  }, [oldPasswordWatch, newPasswordWatch]);

  async function onSubmit(data: resetPasswordType) {
    if (data.oldPassword !== data.newPassword) {
      setError("Passwords must match.");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("oldPassword", data.oldPassword);
    formData.append("newPassword", data.newPassword);
    formData.append("email", data.email);

    try {
      await changePassword(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to change password");
    }
  }

  const disabledButton = !isValid || loading;
  return (
    <div className=" flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-md border-2 shadow-2xl">
        <div className=" flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-black">Reset account password </h1>
            <div>
              <Key />
            </div>
          </div>
          <p className="text-black/80 ">
            Enter a new password for <span className="text-blue-600 animate-pulse">{getEmail}</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white  py-12 m-8 rounded-xl space-y-4"
        >
          <div>
            <div className="my-2">
              <input
                {...register("oldPassword")}
                type="password"
                id="oldPassword"
                maxLength={12}
                placeholder="Password"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {errors.newPassword && (
              <div className="mt-1 text-sm text-red-600">{errors.newPassword.message}</div>
            )}
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          <div>
            <button
              type="submit"
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
    </div>
  );
}
