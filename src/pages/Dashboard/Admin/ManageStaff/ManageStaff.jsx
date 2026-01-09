import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useForm } from "react-hook-form";
import useAuth from "../../../../hooks/useAuth";
import { FaPlus, FaUsers, FaUser, FaEnvelope, FaImage, FaPhone, FaMapMarkerAlt, FaLock, FaTrash, FaPen, FaTimes, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const ManageStaff = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const { data: staffs = [], isLoading, refetch } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/staff/staffs`);
      return res.data;
    },
  });

  const staffModal = useRef(null);
  const handleOpenModal = () => staffModal.current?.showModal();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const {
        name,
        email,
        password,
        photoURL = "",
        phone = "",
        address = "",
      } = data;

      const payload = {
        name,
        email,
        photoURL,
        phone,
        address,
        role: "staff",
        password,
      };

      await axiosSecure.post("/users/add-staff", payload);
      toast.success("Staff member added successfully!");
      refetch();
      reset();
      staffModal.current?.close();
      queryClient.invalidateQueries(["staffs"]);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add staff member.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <ManageStaffSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Our Team</h1>
           <p className="text-gray-500 text-sm">Manage staff members and their roles.</p>
        </div>
        <button onClick={handleOpenModal} className="btn btn-primary shadow-lg shadow-primary/30">
           <FaPlus className="mr-2" /> Add Staff Member
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
         {staffs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 text-4xl">
                  <FaUsers />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-2">No staff members found</h3>
               <p className="text-gray-500 max-w-sm mx-auto mb-8">Start building your team by adding your first staff member.</p>
               <button onClick={handleOpenModal} className="btn btn-outline btn-primary">Add Staff Member</button>
            </div>
         ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="table w-full">
                     <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                           <th className="py-4 pl-6">#</th>
                           <th className="py-4">Staff Member</th>
                           <th className="py-4">Contact Info</th>
                           <th className="py-4 text-center">Role</th>
                           <th className="py-4 pr-6 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {staffs.map((staff, index) => (
                           <tr key={staff._id} className="hover:bg-slate-50/50 transition-colors group">
                              <th className="pl-6 text-slate-400 font-normal">{index + 1}</th>
                              <td>
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border border-slate-100 overflow-hidden shadow-sm shrink-0">
                                       <img src={staff.photoURL || "https://i.ibb.co/7CQVJNm/default-avatar.png"} alt={staff.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                       <div className="font-bold text-gray-900">{staff.name}</div>
                                       <div className="text-xs text-gray-400">ID: {staff._id.slice(-4)}</div>
                                    </div>
                                 </div>
                              </td>
                              <td>
                                 <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                       <FaEnvelope className="text-gray-400 text-xs" />
                                       <span>{staff.email}</span>
                                    </div>
                                    {staff.phone && (
                                       <div className="flex items-center gap-2 text-xs text-gray-500">
                                          <FaPhone className="text-gray-400 text-xs" />
                                          <span>{staff.phone}</span>
                                       </div>
                                    )}
                                 </div>
                              </td>
                              <td className="text-center">
                                 <div className="badge badge-primary badge-outline gap-1 font-medium bg-primary/5 border-primary/20">
                                    <FaShieldAlt className="text-xs" /> {staff.role || "Staff"}
                                 </div>
                              </td>
                              <td className="text-right pr-6">
                                 <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button className="btn btn-sm btn-circle btn-ghost text-brand-slate hover:bg-slate-100" title="Edit">
                                       <FaPen size={12} />
                                    </button>
                                    <button className="btn btn-sm btn-circle btn-ghost text-red-500 hover:bg-red-50" title="Remove">
                                       <FaTrash size={12} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </div>

      <dialog ref={staffModal} className="modal modal-bottom sm:modal-middle bg-slate-900/20 backdrop-blur-sm">
        <div className="modal-box bg-white p-0 rounded-3xl shadow-2xl overflow-hidden max-w-lg">
          <div className="relative bg-brand-slate px-8 py-6">
             <button 
                onClick={() => staffModal.current?.close()} 
                className="absolute top-4 right-4 btn btn-circle btn-sm btn-ghost text-white/50 hover:text-white hover:bg-white/10"
             >
                <FaTimes />
             </button>
             <h3 className="text-xl font-bold text-white mb-1">Add New Staff</h3>
             <p className="text-brand-emerald text-sm">Fill in the details to create a staff account.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-4">
            <div className="form-control">
               <div className="relative">
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    className="input input-bordered w-full pl-10 bg-slate-50 border-slate-200 focus:border-brand-emerald focus:ring-0"
                    placeholder="Full Name"
                  />
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
               </div>
               {errors.name && <span className="text-error text-xs mt-1">Name is required</span>}
            </div>

            <div className="form-control">
               <div className="relative">
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    className="input input-bordered w-full pl-10 bg-slate-50 border-slate-200 focus:border-brand-emerald focus:ring-0"
                    placeholder="Email Address"
                  />
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
               </div>
               {errors.email && <span className="text-error text-xs mt-1">Email is required</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="form-control relative">
                  <input
                    {...register("phone")}
                    type="text"
                    className="input input-bordered w-full pl-10 bg-slate-50 border-slate-200 focus:border-brand-emerald focus:ring-0"
                    placeholder="Phone"
                  />
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
               </div>
               <div className="form-control relative">
                  <input
                    {...register("address")}
                    type="text"
                    className="input input-bordered w-full pl-10 bg-slate-50 border-slate-200 focus:border-brand-emerald focus:ring-0"
                    placeholder="City/Address"
                  />
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
               </div>
            </div>

            <div className="form-control">
               <div className="relative">
                  <input
                    {...register("photoURL")}
                    type="url"
                    className="input input-bordered w-full pl-10 bg-slate-50 border-slate-200 focus:border-brand-emerald focus:ring-0"
                    placeholder="Photo URL (Optional)"
                  />
                  <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
               </div>
            </div>

            <div className="form-control">
               <div className="relative">
                  <input
                    {...register("password", { required: true, minLength: 6 })}
                    type="password"
                    className="input input-bordered w-full pl-10 bg-slate-50 border-slate-200 focus:border-brand-emerald focus:ring-0"
                    placeholder="Password (min 6 chars)"
                  />
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
               </div>
               {errors.password && <span className="text-error text-xs mt-1">Password must be at least 6 characters</span>}
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                className="btn btn-ghost flex-1 text-gray-500"
                onClick={() => {
                  reset();
                  staffModal.current?.close();
                }}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1 shadow-lg shadow-brand-emerald/20"
                disabled={submitting}
              >
                {submitting ? <span className="loading loading-spinner loading-sm"></span> : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

const ManageStaffSkeleton = () => (
   <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-10 flex justify-between items-center animate-pulse">
         <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded"></div>
            <div className="h-4 w-64 bg-slate-200 rounded"></div>
         </div>
         <div className="h-10 w-40 bg-slate-200 rounded-lg"></div>
      </div>
      
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4">
             <div className="h-6 w-8 bg-slate-200 rounded"></div>
             <div className="h-6 w-32 bg-slate-200 rounded"></div>
             <div className="h-6 w-48 bg-slate-200 rounded"></div>
             <div className="h-6 w-20 bg-slate-200 rounded ml-auto"></div>
         </div>
         <div className="divide-y divide-slate-100">
             {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-4 flex items-center gap-6 animate-pulse">
                   <div className="h-4 w-4 bg-slate-100 rounded"></div>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                      <div className="space-y-2">
                         <div className="h-4 w-32 bg-slate-200 rounded"></div>
                         <div className="h-3 w-16 bg-slate-100 rounded"></div>
                      </div>
                   </div>
                   <div className="space-y-2 flex-1">
                       <div className="h-3 w-48 bg-slate-100 rounded"></div>
                       <div className="h-3 w-32 bg-slate-100 rounded"></div>
                   </div>
                   <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                   <div className="flex gap-2 ml-auto">
                       <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                       <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                   </div>
                </div>
             ))}
         </div>
      </div>
   </div>
);

export default ManageStaff;
