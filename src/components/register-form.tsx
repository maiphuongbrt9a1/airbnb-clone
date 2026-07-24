"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { signIn } from "next-auth/react";

type RegisterFormProps = {
  action: (FormData: FormData) => Promise<void>;
};

function RegisterSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-600 disabled:opacity-70"
      disabled={pending}
    >
      {pending ? "Creating your account..." : "create account"}
    </button>
  );
}

/**
 * Two parallel signup paths in One UI
 * 1) Native form Post -> Server action (name, email, password fields)
 * 2) Button -> Next Auth Google Provider (client redirect)
 */

export function RegisterForm({ action }: RegisterFormProps) {
  const [googleLoading, setGoogleLoading] = useState(false);

  return <></>;
}
