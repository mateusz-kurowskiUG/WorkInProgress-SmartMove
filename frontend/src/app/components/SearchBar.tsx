"use client";

import React, { useMemo, useRef } from "react";
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
  const [searchEnd, setSearchEnd] = React.useState("");

  const [currentlySelected, setCurrentlySelected] = React.useState<number>(0);
  const [autocomplete, setAutocomplete] = React.useState<
    AutoCompleteItem[] | null
  >(null);

  const handleSubmit = (
    e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLFormElement>,
  ): void => {
    e.preventDefault();
    fetchLocationByName(search, routeContext.setStartPoint);
    fetchLocationByName(searchEnd, routeContext.setEndPoint);
  };
  const fetchLocationByName = async (
    location: string,
    setPoint: (value: React.SetStateAction<google.maps.LatLng | null>) => void,
  ) => {
    const response = await axios.get(
      "http://localhost:5000/api/maps/search?input=" + location,
    );
    console.log(response.data);
    setPoint(response.data.results[0].geometry.location);
  };
  const fetchAutocomplete = async (search: string): Promise<void> => {
    const response = await axios.get(
      "http://localhost:5000/api/maps/autocomplete?input=" + search,
    );
    setAutocomplete(response.data);
  };

  const handleAutoComplete = (search: string) => {
    if (search.length > 2) {
      fetchAutocomplete(search);
    }
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
  ): void => {
    e.preventDefault();
    setCurrentlySelected(id);
    console.log(e.target.value);
    handleAutoComplete(e.target.value);
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <input
            className="input input-primary"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleOnChange(e, 0);
            }}
          />
          {autocomplete !== null &&
            currentlySelected === 0 &&
            autocomplete.map((item) => (
              <div key={item.placeId}>
                <input
                  hidden
                  id={item.placeId}
                  type="radio"
                  name="autocomplete"
                  value={item.description}
                  onChange={(e) => {
                    setAutocomplete(null);
                    setSearch(e.target.value);
                  }}
                />
                <label className="btn btn-outline" htmlFor={item.placeId}>
                  {item.description}
                </label>
              </div>
            ))}
        </div>
        <div>
          <input
            className="input input-primary"
            value={searchEnd}
            onChange={(e) => {
              handleOnChange(e, 1);
              setSearchEnd(e.target.value);
            }}
          />
          {autocomplete !== null &&
            currentlySelected === 1 &&
            autocomplete.map((item) => (
              <div key={item.placeId}>
                <input
                  hidden
                  id={item.placeId}
                  type="radio"
                  name="autocomplete"
                  value={item.description}
                  onChange={(e) => {
                    setAutocomplete(null);
                    setSearchEnd(e.target.value);
                  }}
                />
                <label className="btn btn-outline" htmlFor={item.placeId}>
                  {item.description}
                </label>
              </div>
            ))}
        </div>
        <div>
          <input className="btn btn-primary" type="submit" value="Search" />
        </div>
      </form>
    </div>
  );
}
