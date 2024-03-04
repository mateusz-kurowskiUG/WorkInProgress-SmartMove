"use client";

import React, { useState } from "react";
import SearchBar from "./SearchBar";

interface AddRouteProps {
  no: number;
  incrementNo: React.Dispatch<React.SetStateAction<number>>;
  index: number;
}

export default function AddRoute({ no, incrementNo, index }: AddRouteProps) {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const addRoute = () => {
    setIsButtonClicked(true);
    incrementNo((prev) => prev + 1);
  };

  return (
    <>
      {isButtonClicked ? (
        <>
          <li className="step">
            <SearchBar
              defaultSearchFields={[
                {
                  name: `Stacja ${index}`,
                  value: "",
                },
              ]}
            />
          </li>
          <AddRoute no={no} incrementNo={incrementNo} index={index + 1} />
        </>
      ) : (
        <li className="step">
          <button type="button" onClick={addRoute} className="btn btn-circle">
            +
          </button>
        </li>
      )}
    </>
  );
  // return (
  //   <li className="step">
  //     {isButtonClicked ? (
  //       <SearchBar
  //         defaultSearchFields={[
  //           {
  //             name: `${no}`,
  //             value: "",
  //           },
  //         ]}
  //       />
  //     ) : (
  //       <button type="button" onClick={addRoute} className="btn btn-circle">
  //         +
  //       </button>
  //     )}
  //   </li>
  // );
}
