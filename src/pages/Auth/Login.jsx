import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import GoogleLogin from "./GoogleLogin";
import { FaEnvelope, FaLock, FaArrowRight, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { HiTrendingUp, HiUsers } from "react-icons/hi";

const Login = () => {
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { signInUser } = useAuth();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleDemoLogin = (role) => {
    if (role === 'admin') {
      setValue("email", "admin@gmail.com");
      setValue("password", "123456");
    } else if(role === 'staff') {
      setValue("email", "staff@gmail.com");
      setValue("password", "123456");
    } else {
      setValue("email", "citizen@gmail.com");
      setValue("password", "123456");
    }
  };

  const onSubmit = async (data) => {
    setAuthError("");
    const { email, password } = data;

    try {
      const res = await signInUser(email, password);
      if (res.user?.accessToken) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setAuthError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Column: Contextual App Preview (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-center bg-slate-50 relative overflow-hidden p-12">
         {/* Background Decoration */}
         <div className="absolute inset-0 pattern-grid-lg opacity-5"></div>
         
         <div className="relative z-10 max-w-lg mx-auto w-full">
            <div className="mb-8">
               <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                  Changes start with <br/><span className="text-brand-emerald">awareness</span>.
               </h1>
               <p className="text-lg text-slate-500">
                  Log in to access your city dashboard and track infrastructure improvements in real-time.
               </p>
            </div>

            {/* "City Pulse" Widget Mock */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
               <div className="bg-slate-900 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                     <span className="text-xs font-bold text-white uppercase tracking-wider">City Pulse Live</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">UPDATED 1M AGO</span>
               </div>
               
               <div className="p-6 grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                     <div className="flex items-center gap-2 mb-2">
                        <FaCheckCircle className="text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-800 uppercase">Resolved</span>
                     </div>
                     <div className="text-2xl font-black text-slate-900">142</div>
                     <div className="text-xs text-emerald-600 font-medium">+12% this week</div>
                  </div>
                  
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                     <div className="flex items-center gap-2 mb-2">
                        <FaExclamationCircle className="text-amber-500" />
                        <span className="text-xs font-bold text-amber-800 uppercase">Pending</span>
                     </div>
                     <div className="text-2xl font-black text-slate-900">28</div>
                     <div className="text-xs text-amber-600 font-medium">Active reports</div>
                  </div>

                  <div className="col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                           <HiUsers className="text-xl" />
                        </div>
                        <div>
                           <div className="text-sm font-bold text-slate-900">Community Impact</div>
                           <div className="text-xs text-slate-500">2.4k Citizens Active</div>
                        </div>
                     </div>
                     <HiTrendingUp className="text-brand-emerald text-2xl" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 bg-white relative">
         <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
               <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-2xl font-black mb-8">
                  <span className="text-brand-emerald">P</span>
                  <span className="text-slate-900">IIRS</span>
               </Link>
               <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
               <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3 mb-4">
                   <button 
                      type="button"
                      onClick={() => handleDemoLogin('citizen')}
                      className="btn btn-outline btn-sm text-xs font-bold border-slate-200 hover:bg-slate-50 hover:border-brand-emerald hover:text-brand-emerald"
                   >
                      Demo Citizen
                   </button>
                   <button 
                      type="button"
                      onClick={() => handleDemoLogin('admin')}
                      className="btn btn-outline btn-sm text-xs font-bold border-slate-200 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600"
                   >
                      Demo Admin
                   </button>
                   <button 
                      type="button"
                      onClick={() => handleDemoLogin('staff')}
                      className="btn btn-outline btn-sm text-xs font-bold border-slate-200 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600"
                   >
                      Demo Staff
                   </button>
                </div>
                <GoogleLogin />
               
               <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Or sign in with email</span>
                  <div className="flex-grow border-t border-slate-200"></div>
               </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
               {authError && (
                  <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl">
                     {authError}
                  </div>
               )}

               <div className="space-y-4">
                  <div className="form-control">
                     <label className="label">
                        <span className="label-text font-bold text-gray-700">Email Address</span>
                     </label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                           type="email"
                           placeholder="name@example.com"
                           className={`input input-bordered w-full pl-10 bg-slate-50 focus:bg-white transition-colors ${errors.email ? "input-error" : ""}`}
                           {...register("email", {
                              required: "Email is required",
                              pattern: {
                                 value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                 message: "Please enter a valid email",
                              },
                           })}
                        />
                     </div>
                     {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email.message}</span>}
                  </div>

                  <div className="form-control">
                     <label className="label">
                        <span className="label-text font-bold text-gray-700">Password</span>
                     </label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <FaLock className="text-gray-400" />
                        </div>
                        <input
                           type="password"
                           placeholder="••••••••"
                           className={`input input-bordered w-full pl-10 bg-slate-50 focus:bg-white transition-colors ${errors.password ? "input-error" : ""}`}
                           {...register("password", {
                              required: "Password is required",
                              minLength: {
                                 value: 6,
                                 message: "Password must be at least 6 characters",
                              },
                           })}
                        />
                     </div>
                     {errors.password && <span className="text-xs text-red-500 mt-1">{errors.password.message}</span>}
                     
                     <div className="flex justify-end mt-1">
                        <button type="button" className="text-xs font-semibold text-brand-emerald hover:text-emerald-700">
                           Forgot password?
                        </button>
                     </div>
                  </div>
               </div>

               <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full h-12 text-base font-bold shadow-lg shadow-brand-emerald/20"
               >
                  {isSubmitting ? <span className="loading loading-spinner"></span> : "Sign in"}
                  {!isSubmitting && <FaArrowRight className="ml-2" />}
               </button>
            </form>

            <div className="text-center text-sm text-gray-500">
               Don't have an account?{" "}
               <Link to="/register" className="font-bold text-brand-emerald hover:text-emerald-700 transition-colors">
                  Create free account
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Login;
