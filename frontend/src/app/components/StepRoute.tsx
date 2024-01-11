import React from "react";
import styles from "./StepRoute.module.css";

export default function StepRoute() {
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
        <li className="step">Stacja 1</li>
        <li className="step">Stacja 2</li>
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
