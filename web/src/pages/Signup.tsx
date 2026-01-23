import { useState } from "react";
import { TextField } from "../components/form/TextField";
import { Button } from "../components/form/Button";
import { useLoginMutation, useSignupMutation } from "../api";
import { useUser } from "../hooks/useUser";
import * as style from "./Signup.css";

export const Signup = () => {
  const { login: auth } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signup] = useSignupMutation(["id", "email", "admin"]);
  const signupAndRedirect = async () => {
    const user = await signup({ email, password });
    auth(user);
  };

  const [login] = useLoginMutation(["id", "email", "admin"]);
  const loginAndRedirect = async () => {
    const user = await login({ email, password });
    auth(user);
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
