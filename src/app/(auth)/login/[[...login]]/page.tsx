'use client'

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white min-h-[100dvh]">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-black hover:bg-zinc-900 transition-all text-sm font-bold',
              card: 'shadow-none border-none',
              headerTitle: 'text-3xl font-black tracking-tighter',
              headerSubtitle: 'text-zinc-500 font-medium',
            }
          }}
          signUpUrl="/sign-up"
          forceRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
