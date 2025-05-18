import React from "react";
import { createBoard } from "@wixc3/react-board";
import { AuthForm } from "../../../components/auth/auth-form";

export default createBoard({
  name: "AuthForm",
  Board: () => <AuthForm />,
});
