import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AssignedIssues = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { data: assignedIssues = [], refetch } = useQuery({
    queryKey: ["assignedIssues", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/${user?.email}/assinedTask`);
      return res.data;
    },
  });

  const [loadingId, setLoadingId] = useState(null);

  const handleOnSelect = async (e, issue) => {
    const value = e.target.value;

    // optimistic UI behaviour (optional)
    setLoadingId(issue._id);
    try {
      // call your endpoint to update issue status
      const res = await axiosSecure.patch(`/issues/${issue._id}/status`, {
        status: value,
      });

      console.log(res.data);
      // refresh assigned issues list
      refetch();
    } catch (err) {
      console.error("Status update failed:", err);
      // optional: toast error
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl">Assigned Issues: {assignedIssues.length}</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Priority</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {assignedIssues.map((issue, index) => (
              <tr key={issue._id}>
                <th>{index + 1}</th>
                <td>{issue.title}</td>
                <td>{issue.priority}</td>
                <td>{issue.location}</td>
                <td>
                  <select
                    onChange={(e) => handleOnSelect(e, issue)}
                    defaultValue={issue.status || ""}
                    className="select"
                  >
                    <option value="" disabled>
                      Change Status
                    </option>
                    <option value="in-progress">in-progress</option>
                    <option value="working">working</option>
                    <option value="resolved">resolved</option>
                    <option value="closed">closed</option>
                  </select>

                  {loadingId === issue._id && (
                    <span className="ml-2 text-sm">Updating...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedIssues;
