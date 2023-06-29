import React, { useEffect, useState } from "react";
import useFetchTodos from "../hooks/fetchTodos";

const StatusFilter = ({ reset, setReset, setTodos }) => {
  const { todos } = useFetchTodos();

  // useEffect(() => {
  //   if (reset) {
  //     setTodos(todos);
  //   }
  // }, [reset]);

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
    setReset(false);
  };

  const buttonClassName =
    "w-fit px-4 sm:px-12 py-1 sm:py-2 text-white font-medium text-sm sm:text-base duration-300 hover:opacity-40 rounded-md";
  const fontSizeTaskCount = "0.8em";
  return (
    <div
      className="flex items-stretch items-center space-x-2 mb-4 justify-between"
      style={{ marginBottom: "-0.5rem" }}
    >
      <button
        onClick={() => handleStatusFilter("pending")}
        style={{ backgroundColor: getStatusColor("pending") }}
        className={buttonClassName}
      >
        Pending
        <br />{" "}
        <span style={{ fontSize: fontSizeTaskCount }}>
          {statusCount["pending"]} tasks
        </span>
      </button>
      <button
        onClick={() => handleStatusFilter("in progress")}
        style={{ backgroundColor: getStatusColor("in progress") }}
        className={buttonClassName}
      >
        In Progress
        <br />{" "}
        <span style={{ fontSize: fontSizeTaskCount }}>
          {statusCount["in progress"]} tasks
        </span>
      </button>
      <button
        onClick={() => handleStatusFilter("completed")}
        style={{ backgroundColor: getStatusColor("completed") }}
        className={buttonClassName}
      >
        Completed
        <br />{" "}
        <span style={{ fontSize: fontSizeTaskCount }}>
          {statusCount["completed"]} tasks
        </span>
      </button>
    </div>
  );
};

export default StatusFilter;
