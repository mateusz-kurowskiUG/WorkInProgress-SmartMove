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

export default function SearchBar({
  defaultSearchFields,
}: {
  defaultSearchFields: { name: string; value: string }[];
}) {
  const routeContext = useRouteContext();
  const [search, setSearch] = React.useState(defaultSearchFields);
  const [searchEnd, setSearchEnd] = React.useState("");

  const [currentlySelected, setCurrentlySelected] = React.useState<number>(0);
  const [autocomplete, setAutocomplete] = React.useState<
    AutoCompleteItem[] | null
  >(null);

  const handleSubmit = (
    e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLFormElement>
  ): void => {
    e.preventDefault();
    routeContext.setPoints(null);
    search.forEach((item) => {
      fetchLocationByName(item.value, routeContext.setPoints);
    });
  };
  const fetchLocationByName = async (
    location: string,
    setPoints: (
      value: React.SetStateAction<google.maps.LatLng[] | null>
    ) => void
  ) => {
    const response = await axios.get(
      "http://localhost:5000/api/maps/search?input=" + location
    );
    console.log(response.data);
    setPoints((prevPoints) => {
      if (prevPoints === null) {
        return [response.data.results[0].geometry.location];
      } else {
        return [...prevPoints, response.data.results[0].geometry.location];
      }
    });
  };
  const fetchAutocomplete = async (search: string): Promise<void> => {
    const response = await axios.get(
      "http://localhost:5000/api/maps/autocomplete?input=" + search
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
    id: number
  ): void => {
    e.preventDefault();
    setCurrentlySelected(id);
    console.log(e.target.value);
    handleAutoComplete(e.target.value);
  };

  return (
    <div>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex items-center gap-4"
      >
        <div className="flex flex-col gap-2">
          {search.map((item, index) => {
            return (
              <div key={index}>
                <input
                  className="input input-primary"
                  placeholder={"test"}
                  value={search[index].value}
                  onChange={(e) => {
                    setSearch((prevSearch) => {
                      const newSearch = [...prevSearch];
                      newSearch[index].value = e.target.value;
                      return newSearch;
                    });
                    handleOnChange(e, index);
                  }}
                />
                {autocomplete !== null &&
                  currentlySelected === index &&
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
                          setSearch((prevSearch) => {
                            const newSearch = [...prevSearch];
                            newSearch[index].value = e.target.value;
                            return newSearch;
                          });
                        }}
                      />
                      <label className="btn btn-outline" htmlFor={item.placeId}>
                        {item.description}
                      </label>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>

        <div>
          <input className="btn btn-primary" type="submit" value="Search" />
        </div>
      </form>
    </div>
  );
}
