import { useState } from "react";
import { TextField } from "../components/form/TextField";
import { Button } from "../components/form/Button";
import { useLoginMutation, useSignupMutation } from "../api";
import * as style from "./Signup.css";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signup] = useSignupMutation(["id"]);
  const signupAndRedirect = async () => {
    await signup({ email, password });
    window.location.reload();
  };

  const [login] = useLoginMutation(["id"]);
  const loginAndRedirect = async () => {
    await login({ email, password });
    window.location.reload();
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

      <div className={style.actions}>
        <Button onClick={signupAndRedirect}>Sign up</Button>
        <Button onClick={loginAndRedirect}>Log in</Button>
      </div>
    </form>
  );
};
