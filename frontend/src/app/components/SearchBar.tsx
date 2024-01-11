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

  const [currentlySelected, setCurrentlySelected] = React.useState<number>(0);
  const [autocomplete, setAutocomplete] = React.useState<
    AutoCompleteItem[] | null
  >(null);

  const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    fetchLocationByName(e.target.value, routeContext.setPoints);
    console.log(routeContext.points);
  };
  const fetchLocationByName = async (
    location: string,
    setPoints: React.Dispatch<
      React.SetStateAction<
        { name: String; latlng: google.maps.LatLng }[] | null
      >
    >
  ) => {
    const response = await axios.get(
      "http://localhost:5000/api/maps/search?input=" + location
    );
    console.log(response.data);
    setPoints((prevPoints) => {
      if (prevPoints === null) {
        return [
          {
            name: defaultSearchFields[0].name,
            latlng: response.data.results[0].geometry.location,
          },
        ];
      }

      const newPoints = [...prevPoints];
      console.log("New points: ", newPoints);
      if (
        newPoints.filter((item) => item.name === defaultSearchFields[0].name)
          .length > 0
      ) {
        const index = newPoints.findIndex(
          (item) => item.name === defaultSearchFields[0].name
        );
        console.log("Index: ", index);
        newPoints[index].latlng = response.data.results[0].geometry.location;
      } else
        newPoints.push({
          name: defaultSearchFields[0].name,
          latlng: response.data.results[0].geometry.location,
        });
      return newPoints;
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
      <form className="flex items-center gap-4">
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
                          handleSubmit(e);
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
      </form>
    </div>
  );
}
