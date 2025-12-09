import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const ManageStaff = () => {
  const axiosSecure = useAxiosSecure();

  const { data: staffs = [] } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const role = "staff";
      const res = await axiosSecure.get(`/users/${role}/staffs`);
      return res.data;
    },
  });
  console.log(staffs);
  return (
    <div>
      <h2 className="text-2xl">Manage Staff: {staffs.length}</h2>
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
            {staffs.map((staff, index) => (
              <tr key={staff._id}>
                <th>{index + 1}</th>
                <td>{staff.name}</td>
                <td>{staff.email}</td>
                <td>
                  <button className="btn btn-primary">Remove Staff</button>
                  <button className="ms-2 btn btn-primary">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStaff;
