"use client";

import React from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useRouteContext } from "@/contexts/route-context";

interface AutoCompleteItem {
  description: string;
  mainText: string;
  placeId: string;
  reference: string;
  secondaryText: string;
}

export default function SearchBar() {
  const routeContext = useRouteContext();
  const [search, setSearch] = React.useState("");
  const [autocomplete, setAutocomplete] = React.useState<
    AutoCompleteItem[] | null
  >(null);

  const handleSubmit = (
    e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLFormElement>,
    val: string | null = null,
  ): void => {
    e.preventDefault();
    if (autocomplete === null) {
      return;
    }
    if (autocomplete.length === 0) {
      return;
    }
    if (val) {
      console.log(val);
      fetchLocationByName(val);
    } else {
      console.log(autocomplete[0]);
      fetchLocationByName(autocomplete[0].description);
    }

    setAutocomplete(null);
    setSearch("");
  };
  const fetchLocationByName = async (location: string) => {
    const response = await axios.get(
      "http://localhost:5000/api/maps/search?input=" + location,
    );
    console.log(response.data);
    routeContext.setStartPoint(response.data.results[0].geometry.location);
  };
  const fetchAutocomplete = async (search: string): Promise<void> => {
    const response = await axios.get(
      "http://localhost:5000/api/maps/autocomplete?input=" + search,
    );
    setAutocomplete(response.data);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.value.length < 2) {
      setAutocomplete(null);
    }
    setSearch(e.target.value);
    if (e.target.value.length > 2) {
      fetchAutocomplete(e.target.value);
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col items-center "
      >
        <div>
          <div className="relative">
            <label htmlFor="starting-point">Start: </label>
            <input
              id="starting-point"
              className="input input-primary"
              value={search}
              onChange={(e) => handleOnChange(e)}
            />
            {/* <button type="submit" className="btn btn-ghost absolute right-0"> */}
            {/*   <FaSearch /> */}
            {/* </button> */}
          </div>
          <div className="">
            {autocomplete !== null &&
              autocomplete.map((item) => {
                return (
                  <div key={item.placeId}>
                    <input
                      type="radio"
                      id={item.placeId}
                      name="location"
                      value={item.mainText}
                      onChange={(e) => {
                        handleSubmit(e, e.target.value);
                      }}
                    />
                    <label className="btn btn-primary" htmlFor={item.placeId}>
                      {item.description}
                    </label>
                  </div>
                );
              })}
          </div>
        </div>
        <div>
          <label htmlFor="end-point">End: </label>
          <input
            id="end-point"
            className="input input-primary"
            value={search}
            onChange={(e) => handleOnChange(e)}
          />
          <div className="">
            {autocomplete !== null &&
              autocomplete.map((item) => {
                return (
                  <div key={item.placeId}>
                    <input
                      type="radio"
                      id={item.placeId}
                      name="location"
                      value={item.mainText}
                      onChange={(e) => {
                        handleSubmit(e, e.target.value);
                      }}
                    />
                    <label className="btn btn-primary" htmlFor={item.placeId}>
                      {item.description}
                    </label>
                  </div>
                );
              })}
          </div>
        </div>
        <div>
          <button type="submit" className="btn btn-primary ">
            Find route <FaSearch />
          </button>
        </div>
      </form>
    </div>
  );
}
