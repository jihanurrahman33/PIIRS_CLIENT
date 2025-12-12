import React from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";
import { toast } from "react-toastify";

const ManageCitizens = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: citizens = [], refetch } = useQuery({
    queryKey: ["citizens", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const handleIsBlock = async (citizen) => {
    const res = await axiosSecure.patch(`/users/${citizen._id}/isBlocked`, {
      isBlcoked: true,
    });

    if (res.data.modifiedCount) {
      toast?.success("User Blocked");
      refetch();
    }
  };
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
              <th>User Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {citizens.map((citizen, index) => (
              <tr key={citizen._id}>
                <th>{index + 1}</th>
                <td>{citizen.name}</td>
                <td>{citizen.email}</td>
                <td className={`${citizen.isBlcoked ? "text-red-600" : null}`}>
                  {citizen.isBlcoked ? "blocked" : "Normal"}
                </td>
                <td>
                  <button
                    disabled={citizen.isBlcoked}
                    onClick={() => handleIsBlock(citizen)}
                    className={`btn ${
                      citizen.isBlcoked ? "btn-error" : "bg-red-600 text-white"
                    } `}
                  >
                    {citizen.isBlcoked ? "Blocked" : "Block"}
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

export default ManageCitizens;
