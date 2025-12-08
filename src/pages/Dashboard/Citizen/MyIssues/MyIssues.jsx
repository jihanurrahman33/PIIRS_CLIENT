import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

const MyIssues = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { data: myIssues = [] } = useQuery({
    queryKey: ["my-issues", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/my-issues");
      return res.data;
    },
  });
  console.log(myIssues);
  return (
    <div>
      <h2 className="text-2xl">My Issues: {myIssues.length}</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myIssues.map((issue, index) => (
              <tr>
                <th>{index + 1}</th>
                <td>{issue.title}</td>
                <td>{issue.status}</td>
                <td>
                  <button className="btn btn-primary">Edit</button>
                  <button className="btn bg-red-600 text-white ms-2">
                    Delete
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

export default MyIssues;
