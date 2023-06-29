import React, { useState, useEffect } from "react";

export default function TodoInput(props) {
  const {
    title,
    setTitle,
    date,
    setDate,
    description,
    setDescription,
    reset,
    setReset,
    handleCreateTodo,
  } = props;

  useEffect(() => {
    if (reset) {
      setTitle("");
      setDate("");
      setDescription("");
    }
  }, [reset]);
  return (
    <div className="flex items-stretch items-center space-x-2 mb-4 justify-between">
      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setReset(false);
        }}
        className="outline-none p-3 text-base sm:text-lg text-slate-900 flex-1 border rounded-md mr-2 w-1/2"
      />
      <input
        type="text"
        placeholder="Enter Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setReset(false);
        }}
        className="outline-none p-3 text-base sm:text-lg text-slate-900 flex-1 border rounded-md mr-2 w-1/2"
      />
      <input
        type="date"
        placeholder="Enter Date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          setReset(false);
        }}
        className="outline-none p-3 text-base sm:text-lg text-slate-900 flex-1 border rounded-md mr-2"
      />
      <button
        onClick={handleCreateTodo}
        style={{ backgroundColor: "#0FA958" }}
        // className="w-fit px-4 sm:px-6 py-2 sm:py-3 bg-amber-400 text-white font-medium text-base duration-300 hover:opacity-40 rounded-md"
        className="w-fit px-4 sm:px-6 py-2 sm:py-3  text-white font-medium text-base duration-300 hover:opacity-40 rounded-md"
      >
        Create Task
      </button>
    </div>
  );
}
