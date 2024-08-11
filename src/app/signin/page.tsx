//@ts-nocheck
"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SectionHeading from "../components/SectionHeading";

interface SignInFormProps {
  onSignIn: (email: string, password: string) => void;
}

function SignInForm({ onSignIn }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  return (
    <div className="bg-purple-950 max-w-lg mx-auto p-8 rounded-3xl">
      <SectionHeading text="Sign In" />
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="text-white mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-2 rounded-md bg-purple-200"
          required
        />

        <label className="text-white mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 p-2 rounded-md bg-purple-200"
          required
        />

        <button
          type="submit"
          className="bg-green-500 text-white py-2 rounded-md font-bold"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default function SignInPage() {
  const handleSignIn = (email: string, password: string) => {
    // Handle the sign-in logic here
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div>
      <Navbar />
      <div className="mt-20">
        <SignInForm onSignIn={handleSignIn} />
      </div>
    </div>
  );
}
