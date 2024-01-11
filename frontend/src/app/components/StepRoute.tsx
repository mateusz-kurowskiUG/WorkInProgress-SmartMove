import React, { useState } from "react";
import styles from "./StepRoute.module.css";
import SearchBar from "./SearchBar";
import AddRoute from "./AddRoute";

export default function StepRoute() {
  const [generatedRoutesCount, setGenerateRoutesCount] = useState(1);

  return (
    <div>
      <ul className="steps steps-vertical">
        <li data-content="⬇️" className="step step-primary">
          Początek
        </li>
        {/* <li
          data-content="🛴"
          className={`step step-accent ${styles["brand-station"]}`}
        >
          Stacja Tier
        </li> */}
        <li
          data-content="🚲"
          className={`step step-accent ${styles["brand-station"]}`}
        >
          Stacja Mevo
        </li>
        <AddRoute
          no={generatedRoutesCount}
          incrementNo={setGenerateRoutesCount}
        />
        {/* <li key={generatedRoutesCount} className="step"></li> */}
        <li data-content="🚲" className={`step`}>
          Stacja Mevo
        </li>
        <li data-content="🏁" className="step">
          Cel podróży
        </li>
      </ul>
    </div>
  );
}
