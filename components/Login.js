import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const { login, signup, currentUser, updateName } = useAuth();
  console.log("currentUser", currentUser);

  useEffect(() => {
    if (!isLoggingIn) {
      setConfirmPassword(""); // Reset the confirm password field when switching to the registration mode
    }
  }, [isLoggingIn]);

  async function guestLoginHandler() {
    setEmail("guest@test.com");
    setPassword("123456");
    submitHandler();
  }

  async function submitHandler() {
    const currentEmail = email;
    const currentPassword = password;
    const currentFullName = fullName

    if (!currentEmail || !currentPassword) {
      setError("Please enter email and password");
      console.log("Please enter email and password");
      return;
    }

    console.log("isLoggingIn", isLoggingIn);
    if (isLoggingIn) {
      try {
        await login(currentEmail, currentPassword);
        console.log("Login");
      } catch (err) {
        setError("Incorrect email or password");
        console.log("Incorrect email or password");
      }
      return;
    }

    // Register
    console.log("This is now registration", isLoggingIn);
    if (currentPassword.length < 6) {
      setError("Password should be at least 6 characters");
      console.log(
        "Password should be at least 6 characters",
        currentPassword,
        currentPassword.length
      );
      return;
    }
    if (confirmPassword !== currentPassword) {
      setError("The password and confirm password fields do not match.");
      console.log("The password and confirm password fields do not match.");
      return;
    }
    console.log("about to signup");
    await signup(currentEmail, currentPassword, currentFullName);
  }

  return (
    <div className="flex-1 text-xs sm:text-sm flex flex-col justify-center items-center gap-2 sm:gap-4">
      <h1 className="font-extrabold select-none text-2xl sm:text-4xl uppercase">
        {isLoggingIn ? "Login" : "Register"}
      </h1>
      {error && (
        <div className="w-full max-w-[40ch] border-rose-400 border text-center border-solid text-rose-400 py-2">
          {error}
        </div>
      )}
      {isLoggingIn ? null : (
        <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Full Name"
        className="outline-none duration-300 border-b-2 border-solid border-white focus:border-cyan-300 text-slate-900 p-2 w-full max-w-[40ch]"
      />
      )}
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
        className="outline-none duration-300 border-b-2 border-solid border-white focus:border-cyan-300 text-slate-900 p-2 w-full max-w-[40ch]"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        className="outline-none text-slate-900 p-2 w-full max-w-[40ch] duration-300 border-b-2 border-solid border-white focus:border-cyan-300"
      />
      {isLoggingIn ? null : (
        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="Confirm Password"
          className="outline-none text-slate-900 p-2 w-full max-w-[40ch] duration-300 border-b-2 border-solid border-white focus:border-cyan-300"
        />
      )}

      <button
        onClick={submitHandler}
        className="w-full max-w-[40ch] border border-white border-solid uppercase py-2 duration-300 relative after:absolute after:top-0 after:right-full after:bg-white after:z-10 after:w-full after:h-full overflow-hidden hover:after:translate-x-full after:duration-300 hover:text-slate-900"
      >
        <h2 className="relative z-20">SUBMIT</h2>
      </button>
      <h2
        className="duration-300 hover:scale-110 cursor-pointer"
        onClick={() => setIsLoggingIn(!isLoggingIn)}
      >
        {!isLoggingIn ? "Login" : "Register"}
      </h2>

      <h2
        className="duration-300 hover:scale-110 cursor-pointer"
        onClick={() => guestLoginHandler()}
      >
        {"Guest Login"}
      </h2>
    </div>
  );
}
