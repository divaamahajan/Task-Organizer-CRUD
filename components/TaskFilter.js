import React, { useState, useEffect } from "react";
import useFetchTodos from "../hooks/fetchTodos";

export default function TaskFilter({ reset, setReset, setTodos }) {
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { todos } = useFetchTodos();

  useEffect(() => {
    if (reset) {
      setSearchText("");
      setEndDate("");
      setStartDate("");
      // setTodos(todos);
    }
  }, [reset]);
  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
    setReset(false);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setReset(false);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setReset(false);
  };

  const filterTasks = () => {
    let filteredTodos = { ...todos };

    if (searchText) {
      filteredTodos = Object.fromEntries(
        Object.entries(filteredTodos).filter(
          ([key, value]) =>
            value.title.toLowerCase().includes(searchText.toLowerCase()) ||
            value.description.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    if (startDate && !endDate) {
      filteredTodos = Object.fromEntries(
        Object.entries(filteredTodos).filter(
          ([key, value]) => new Date(value.date) >= new Date(startDate)
        )
      );
    }

    if (!startDate && endDate) {
      filteredTodos = Object.fromEntries(
        Object.entries(filteredTodos).filter(
          ([key, value]) => new Date(value.date) <= new Date(endDate)
        )
      );
    }

    if (startDate && endDate) {
      filteredTodos = Object.fromEntries(
        Object.entries(filteredTodos).filter(
          ([key, value]) =>
            new Date(value.date) >= new Date(startDate) &&
            new Date(value.date) <= new Date(endDate)
        )
      );
    }

    setTodos(filteredTodos);
    setReset(false);
  };

  const inputStyle =
    "outline-none p-2 text-sm text-slate-900 border rounded-md ";
  const labelStyle = "text-sm font-medium text-white-700";
  

  return (
    <div className="border rounded-md p-3 border-slate-500 ">
      <div className="flex flex-col ">
        <label htmlFor="search" className={labelStyle}>
          Search Title/Description
        </label>
        <input
          type="text"
          placeholder="Search Task"
          value={searchText}
          onChange={handleSearchTextChange}
          className={inputStyle}
        />
      </div>
      <div
        className="flex items-stretch items-center justify-between"
        // style={{ marginTop: "-0.7rem" }}
      >
        <div className="flex flex-col">
          <label htmlFor="search" className={labelStyle}>
            Search Due Date from
          </label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className={inputStyle}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="search" className={labelStyle}>
            Search Due Date to
          </label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className={inputStyle}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="search" className="text-transparent">
            Search
          </label>
          <button
            onClick={filterTasks}
            // className="outline-none p-3 text-base sm:text-lg text-slate-900 flex-1 border rounded-md mr-2"
            // className="outline-none p-3 flex-1 border  mr-2"
            style={{ backgroundColor: "#0FA958" }}
            className="text-white duration-300 flex-1 hover:opacity-40 rounded-md w-fit px-2 sm:px-3 font-medium text-sm sm:text-base "
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
