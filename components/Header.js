import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [openModal, setOpenModal] = useState(false);
  const { logout, currentUser } = useAuth();
  let user = "User";
  if (currentUser.displayName) {
    user = currentUser.displayName;
  }
  return (
    <>
      {openModal && <Modal setOpenModal={setOpenModal} />}
      <div className="sticky top-0 w-full left-0 bg-inherit flex items-center justify-between p-4 border-b border-solid border-white">
        <h1 className="text-3xl select-none sm:text-6xl">
          <img
            src="./logo.png"
            alt="TaskiFy Logo"
            // className="w-12 h-12 mr-2"
          />
          {/* TaskiFy */}
        </h1>
        <i
          //   onClick={() => setOpenModal(true)}
          onClick={() => {
            logout();
          }}
          className="fa-solid fa-right-from-bracket text-xl duration-300 hover:opacity-40 cursor-pointer sm:text-3xl"
          //   className="fa-solid fa-user text-xl duration-300 hover:opacity-40 cursor-pointer sm:text-3xl"
        ></i>
      </div>
      <h1 className="text-1xl select-none sm:text-2xl items-center">
        Welcome {user}!
      </h1>
    </>
  );
}
