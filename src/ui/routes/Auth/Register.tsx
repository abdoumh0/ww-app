import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";

type Props = {};

export default function Register({}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const {
      email,
      password,
      confirmedPassword,
      firstName,
      lastName,
      username,
    } = Object.fromEntries(data.entries());

    console.log(
      email,
      password,
      confirmedPassword,
      firstName,
      lastName,
      username
    );
  }
  return (
    <form onSubmit={onSubmit} className="grid w-80 space-y-3">
      <Input required type="email" name="email" placeholder="Email"></Input>
      <Input
        // required
        type="text"
        name="firstName"
        placeholder="First Name"
      ></Input>
      <Input
        // required
        type="text"
        name="lastName"
        placeholder="Last Name"
      ></Input>
      <Input
        // required
        type="text"
        name="username"
        placeholder="Username"
      ></Input>
      <Input
        // required
        type="password"
        name="password"
        placeholder="Password"
      ></Input>
      <Input
        // required
        type="password"
        name="confirmedPassword"
        placeholder="Confirm Password"
      ></Input>
      <Button
        disabled={isLoading}
        variant="default"
        type="submit"
        className="mx-auto w-20"
      >
        {!isLoading ? "Register" : <LoaderCircle className="animate-spin" />}
      </Button>
    </form>
  );
}
