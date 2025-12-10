import React from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";

const ManageCitizens = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: citizens = [] } = useQuery({
    queryKey: ["citizens", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });
  return (
    <div>
      <h2 className="text-2xl">Manage Citizens: {citizens.length}</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {citizens.map((citizen, index) => (
              <tr key={citizen._id}>
                <th>{index + 1}</th>
                <td>{citizen.name}</td>
                <td>{citizen.email}</td>
                <td>
                  <button className="btn bg-red-600 text-white">Block</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCitizens;
