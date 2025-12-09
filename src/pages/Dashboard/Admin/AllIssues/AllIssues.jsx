import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const AllIssues = () => {
  const axiosSecure = useAxiosSecure();
  const { data: issues = [] } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues");
      return res.data;
    },
  });
  console.log(issues);
  return (
    <div>
      <h2 className="text-2xl">All Issues: {issues.length}</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
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
                  <button className="btn btn-primary">Assign Staff</button>
                  <button className="btn btn-error ms-2 text-white">
                    Delete Issue
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllIssues;
