import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import TodoCard from "./TodoCard";
import { doc, setDoc, deleteField } from "firebase/firestore";
import { db } from "../firebase";
import useFetchTodos from "../hooks/fetchTodos";
import TodoInput from "./TodoInput";
import TaskFilter from "./TaskFilter";
import SortTodos from "./SortTodos";
import StatusFilter from "./StatusFilter";

export default function UserDashboard() {
  const { userInfo, currentUser } = useAuth();
  const [edit, setEdit] = useState(null);
  // const [todo, setTodo] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [edittedValue, setEdittedValue] = useState("");
  const [todoList, setTodosList] = useState([]);
  const { todos, setTodos, loading, error } = useFetchTodos();
  const [clearAll, setClearAll] = useState(false);
  // console.log("currentUser", currentUser);

  useEffect(() => {
    console.log("first use effect todos", todos);
    if (!loading) {
      const modifiedTodos = Object.values(todos).map((task) => {
        // Set the status to "pending" if the date is less than today's date
        if (task.status === "in progress" && new Date(task.date) < new Date()) {
          task.status = "pending";
        }
        return task;
      });
      const todoList = Object.entries(modifiedTodos).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      setTodosList(todoList.reverse());
      setTodos(modifiedTodos);
    }
  }, [loading]);

  // Function to handle the reset functionality
  const handleReset = () => {
    setClearAll(true);
  };

  async function handleCreateTodo() {
    if (!title) {
      return;
    }
    const newKey =
      Object.keys(todos).length === 0 ? 1 : Math.max(...Object.keys(todos)) + 1;
    console.log("newKey", newKey);
    let statusVal = "";
    let dateVal = date;
    let dateString = new Date();
    if (!dateVal) {
      const year = dateString.getFullYear();
      const month = String(dateString.getMonth() + 1).padStart(2, "0");
      const day = String(dateString.getDate()).padStart(2, "0");
      dateVal = `${year}-${month}-${day}`;
    } else {
      const time = dateString.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      dateString = new Date(`${dateVal}T${time}`);
    }
    if (dateString.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
      statusVal = "pending";
    } else {
      statusVal = "in progress";
    }
    const newTodo = {
      title: title,
      description: description,
      date: dateVal,
      status: statusVal,
    };
    // console.log("handleCreateTodo, newTodo", newTodo);
    // console.log("handleCreateTodo, setTodos", { ...todos, [newKey]: newTodo });
    const modifiedTodos = { ...todos, [newKey]: newTodo };
    const todoList = Object.entries(modifiedTodos).map(([key, value]) => ({
      id: key,
      ...value,
    }));
    setTodosList(todoList.reverse());
    setTodos(modifiedTodos);
    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(
      userRef,
      {
        todos: {
          [newKey]: newTodo,
        },
      },
      { merge: true }
    );
    setTitle("");
    setDescription("");
    setDate("");
  }

  async function handleSaveEdit() {
    // setClearAll(false);

    if (!edittedValue) {
      return;
    }
    if (edittedValue.status != "completed") {
      let dateString = new Date();
      const time = dateString.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      dateString = new Date(`${edittedValue.date}T${time}`);

      if (dateString.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
        edittedValue.status = "pending";
      } else {
        edittedValue.status = "in progress";
      }
    }

    const newKey = edit;
    setTodos({ ...todos, [newKey]: edittedValue });
    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(
      userRef,
      {
        todos: {
          [newKey]: edittedValue,
        },
      },
      { merge: true }
    );
    setEdit(null);
    setEdittedValue("");
  }

  function handleEdit(todoKey) {
    setClearAll(false);
    return () => {
      setEdit(todoKey);
      setEdittedValue(todos[todoKey]);
    };
  }

  function handleDelete(todoKey) {
    return async () => {
      setClearAll(false);
      const tempObj = { ...todos };
      delete tempObj[todoKey];
      // return;
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userRef,
        {
          todos: {
            [todoKey]: deleteField(),
          },
        },
        { merge: true }
      );
      setTodos(tempObj);
      const todoList = Object.entries(tempObj).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      setTodosList(todoList.reverse());
    };
  }

  useEffect(() => {
    if (todos) {
      console.log("last use effect");
      const todoList = Object.entries(todos).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      setTodosList(todoList.reverse());
    }
  }, [todos]);

  return (
    <div className="w-full max-w-[65ch] text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
      <StatusFilter
        setTodos={setTodos}
        reset={clearAll}
        setReset={setClearAll}
      />
      <TaskFilter setTodos={setTodos} reset={clearAll} setReset={setClearAll} />
      <TodoInput
        title={title}
        setTitle={setTitle}
        date={date}
        setDate={setDate}
        description={description}
        setDescription={setDescription}
        reset={clearAll}
        setReset={setClearAll}
        handleCreateTodo={handleCreateTodo}
      />
      <SortTodos
        tasks={todos}
        setSortedTodo={setTodosList}
        reset={clearAll}
        setReset={setClearAll}
      />
      <button
        onClick={handleReset}
        style={{ backgroundColor: "#0FA958" }}
        className="text-white duration-300 hover:opacity-40 rounded-md w-fit px-2 sm:px-3 font-medium text-sm sm:text-base "
      >
        Reset
      </button>
      {loading && (
        <div className="flex-1 grid place-items-center">
          <i className="fa-solid fa-spinner animate-spin text-6xl"></i>
        </div>
      )}
      {!loading && (
        <>
          {todoList.map((todo, i) => (
            <TodoCard
              handleSaveEdit={handleSaveEdit}
              key={i}
              handleEdit={handleEdit}
              edit={edit}
              setEdit={setEdit}
              todoKey={todo}
              edittedValue={edittedValue}
              setEdittedValue={setEdittedValue}
              handleDelete={handleDelete}
            >
              {todos[todo]}
            </TodoCard>
          ))}
        </>
      )}
      {/* {!addTodo && <button onClick={() => setAddTodo(true)} className='text-cyan-300 border border-solid border-cyan-300 py-2 text-center uppercase text-lg duration-300 hover:opacity-30'>ADD TODO</button>} */}
    </div>
  );
}
