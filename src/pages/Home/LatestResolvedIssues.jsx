import React from "react";
import IssueCard from "../../components/IssueCard/IssueCard";

const LatestResolvedIssues = () => {
  return (
    <div className="p-4">
      <section className="flex justify-between">
        <h2 className="text-2xl">Latest Resolved Issues</h2>
        <button className="btn btn-primary">View All</button>
      </section>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <IssueCard />
      </div>
    </div>
  );
};

export default LatestResolvedIssues;
