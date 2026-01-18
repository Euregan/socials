import { useState } from "react";
import { TextField } from "../components/form/TextField";
import { Button } from "../components/form/Button";
import * as style from "./Signup.css";
import { useSignupMutation } from "../api";
import { useLocation } from "wouter";

export const Signup = () => {
  const [, navigate] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signup] = useSignupMutation(["id"]);

  const signupAndRedirect = async () => {
    await signup({ email, password });
    navigate("/");
  };

  return (
    <form
      className={style.form}
      onSubmit={async (event) => {
        event.stopPropagation();
        event.preventDefault();

        await signupAndRedirect();
      }}
    >
      <TextField label="Email" type="email" value={email} onChange={setEmail} />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
      />

      <Button onClick={signupAndRedirect}>Sign up</Button>
    </form>
  );
};
