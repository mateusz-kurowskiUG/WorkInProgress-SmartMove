"use client";

import React from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

interface AutoCompleteItem {
  description: string;
  mainText: string;
  placeId: string;
  reference: string;
  secondaryText: string;
}

export default function SearchBar() {
  const [search, setSearch] = React.useState("");
  const [autocomplete, setAutocomplete] = React.useState<
    AutoCompleteItem[] | null
  >(null);

  const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    console.log(e.target.value);
    setAutocomplete(null);
    setSearch("");
  };

  const fetchAutocomplete = async (search: string): Promise<void> => {
    const response = await axios.get(
      "http://localhost:5000/api/maps/autocomplete?input=" + search,
    );
    setAutocomplete(response.data);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.value.length < 3) {
      setAutocomplete(null);
    }
    setSearch(e.target.value);
    if (e.target.value.length > 2) {
      fetchAutocomplete(e.target.value);
    }
  };

  return (
    <div>
      <form className="">
        <div className="relative">
          <input
            className="input input-primary"
            value={search}
            onChange={(e) => handleOnChange(e)}
          />
          <button type="submit" className="btn btn-ghost absolute right-0">
            <FaSearch />
          </button>
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
                    value={item.description}
                    onChange={(e) => handleSubmit(e)}
                  />
                  <label className="btn btn-primary" htmlFor={item.placeId}>
                    {item.description}
                  </label>
                </div>
              );
            })}
        </div>
      </form>
    </div>
  );
}
