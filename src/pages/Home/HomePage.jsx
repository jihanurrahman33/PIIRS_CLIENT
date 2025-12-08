import React from "react";
import Banner from "./Banner";
import LatestResolvedIssues from "./LatestResolvedIssues";
import FeaturesSection from "./FeaturesSection";
import HowItWorks from "./HowItWorks";
import ExtraSection from "./ExtraSection";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <LatestResolvedIssues />
      <FeaturesSection />
      <HowItWorks />
      <ExtraSection />
    </div>
  );
};

export default HomePage;
