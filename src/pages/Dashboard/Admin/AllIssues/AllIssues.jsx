import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import { FaUserPlus, FaTimesCircle, FaCheckCircle, FaExclamationTriangle, FaClock } from "react-icons/fa";

const AllIssues = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: issues = [], isLoading, refetch } = useQuery({
    queryKey: ["issues", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues/all/admin");
      return res.data;
    },
  });

  const [staffs, setStaffs] = useState([]);
  const staffAssign = useRef(null);
  const selectedStaffRef = useRef(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [assigningId, setAssigningId] = useState(null);

  const handleAssignStaff = (issue) => {
    setSelectedIssue(issue);
    axiosSecure.get(`/users/staff/staffs`).then((res) => {
      setStaffs(res.data);
    });
    staffAssign.current?.showModal();
  };

  const handleAssign = async () => {
    const selectedStaffEmail = selectedStaffRef.current?.value;
    if (!selectedIssue || !selectedStaffEmail) return;

    const issueId = selectedIssue._id;
    setAssigningId(issueId);

    // optimistic update
    const previous = queryClient.getQueryData(["issues"]) || [];
    queryClient.setQueryData(["issues"], (old = []) =>
      old.map((it) =>
        it._id === issueId
          ? {
              ...it,
              status: "staff-assigned",
              assignedStaff: { email: selectedStaffEmail },
            }
          : it
      )
    );

    try {
      const res = await axiosSecure.post(`/issues/${issueId}/assign`, {
        staffEmail: selectedStaffEmail,
      });

      const returnedIssue = res.data?.issue;
      if (returnedIssue) {
        queryClient.setQueryData(["issues"], (old = []) =>
          old.map((it) => (it._id === issueId ? returnedIssue : it))
        );
      } else {
        queryClient.invalidateQueries(["issues"]);
      }

      staffAssign.current?.close();
      refetch();
    } catch (err) {
      queryClient.setQueryData(["issues"], previous);
      console.error("Assign failed:", err);
    } finally {
      setAssigningId(null);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High": return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><FaExclamationTriangle className="mr-1"/> High</span>;
      case "Medium": return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><FaClock className="mr-1"/> Medium</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Low</span>;
    }
  };

  const getStatusBadge = (status) => {
     switch (status) {
      case "resolved": return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><FaCheckCircle className="mr-1"/> Resolved</span>;
      case "staff-assigned": return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Assigned</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pending</span>;
    }
  };

  if (isLoading) {
    return <AllIssuesSkeleton />;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Issue Management</h2>
          <p className="text-gray-500 mt-1">Oversee and assign reported issues.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm mt-4 md:mt-0">
            <span className="text-sm font-medium text-gray-500">Total Issues:</span>
            <span className="ml-2 text-lg font-bold text-primary">{issues.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">#</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {issues.map((issue, index) => (
                <tr key={issue._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 block mb-0.5">{issue.title}</span>
                      <span className="text-xs text-gray-400">ID: {issue._id.slice(-6)}</span>
                  </td>
                  <td className="px-6 py-4">{getPriorityBadge(issue.priority)}</td>
                  <td className="px-6 py-4">{getStatusBadge(issue.status)}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {issue.status === "pending" && (
                      <button
                        onClick={() => handleAssignStaff(issue)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                        disabled={assigningId === issue._id}
                      >
                         {assigningId === issue._id ? "..." : <><FaUserPlus className="mr-1.5"/> Assign</>}
                      </button>
                    )}

                     <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100">
                        <FaTimesCircle className="mr-1.5"/> Reject
                    </button>
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                  <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                          No issues found.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <dialog
        ref={staffAssign}
        className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
      >
        <div className="modal-box bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-xl text-gray-900 mb-1">Assign Staff</h3>
          <p className="text-sm text-gray-500 mb-6">Select a qualified staff member to handle this issue.</p>

          <div className="form-control w-full">
            <label className="label">
                <span className="label-text font-medium text-gray-700">Staff Member</span>
            </label>
            <select
                ref={selectedStaffRef}
                defaultValue=""
                className="select select-bordered w-full bg-gray-50 focus:bg-white transition-colors"
            >
                <option value="" disabled>Select a Staff...</option>
                {staffs.map((staff) => (
                <option key={staff._id} value={staff.email}>
                    {staff.name ? `${staff.name} (${staff.email})` : staff.email}
                </option>
                ))}
            </select>
          </div>

          <div className="flex gap-3 mt-8">
            <form method="dialog" className="flex-1">
                <button className="btn btn-ghost w-full hover:bg-gray-100 text-gray-600 font-normal">Cancel</button>
            </form>
             <button
                onClick={handleAssign}
                className="btn btn-primary flex-1 shadow-lg shadow-primary/30 text-white"
            >
                Confirm Assignment
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

const AllIssuesSkeleton = () => {
    return (
        <div className="p-6 bg-slate-50 min-h-screen">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-pulse">
            <div>
               <div className="h-8 w-48 bg-slate-200 rounded mb-2"></div>
               <div className="h-4 w-64 bg-slate-200 rounded"></div>
            </div>
            <div className="h-10 w-32 bg-slate-200 rounded-lg mt-4 md:mt-0"></div>
          </div>
    
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
               <div className="flex gap-4 p-4 border-b border-gray-100 bg-gray-50">
                   <div className="h-4 w-10 bg-slate-200 rounded"></div>
                   <div className="h-4 w-32 bg-slate-200 rounded"></div>
                   <div className="h-4 w-24 bg-slate-200 rounded"></div>
                   <div className="h-4 w-24 bg-slate-200 rounded"></div>
                   <div className="h-4 w-24 bg-slate-200 rounded ml-auto"></div>
               </div>
               <div className="divide-y divide-gray-100">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                     <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                        <div className="h-4 w-6 bg-slate-100 rounded"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-48 bg-slate-200 rounded"></div>
                            <div className="h-3 w-32 bg-slate-100 rounded"></div>
                        </div>
                        <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
                        <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
                        <div className="h-8 w-32 bg-slate-200 rounded ml-auto"></div>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
    );
};

export default AllIssues;
