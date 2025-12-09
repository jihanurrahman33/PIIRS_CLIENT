import React from "react";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const AssignedIssues = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: assignedIssues = [] } = useQuery({
    queryKey: ["assignedIssues", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/${user?.email}/assinedTask`);
      return res.data;
    },
  });
  console.log(assignedIssues);
  return (
    <div>
      <h2 className="text-2xl">Assigned Issues: {assignedIssues.length}</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
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
                  <select defaultValue={issue.status} className="select">
                    <option disabled={true}>Change Status</option>
                    <option>in-progress</option>
                    <option>working</option>
                    <option>resolved</option>
                    <option>closed</option>
                  </select>
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
