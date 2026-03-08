import React, { useEffect } from "react";
import logo from "../assets/images/annamay-logo.svg";
import Login from "../components/auth/Login";

const Auth = () => {
  useEffect(() => {
    document.title = "Annamay POS | Sign In";
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#f6b100]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#f6b100]/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Annamay Logo" className="h-16 w-16 rounded-2xl object-cover mb-4" />
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Annamay <span className="text-[#f6b100]">POS</span>
          </h1>
          <p className="text-[#555] text-sm mt-1 tracking-wide">
            Restaurant Management System
          </p>
        </div>

        {/* Glass card */}
        <div className="bg-[#111]/80 backdrop-blur-xl border border-[#1e1e1e] rounded-2xl p-8 shadow-2xl shadow-black/40">
          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
          <p className="text-[#555] text-sm mb-6">
            Sign in to your employee account
          </p>

          {/* Form */}
          <Login />
        </div>

        {/* Footer */}
        <p className="text-center text-[#333] text-xs mt-6 tracking-wider">
          &copy; {new Date().getFullYear()} Annamay &middot; All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Auth;
