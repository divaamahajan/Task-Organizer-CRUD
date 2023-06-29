import React, { useState } from "react";

function SortTodos({ tasks, setSortedTodo }) {
  const [sortBy, setSortBy] = useState("");

  function sortByTitle() {
    console.log("tasks title in sort", tasks);
    const todosArray = Object.entries(tasks).map(([key, value]) => ({
      id: key,
      ...value,
    }));
    const sortedTodos = todosArray.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setSortedTodo(sortedTodos);
    console.log("sortedTodos", sortedTodos);
  }

  function sortByDescription() {
    console.log("tasks description in sort", tasks);
    const todosArray = Object.entries(tasks).map(([key, value]) => ({
      id: key,
      ...value,
    }));
    const sortedTodos = todosArray.sort((a, b) =>
      a.description.localeCompare(b.description)
    );
    setSortedTodo(sortedTodos);
    console.log("sortedTodos", sortedTodos);
  }

  function sortByDate() {
    console.log("tasks date in sort", tasks);
    const todosArray = Object.entries(tasks).map(([key, value]) => ({
      id: key,
      ...value,
    }));
    const sortedTodos = todosArray.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setSortedTodo(sortedTodos);
    console.log("sortedTodos", sortedTodos);
  }

  function sortByStatus() {
    console.log("tasks date in sort", tasks);
    const todosArray = Object.entries(tasks).map(([key, value]) => ({
      id: key,
      ...value,
    }));
    const sortedTodos = todosArray.sort((a, b) =>
      a.status.localeCompare(b.status)
    );
    setSortedTodo(sortedTodos);
    console.log("sortedTodos", sortedTodos);
  }

  const handleSortChange = (event) => {
    const selectedSort = event.target.value;
    setSortBy(selectedSort);
    console.log("selected Sort", selectedSort);

    if (selectedSort === "title") {
      console.log("title selected", selectedSort);
      sortByTitle();
    }
    if (selectedSort === "description") {
      console.log("description selected", selectedSort);
      sortByDescription();
    }
    if (selectedSort === "dueDate") {
      console.log("due date selected", selectedSort);
      sortByDate();
    }
    if (selectedSort === "status") {
      console.log("status selected", selectedSort);
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
