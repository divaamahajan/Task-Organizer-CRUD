import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import TodoCard from "./TodoCard";
import { doc, setDoc, deleteField } from "firebase/firestore";
import { db } from "../firebase";
import useFetchTodos from "../hooks/fetchTodos";
import TodoInput from "./TodoInput";
import TaskFilter from "./TaskFilter";
import SortTodos from "./SortTodos";

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
  console.log("currentUser", currentUser);

  useEffect(() => {
    if (!loading) {
      const modifiedTodos = Object.values(todos).map((task) => {
        // Set the status to "pending" if the date is less than today's date
        if (task.status === "in progress" && new Date(task.date) < new Date()) {
          task.status = "pending";
        }
        return task;
      });
      console.log("modifiedTodos object", modifiedTodos);

      setTodos(modifiedTodos);

      const todoList = Object.entries(modifiedTodos).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      setTodosList(todoList);
    }
  }, [loading]);

  async function handleCreateTodo() {
    console.log("handleCreateTodo, todoS", todos); // object of to dos
    if (!title) {
      return;
    }
    const newKey =
      Object.keys(todos).length === 0 ? 1 : Math.max(...Object.keys(todos)) + 1;
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
    if (dateString < new Date()) {
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
    setTodos({ ...todos, [newKey]: newTodo });
    const userRef = doc(db, "users", currentUser.uid);
    console.log("userInfo", userInfo);
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
    if (!edittedValue) {
      return;
    }
    if (edittedValue.status != "completed") {
      if (new Date(edittedValue.date) < new Date()) {
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
    return () => {
      setEdit(todoKey);
      setEdittedValue(todos[todoKey]);
    };
  }

  function handleDelete(todoKey) {
    return async () => {
      const tempObj = { ...todos };
      delete tempObj[todoKey];

      setTodos(tempObj);
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
    };
  }
  useEffect(() => {
    if (todos) {
      const todoList = Object.entries(todos).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      setTodosList(todoList);
    }
  }, [todos]);

  return (
    <div className="w-full max-w-[65ch] text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
      <TodoInput
        title={title}
        setTitle={setTitle}
        date={date}
        setDate={setDate}
        description={description}
        setDescription={setDescription}
        handleCreateTodo={handleCreateTodo}
      />
      <TaskFilter tasks={todos} setTodos={setTodos} />
      <SortTodos tasks={todos} setSortedTodo={setTodosList} />
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
