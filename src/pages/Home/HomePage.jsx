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
      <section id="features">
        <FeaturesSection />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <ExtraSection />
    </div>
  );
};

export default HomePage;
