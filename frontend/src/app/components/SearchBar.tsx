"use client";

import Input from "@/components/Input";
import { Form, Formik } from "formik";
import React from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const handleSubmit = (values): void => {
    console.log(values);
  };

  return (
    <div>
      <Formik
        initialValues={{
          place: "",
        }}
        onSubmit={handleSubmit}
      >
        <Form className="flex">
          <Input type="text" name="place" placeholder="Search" />
          <button type="submit" className="btn rounded-bl-none rounded-br-none">
            <FaSearch />
          </button>
        </Form>
      </Formik>
    </div>
  );
}
