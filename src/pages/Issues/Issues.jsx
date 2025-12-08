import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import IssueCard from "../../components/IssueCard/IssueCard";
import { useNavigate } from "react-router";

const Issues = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: issues = [] } = useQuery({
    queryKey: ["issues", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues");
      return res.data;
    },
  });
  return (
    <div className="p-4">
      <h2 className="text-2xl">All Issues: {issues.length}</h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {issues.map((issue) => (
          <IssueCard
            onUpvote={() => console.log(issue)}
            onView={() => navigate(`/issue-details/${issue._id}`)}
            issue={issue}
            key={issue._id}
          ></IssueCard>
        ))}
      </div>
    </div>
  );
};

export default Issues;
