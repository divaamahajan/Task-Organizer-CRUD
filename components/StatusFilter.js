import React, { useState } from "react";
import useFetchTodos from "../hooks/fetchTodos";

const StatusFilter = ({ setTodos }) => {
  const { todos } = useFetchTodos();
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

  return (
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
  );
};

export default StatusFilter;
