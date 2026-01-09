import React, { useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";
import { toast } from "react-toastify";
import { FaUsers, FaSearch, FaBan, FaCheckCircle, FaAngleLeft, FaAngleRight } from "react-icons/fa";

const ManageCitizens = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { data: citizens = [], isLoading, refetch } = useQuery({
    queryKey: ["citizens", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const handleIsBlock = async (citizen) => {
    try {
        const res = await axiosSecure.patch(`/users/${citizen._id}/isBlocked`, {
            isBlcoked: !citizen.isBlcoked,
        });

        if (res.data.modifiedCount) {
            toast.success(`User ${citizen.isBlcoked ? "Unblocked" : "Blocked"} Successfully`);
            refetch();
        }
    } catch (error) {
        toast.error("Failed to update user status");
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCitizens = citizens.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(citizens.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <ManageCitizensSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Registered Citizens</h1>
           <p className="text-gray-500 text-sm">Monitor and manage citizen accounts.</p>
        </div>
        <div className="badge badge-primary badge-lg p-4 font-semibold shadow-sm">
           <FaUsers className="mr-2" /> Total: {citizens.length}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {citizens.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 text-4xl">
                  <FaSearch />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-2">No citizens found</h3>
               <p className="text-gray-500 max-w-sm mx-auto">There are no registered citizens in the system yet.</p>
           </div>
        ) : (
           <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                              <th className="py-4 pl-6">#</th>
                              <th className="py-4">User Info</th>
                              <th className="py-4">Email</th>
                              <th className="py-4 text-center">Status</th>
                              <th className="py-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {currentCitizens.map((citizen, index) => (
                              <tr key={citizen._id} className="hover:bg-slate-50/50 transition-colors">
                                  <th className="pl-6 text-slate-400 font-normal">{(currentPage - 1) * itemsPerPage + index + 1}</th>
                                  <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                          <div className="mask mask-squircle w-10 h-10 bg-slate-100">
                                              <img src={citizen.photoURL || "https://i.ibb.co/7CQVJNm/default-avatar.png"} alt={citizen.name} />
                                          </div>
                                        </div>
                                        <div>
                                          <div className="font-bold text-gray-900">{citizen.name}</div>
                                          <div className="text-xs text-gray-400">Citizen</div>
                                        </div>
                                    </div>
                                  </td>
                                  <td className="text-gray-600 font-medium">{citizen.email}</td>
                                  <td className="text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        citizen.isBlcoked 
                                          ? 'bg-red-50 text-red-600' 
                                          : 'bg-green-50 text-green-600'
                                    }`}>
                                        {citizen.isBlcoked ? (
                                          <><FaBan className="mr-1" /> Blocked</>
                                        ) : (
                                          <><FaCheckCircle className="mr-1" /> Active</>
                                        )}
                                    </span>
                                  </td>
                                  <td className="text-right pr-6">
                                    <button
                                      onClick={() => handleIsBlock(citizen)}
                                      className={`btn btn-sm btn-ghost ${
                                        citizen.isBlcoked 
                                          ? "text-green-600 hover:bg-green-50 hover:text-green-700" 
                                          : "text-red-500 hover:bg-red-50 hover:text-red-600"
                                      }`}
                                    >
                                      {citizen.isBlcoked ? "Unblock" : "Block"}
                                    </button>
                                  </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                  </div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                 <div className="flex justify-center items-center gap-2">
                    <button 
                       className="btn btn-sm btn-circle bg-white border-slate-200 hover:bg-slate-50 text-slate-500 disabled:bg-slate-50 disabled:text-slate-300"
                       onClick={() => handlePageChange(currentPage - 1)}
                       disabled={currentPage === 1}
                    >
                       <FaAngleLeft />
                    </button>
                    
                    <div className="flex gap-1 hidden sm:flex">
                       {[...Array(totalPages)].map((_, i) => (
                          <button
                             key={i + 1}
                             className={`btn btn-sm btn-circle ${
                                currentPage === i + 1 
                                   ? "bg-primary text-white border-primary hover:bg-primary" 
                                   : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                             }`}
                             onClick={() => handlePageChange(i + 1)}
                          >
                             {i + 1}
                          </button>
                       ))}
                    </div>
                    {/* Mobile simplified pagination */}
                    <div className="sm:hidden flex items-center px-3 font-medium text-gray-600 bg-white rounded-full border border-slate-200 h-8 text-sm">
                       Page {currentPage} of {totalPages}
                    </div>

                    <button 
                       className="btn btn-sm btn-circle bg-white border-slate-200 hover:bg-slate-50 text-slate-500 disabled:bg-slate-50 disabled:text-slate-300"
                       onClick={() => handlePageChange(currentPage + 1)}
                       disabled={currentPage === totalPages}
                    >
                       <FaAngleRight />
                    </button>
                 </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
};

const ManageCitizensSkeleton = () => (
   <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-10 flex justify-between items-center animate-pulse">
         <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded"></div>
            <div className="h-4 w-64 bg-slate-200 rounded"></div>
         </div>
         <div className="h-10 w-32 bg-slate-200 rounded-2xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b border-slate-100 bg-slate-50">
             <div className="flex gap-4">
                 <div className="h-6 w-10 bg-slate-200 rounded"></div>
                 <div className="h-6 w-32 bg-slate-200 rounded"></div>
                 <div className="h-6 w-40 bg-slate-200 rounded"></div>
                 <div className="h-6 w-20 bg-slate-200 rounded ml-auto"></div>
             </div>
         </div>
         <div className="divide-y divide-slate-100">
             {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                   <div className="h-4 w-4 bg-slate-100 rounded"></div>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
                      <div className="space-y-2">
                         <div className="h-4 w-32 bg-slate-200 rounded"></div>
                         <div className="h-3 w-20 bg-slate-100 rounded"></div>
                      </div>
                   </div>
                   <div className="h-4 w-48 bg-slate-100 rounded ml-8"></div>
                   <div className="h-6 w-16 bg-slate-100 rounded-full ml-auto"></div>
                   <div className="h-8 w-20 bg-slate-200 rounded ml-4"></div>
                </div>
             ))}
         </div>
      </div>
   </div>
);

export default ManageCitizens;
