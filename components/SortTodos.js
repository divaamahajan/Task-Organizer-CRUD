import React, { useState, useEffect } from "react";
import useFetchTodos from "../hooks/fetchTodos";

function SortTodos({ reset, setReset, tasks, setSortedTodo }) {
  const [sortBy, setSortBy] = useState("");
  const { todos } = useFetchTodos();

  useEffect(() => {
    if (reset) {
      setSortBy("");
      if (todos) {
        const todoList = Object.entries(todos).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setSortedTodo(todoList.reverse());
      }
    }
  }, [reset]);

  function sortByTitle() {
    const todosArray = Object.entries(tasks).map(([key, value]) => ({
      id: key,
      ...value,
    }));
    const sortedTodos = todosArray.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setSortedTodo(sortedTodos);
  }

  function sortByDescription() {
    const todosArray = Object.entries(tasks).map(([key, value]) => ({
      id: key,
      ...value,
    }));
    const sortedTodos = todosArray.sort((a, b) =>
      a.description.localeCompare(b.description)
    );
    setSortedTodo(sortedTodos);
  }

  function sortByDate() {
    const todosArray = Object.entries(tasks).map(([key, value]) => ({
      id: key,
      ...value,
    }));
    const sortedTodos = todosArray.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setSortedTodo(sortedTodos);
  }

  function sortByStatus() {
    const todosArray = Object.entries(tasks).map(([key, value]) => ({
      id: key,
      ...value,
    }));
    const sortedTodos = todosArray.sort((a, b) =>
      a.status.localeCompare(b.status)
    );
    setSortedTodo(sortedTodos);
  }

  const handleSortChange = (event) => {
    const selectedSort = event.target.value;
    setReset(false);
    setSortBy(selectedSort);
    if (selectedSort === "title") {
      sortByTitle();
    }
    if (selectedSort === "description") {
      sortByDescription();
    }
    if (selectedSort === "dueDate") {
      sortByDate();
    }
    if (selectedSort === "status") {
      sortByStatus();
    }
  };

  return (
    <div>
      <label htmlFor="sort">Sort By:</label>
      <select
        id="sort"
        value={sortBy}
        onChange={handleSortChange}
        className=" p-1 text-base sm:text-lg text-slate-900 flex-1 mr-2"
      >
        <option value="">Select...</option>
        <option value="title">Title</option>
        <option value="description">Description</option>
        <option value="dueDate">Due Date</option>
        <option value="status">Status</option>
      </select>
    </div>
  );
}

export default SortTodos;
