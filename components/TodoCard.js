import React, { useState } from "react";
import DateCard from "./DateCard";
export default function TodoCard(props) {
  const {
    children,
    edit,
    setEdit,
    handleEdit,
    edittedValue,
    setEdittedValue,
    todoKey,
    handleSaveEdit,
    handleDelete,
  } = props;
  const { id, title, date, description, status } = todoKey;
  const getStatusColor = (status) => {
    if (status == "pending") return "#E2B93BCC";
    else if (status == "in progress") return "#2F80ED";
    else if (status == "completed") return "#0FA958";
  };
  const handleStatusChange = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setEdittedValue({ ...edittedValue, status: "completed" });
    } else if (new Date(edittedValue.date) < new Date()) {
      setEdittedValue({ ...edittedValue, status: "pending" });
    } else {
      setEdittedValue({ ...edittedValue, status: "in progress" });
    }
  };

  const handleCancel = () => {
    setEdit(null);
  };
  return (
    <div className="p-2 relative sm:p-3 border flex items-stretch border-white border-solid">
      <div className="flex-1 flex">
        {!(edit === id) ? (
          <>
            <p
              className="flex items-center"
              style={{
                fontSize: "1.2rem",
                textDecoration:
                  status === "completed" ? "line-through" : "none",
                textDecorationThickness: "2px",
                textDecorationColor: "currentColor",
              }}
            >
              <DateCard date={date} />
            </p>
            <div>
              <div style={{ textAlign: "center", padding: "0 20px" }}>
                <p
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <strong
                    style={{
                      fontSize: "1.2rem",
                      textDecoration:
                        status === "completed" ? "line-through" : "none",
                      textDecorationThickness: "2px",
                      textDecorationColor: "currentColor",
                    }}
                  >
                    {title}
                  </strong>{" "}
                  <span
                    style={{
                      backgroundColor: getStatusColor(status),
                      padding: "2px 6px",
                      borderRadius: "4px",
                      marginLeft: "20px",
                      minWidth: "80px",
                      display: "inline-block",
                    }}
                  >
                    {status}
                  </span>
                </p>
              </div>
              <div style={{ textAlign: "justify", padding: "0 20px" }}>
                <p>{description}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center">
            <div>
              <input
                type="date"
                value={edittedValue.date}
                onChange={(e) =>
                  setEdittedValue({ ...edittedValue, date: e.target.value })
                }
                className="custom-calendar-input bg-inherit flex-1 text-white outline-none "
              />

              <br />
              <label>
                <input
                  type="checkbox"
                  checked={edittedValue.status === "completed"}
                  onChange={handleStatusChange}
                />{" "}
                Completed
              </label>
              <br />
            </div>
            <div style={{ textAlign: "center", padding: "0 20px" }}>
              <div>
                <input
                  className="bg-inherit flex-1 text-white outline-none"
                  value={edittedValue.title}
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    paddingBottom: "5px",
                    alignItems: "center",
                    whiteSpace: "pre-wrap",
                    outline: "1px solid gray",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                  onChange={(e) =>
                    setEdittedValue({ ...edittedValue, title: e.target.value })
                  }
                />
              </div>
              <div>
                <textarea
                  className="bg-inherit flex-1 text-white outline-none"
                  value={edittedValue.description}
                  onChange={(e) =>
                    setEdittedValue({
                      ...edittedValue,
                      description: e.target.value,
                    })
                  }
                  style={{
                    height: "100px",
                    width: "300px",
                    whiteSpace: "pre-wrap",
                    outline: "1px solid gray",
                    padding: "10px",
                  }}
                />

                <br />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center">
        {edit === id ? (
          <>
            <i
              onClick={handleSaveEdit}
              className="fa-solid fa-check px-2 duration-300 hover:scale-125 cursor-pointer"
            ></i>
            <i
              onClick={handleCancel}
              className="fa-solid fa-xmark px-2 duration-300 hover:scale-125 cursor-pointer"
            ></i>
          </>
        ) : (
          <>
            <i
              onClick={handleEdit(id)}
              className="fa-solid fa-pencil px-2 duration-300 hover:rotate-45 cursor-pointer"
            ></i>
            <i
              onClick={handleDelete(id)}
              className="fa-solid fa-trash-can px-2 duration-300 hover:scale-125 cursor-pointer"
            ></i>
          </>
        )}
      </div>
    </div>
  );
}
