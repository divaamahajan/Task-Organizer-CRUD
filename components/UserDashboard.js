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
  const [todo, setTodo] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [edittedValue, setEdittedValue] = useState("");
  const [todosArray, setTodosArray] = useState([]);
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

      setTodo(modifiedTodos);

      const todoList = Object.entries(modifiedTodos).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      console.log("todoList inside loading", todoList);
      setTodosList(todoList);
    }
  }, [loading]);

  async function handleAddTodo() {
    if (!todo) {
      return;
    }
    const newKey =
      Object.keys(todos).length === 0 ? 1 : Math.max(...Object.keys(todos)) + 1;
    let statusVal = "";
    if (new Date(date) < new Date()) {
      statusVal = "pending";
    } else {
      statusVal = "in progress";
    }
    const newTodo = {
      title: todo,
      date: date,
      description: description,
      status: statusVal,
    };
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

  async function handleEditTodo() {
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

    console.log("userInfo", userInfo);
    console.log("currentUser", currentUser);
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

  function handleAddEdit(todoKey) {
    return () => {
      console.log("todos[todoKey]", todos[todoKey]);
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
    console.log("todos updated")
    if (todos) {
      const todoList = Object.entries(todos).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      setTodosList(todoList);
    }
  }, [todos]);
  
  console.log("todoList", todoList);

  return (
    <div className="w-full max-w-[65ch] text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
      <TodoInput
        title={title}
        setTitle={setTitle}
        date={date}
        setDate={setDate}
        description={description}
        setDescription={setDescription}
        handleAddTodo={handleAddTodo}
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
              handleEditTodo={handleEditTodo}
              key={i}
              handleAddEdit={handleAddEdit}
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
