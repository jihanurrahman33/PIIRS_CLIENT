import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useForm } from "react-hook-form";
import useAuth from "../../../../hooks/useAuth";

const ManageStaff = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const { data: staffs = [], refetch } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/staff/staffs`);
      return res.data;
    },
  });

  const staffModal = useRef(null);
  const handleOpenModal = () => staffModal.current?.showModal();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const {
        name,
        email,
        password,
        photoURL = "",
        phone = "",
        address = "",
      } = data;

      const payload = {
        name,
        email,
        photoURL,
        phone,
        address,
        role: "staff",
        password,
      };

      await axiosSecure.post("/users/add-staff", payload);
      refetch();
      reset();
      staffModal.current?.close();
      queryClient.invalidateQueries(["staffs"]);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Manage Staff: {staffs.length}</h2>
        <button onClick={handleOpenModal} className="btn btn-primary">
          Add Staff
        </button>
      </div>

      <dialog ref={staffModal} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center mb-2">Add A Staff</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              {...register("name", { required: true })}
              type="text"
              className="input w-full"
              placeholder="Staff Name"
            />
            <input
              {...register("email", { required: true })}
              type="email"
              className="input w-full"
              placeholder="Staff Email"
            />
            <input
              {...register("photoURL")}
              type="text"
              className="input w-full"
              placeholder="Photo URL"
            />
            <input
              {...register("phone")}
              type="text"
              className="input w-full"
              placeholder="Phone Number"
            />
            <input
              {...register("address")}
              type="text"
              className="input w-full"
              placeholder="Staff Address"
            />
            <input
              {...register("password", { required: true, minLength: 6 })}
              type="password"
              className="input w-full"
              placeholder="Staff Password (min 6 chars)"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={submitting}
              >
                {submitting ? "Adding..." : "Add as Staff"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  reset();
                  staffModal.current?.close();
                }}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <div className="overflow-x-auto mt-4">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((staff, index) => (
              <tr key={staff._id}>
                <th>{index + 1}</th>
                <td>{staff.name}</td>
                <td>{staff.email}</td>
                <td>{staff.department ?? "-"}</td>
                <td className="flex gap-2">
                  <button className="btn btn-sm btn-error">Remove Staff</button>
                  <button className="btn btn-sm btn-primary">Edit</button>
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
