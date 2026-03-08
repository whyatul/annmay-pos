import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const loginMutation = useMutation({
    mutationFn: (reqData) => login(reqData),
    onSuccess: (res) => {
      const { data } = res;
      const { id, name, email, phone, role } = data.data;
      dispatch(setUser({ id, name, email, phone, role }));
      navigate("/");
    },
    onError: (error) => {
      const { response } = error;
      enqueueSnackbar(response.data.message, { variant: "error" });
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div>
        <label className="block text-[#666] mb-2 text-xs font-medium uppercase tracking-wider">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@restaurant.com"
          className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f6b100]/50 focus:ring-1 focus:ring-[#f6b100]/20 transition-all duration-200 placeholder:text-[#333]"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-[#666] mb-2 text-xs font-medium uppercase tracking-wider">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f6b100]/50 focus:ring-1 focus:ring-[#f6b100]/20 transition-all duration-200 placeholder:text-[#333]"
          required
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-gradient-to-r from-[#f6b100] to-[#e5a000] hover:from-[#e5a000] hover:to-[#d49500] disabled:opacity-50 disabled:cursor-not-allowed text-[#111] rounded-xl py-3.5 font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-[#f6b100]/10 hover:shadow-[#f6b100]/20 mt-2"
      >
        {loginMutation.isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

export default Login;
