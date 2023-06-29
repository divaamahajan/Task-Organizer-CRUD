import React, { useState, useEffect } from "react";
import useFetchTodos from "../hooks/fetchTodos";

export default function TaskFilter({ reset, setReset, setTodos }) {
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { todos } = useFetchTodos();

  useEffect(() => {
    if (reset) {
      setSearchText("")
      setEndDate("")
      setStartDate("")
      // setTodos(todos);
    }
  }, [reset]);
  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
    setReset(false)
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setReset(false)
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setReset(false)
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
    setReset(false)
  };

  const inputStyle = "outline-none p-2 text-sm text-slate-900 border rounded-md w-44";
  const labelStyle = "text-sm font-medium text-white-700";

  return (
    <>
      <div
        className="flex items-stretch items-center  justify-between"
        style={{ marginBottom: "-0.5rem" }}
      >
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
      </div>

      <div className="flex items-stretch items-center space-x-2 mb-4 justify-between">
        <button
          onClick={filterTasks}
          style={{ backgroundColor: "#0FA958" }}
          className="text-white duration-300 hover:opacity-40 rounded-md w-fit px-2 sm:px-3 font-medium text-sm sm:text-base "
        >
          Search
        </button>
        {/* <button
          onClick={resetHandler}
          style={{ backgroundColor: "#0FA958" }}
          // className="w-fit px-2 sm:px-3 py-1 sm:py-2 text-white font-medium text-sm sm:text-base duration-300 hover:opacity-40 rounded-md"
          className="text-white duration-300 hover:opacity-40 rounded-md w-fit px-2 sm:px-3 font-medium text-sm sm:text-base "
        >
          Reset 
        </button> */}
      </div>
    </>
  );
}
