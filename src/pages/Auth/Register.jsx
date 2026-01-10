import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import GoogleLogin from "./GoogleLogin";
import { FaUser, FaEnvelope, FaLock, FaLink, FaArrowRight, FaTrophy, FaMedal, FaStar } from "react-icons/fa";

const Register = () => {
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const axiosInstance = useAxios();
  const { registerUser, updateUserProfile } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setAuthError("");
    const { name, email, password, photoURL } = data;

    try {
      const res = await registerUser(email, password);
      const firebaseUser = res.user;

      await updateUserProfile({ displayName: name, photoURL });
      const idToken = await firebaseUser.getIdToken(true);

      const payload = { name, photoURL };
      await axiosInstance.post("/users", payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      navigate(from, { replace: true });
    } catch (err) {
      console.error("Registration error:", err);
      setAuthError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Column: Contextual App Preview (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-center bg-emerald-50 relative overflow-hidden p-12">
         <div className="absolute inset-0 pattern-grid-lg opacity-5 text-brand-emerald"></div>
         
         <div className="relative z-10 max-w-lg mx-auto w-full">
            <div className="mb-8">
               <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                  Make your voice <br/><span className="text-brand-emerald">count</span>.
               </h1>
               <p className="text-lg text-slate-500">
                  Join a community of proactive citizens. Report issues, earn badges, and help build a better neighborhood.
               </p>
            </div>

            {/* "Citizen Impact" Widget Mock */}
            <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-500">
               <div className="bg-brand-emerald p-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <FaUser className="text-sm" />
                     </div>
                     <span className="font-bold">Citizen Profile</span>
                  </div>
                  <div className="badge bg-white/20 border-none text-white text-xs font-bold">LEVEL 3</div>
               </div>
               
               <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <div className="text-3xl font-black text-slate-900">12</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Issues Reported</div>
                     </div>
                     <div className="text-right">
                        <div className="text-3xl font-black text-brand-emerald">450</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Impact Points</div>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                           <FaTrophy />
                        </div>
                        <div>
                           <div className="text-sm font-bold text-slate-900">Top Reporter</div>
                           <div className="text-xs text-slate-500">This Month</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                           <FaMedal />
                        </div>
                        <div>
                           <div className="text-sm font-bold text-slate-900">Neighborhood Hero</div>
                           <div className="text-xs text-slate-500">5 Issues Fixed</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 lg:px-24 bg-white relative">
         <div className="w-full max-w-lg space-y-6">
            <div className="text-center lg:text-left">
               <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-2xl font-black mb-8">
                  <span className="text-brand-emerald">P</span>
                  <span className="text-slate-900">IIRS</span>
               </Link>
               <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create an account</h2>
               <p className="text-gray-500 mt-2">Enter your details to get started.</p>
            </div>

            <div className="space-y-6">
               <GoogleLogin />
               
               <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <div className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Or register with email</div>
                  <div className="flex-grow border-t border-slate-200"></div>
               </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               {authError && (
                  <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl">
                     {authError}
                  </div>
               )}

               <div className="form-control">
                  <label className="label">
                     <span className="label-text font-bold text-gray-700">Full Name</span>
                  </label>
                  <div className="relative">
                     <div className="absolute left-3 top-3.5 text-gray-400"><FaUser /></div>
                     <input
                        type="text"
                        placeholder="John Doe"
                        className={`input input-bordered w-full pl-10 bg-slate-50 focus:bg-white transition-colors ${errors.name ? "input-error" : ""}`}
                        {...register("name", { required: "Name is required", minLength: { value: 3, message: "Min 3 chars" } })}
                     />
                  </div>
                  {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>}
               </div>

               <div className="form-control">
                  <label className="label">
                     <span className="label-text font-bold text-gray-700">Email Address</span>
                  </label>
                  <div className="relative">
                     <div className="absolute left-3 top-3.5 text-gray-400"><FaEnvelope /></div>
                     <input
                        type="email"
                        placeholder="name@example.com"
                        className={`input input-bordered w-full pl-10 bg-slate-50 focus:bg-white transition-colors ${errors.email ? "input-error" : ""}`}
                        {...register("email", { 
                           required: "Email is required", 
                           pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } 
                        })}
                     />
                  </div>
                  {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email.message}</span>}
               </div>

               <div className="form-control">
                  <label className="label">
                     <span className="label-text font-bold text-gray-700">Photo URL</span>
                  </label>
                  <div className="relative">
                     <div className="absolute left-3 top-3.5 text-gray-400"><FaLink /></div>
                     <input
                        type="url"
                        placeholder="https://..."
                        className={`input input-bordered w-full pl-10 bg-slate-50 focus:bg-white transition-colors ${errors.photoURL ? "input-error" : ""}`}
                        {...register("photoURL", { required: "Photo URL is required" })}
                     />
                  </div>
                  {errors.photoURL && <span className="text-xs text-red-500 mt-1">{errors.photoURL.message}</span>}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                     <label className="label">
                        <span className="label-text font-bold text-gray-700">Password</span>
                     </label>
                     <div className="relative">
                        <div className="absolute left-3 top-3.5 text-gray-400"><FaLock /></div>
                        <input
                           type="password"
                           placeholder="••••••••"
                           className={`input input-bordered w-full pl-10 bg-slate-50 focus:bg-white transition-colors ${errors.password ? "input-error" : ""}`}
                           {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 chars" } })}
                        />
                     </div>
                     {errors.password && <span className="text-xs text-red-500 mt-1">{errors.password.message}</span>}
                  </div>

                  <div className="form-control">
                     <label className="label">
                        <span className="label-text font-bold text-gray-700">Confirm</span>
                     </label>
                     <div className="relative">
                        <div className="absolute left-3 top-3.5 text-gray-400"><FaLock /></div>
                        <input
                           type="password"
                           placeholder="••••••••"
                           className={`input input-bordered w-full pl-10 bg-slate-50 focus:bg-white transition-colors ${errors.confirmPassword ? "input-error" : ""}`}
                           {...register("confirmPassword", { 
                              required: "Required", 
                              validate: (val) => val === password || "Mismatch" 
                           })}
                        />
                     </div>
                     {errors.confirmPassword && <span className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</span>}
                  </div>
               </div>

               <div className="form-control">
                  <label className="cursor-pointer flex items-start gap-3 mt-2">
                     <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm mt-0.5"
                        {...register("terms", { required: "You must accept terms" })}
                     />
                     <span className="label-text text-sm text-gray-500 leading-tight">
                        I agree to the <span className="text-brand-emerald font-semibold">Terms of Service</span> and <span className="text-brand-emerald font-semibold">Privacy Policy</span>.
                     </span>
                  </label>
                  {errors.terms && <span className="text-xs text-red-500 mt-1">{errors.terms.message}</span>}
               </div>

               <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full h-12 text-base font-bold shadow-lg shadow-brand-emerald/20 mt-4"
               >
                  {isSubmitting ? <span className="loading loading-spinner"></span> : "Create Account"}
                  {!isSubmitting && <FaArrowRight className="ml-2" />}
               </button>
            </form>

            <div className="text-center text-sm text-gray-500">
               Already have an account?{" "}
               <Link to="/login" className="font-bold text-brand-emerald hover:text-emerald-700 transition-colors">
                  Sign in
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Register;
