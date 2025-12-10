import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

const AllIssues = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: issues = [], refetch } = useQuery({
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

    // optimistic update: set issue status locally so button disappears immediately
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

      // reconcile with server response if returned issue exists
      const returnedIssue = res.data?.issue;
      if (returnedIssue) {
        queryClient.setQueryData(["issues"], (old = []) =>
          old.map((it) => (it._id === issueId ? returnedIssue : it))
        );
      } else {
        // if server didn't return full issue, at least invalidate to get canonical data
        queryClient.invalidateQueries(["issues"]);
      }

      staffAssign.current?.close();
      refetch();
    } catch (err) {
      // rollback on error
      queryClient.setQueryData(["issues"], previous);
      console.error("Assign failed:", err);
      // show toast / message if you want
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl">All Issues: {issues.length}</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, index) => (
              <tr key={issue._id}>
                <th>{index + 1}</th>
                <td>{issue.title}</td>
                <td>{issue.priority}</td>
                <td>{issue.status}</td>

                <td>
                  {issue.status === "pending" && (
                    <button
                      onClick={() => handleAssignStaff(issue)}
                      className="btn btn-primary"
                      disabled={assigningId === issue._id}
                    >
                      {assigningId === issue._id
                        ? "Assigning..."
                        : "Assign Staff"}
                    </button>
                  )}

                  {/* Optionally show something else when assigned */}
                  {issue.status !== "pending" && (
                    <span className="badge badge-success">
                      {issue.status === "staff-assigned"
                        ? "Assigned"
                        : issue.status}
                    </span>
                  )}

                  <button className="btn btn-error ms-2 text-white">
                    Reject Issue
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <dialog
          ref={staffAssign}
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">Assign Staff</h3>

            <select
              ref={selectedStaffRef}
              defaultValue=""
              className="select w-full my-4"
            >
              <option value="" disabled>
                Select a Staff
              </option>
              {staffs.map((staff) => (
                <option key={staff._id} value={staff.email}>
                  {staff.name ? `${staff.name} — ${staff.email}` : staff.email}
                </option>
              ))}
            </select>

            <button
              onClick={handleAssign}
              className="btn btn-primary w-full mt-4"
            >
              Assign
            </button>

            <div className="modal-action w-full">
              <form method="dialog" className="w-full">
                <button className="btn w-full btn-error text-white">
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default AllIssues;
