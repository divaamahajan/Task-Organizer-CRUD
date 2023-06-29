import React, { useState } from "react";
import useFetchTodos from "../hooks/fetchTodos";

export default function TaskFilter({ tasks, setTodos }) {
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { todos } = useFetchTodos();

  // const statusCount = {};
  // Object.values(todos).forEach((task) => {
  //   if (statusCount[task.status]) {
  //     statusCount[task.status] += 1;
  //   } else {
  //     statusCount[task.status] = 1;
  //   }
  // });

  const statusCount = todos
    ? Object.values(todos).reduce((count, task) => {
        count[task.status] = (count[task.status] || 0) + 1;
        return count;
      }, {})
    : {};

  const getStatusColor = (status) => {
    if (status == "pending") return "#E2B93BCC";
    else if (status == "in progress") return "#2F80ED";
    else if (status == "completed") return "#0FA958";
  };

  const handleStatusFilter = (status) => {
    if (!status) {
      setTodos(todos);
      return;
    }
    let filteredTodos = { ...todos };

    filteredTodos = Object.fromEntries(
      Object.entries(filteredTodos).filter(
        ([key, value]) => value.status === status
      )
    );
    setTodos(filteredTodos);
  };

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
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
  };

  const resetHandler = () => {
    setTodos(todos); // Reset todos to the original list
  };

  return (
    <>
      <div
        className="flex  items-stretch items-center space-x-2 mb-4 justify-between"
        style={{ marginBottom: "-0.5rem" }}
      >
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="search"
            className="text-sm font-medium text-white-700"
          >
            Filter Title/Description
          </label>
          <input
            type="text"
            placeholder="Search Task"
            value={searchText}
            onChange={handleSearchTextChange}
            className="outline-none text-slate-900 border rounded-md p-2 text-sm sm:text-base   mr-2"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="search"
            className="text-sm font-medium text-white-700"
          >
            Filter Due Date from
          </label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="outline-none p-2 text-sm sm:text-base text-slate-900  border rounded-md mr-2"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="search"
            className="text-sm font-medium text-white-700"
          >
            Filter Due Date to
          </label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="outline-none p-2 text-sm sm:text-base text-slate-900 border rounded-md mr-2"
          />
        </div>
      </div>
      <div className="flex items-stretch items-center space-x-2 mb-4 justify-between">
        <button
          onClick={filterTasks}
          style={{ backgroundColor: "#0FA958" }}
          className="text-white duration-300 hover:opacity-40 rounded-md w-fit px-2 sm:px-3 font-medium text-sm sm:text-base "
        >
          Apply Filters
        </button>
        <button
          onClick={resetHandler}
          style={{ backgroundColor: "#0FA958" }}
          // className="w-fit px-2 sm:px-3 py-1 sm:py-2 text-white font-medium text-sm sm:text-base duration-300 hover:opacity-40 rounded-md"
          className="text-white duration-300 hover:opacity-40 rounded-md w-fit px-2 sm:px-3 font-medium text-sm sm:text-base "
        >
          Reset Filters
        </button>
      </div>
      <div
        className="flex  items-stretch items-center space-x-2 mb-4 justify-between"
        style={{ marginBottom: "-0.5rem" }}
      >
        <button
          onClick={() => handleStatusFilter("pending")}
          style={{ backgroundColor: getStatusColor("pending") }}
          // className="text-white duration-300 hover:opacity-40 rounded-md w-fit px-2 sm:px-3 font-medium text-sm sm:text-base "
          className="w-fit px-2 sm:px-10 py-1 sm:py-2 text-white font-medium text-sm sm:text-base duration-300 hover:opacity-40 rounded-md"
        >
          Pending
          <br />{" "}
          <span style={{ fontSize: "0.8em" }}>
            {statusCount["pending"]} tasks
          </span>
        </button>
        <button
          onClick={() => handleStatusFilter("in progress")}
          style={{ backgroundColor: getStatusColor("in progress") }}
          // className="text-white duration-300 hover:opacity-40 rounded-md w-fit px-2 sm:px-3 font-medium text-sm sm:text-base "
          className="w-fit px-2 sm:px-10 py-1 sm:py-2 text-white font-medium text-sm sm:text-base duration-300 hover:opacity-40 rounded-md"
        >
          In Progress
          <br />{" "}
          <span style={{ fontSize: "0.8em" }}>
            {statusCount["in progress"]} tasks
          </span>
        </button>
        <button
          onClick={() => handleStatusFilter("completed")}
          style={{ backgroundColor: getStatusColor("completed") }}
          className="w-fit px-2 sm:px-10 py-1 sm:py-2 text-white font-medium text-sm sm:text-base duration-300 hover:opacity-40 rounded-md"
          // className="w-fit text-white font-medium px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base duration-300 hover:opacity-40 rounded-md"
        >
          Completed
          <br />{" "}
          <span style={{ fontSize: "0.8em" }}>
            {statusCount["completed"]} tasks
          </span>
        </button>
      </div>
    </>
  );
}
