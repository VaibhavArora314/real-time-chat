import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import React, { useMemo, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import axios, { AxiosError } from "axios";
import { useSetRecoilState } from "recoil";
import { tokenState } from "../store/atoms/auth";
import { InputField } from "../helper/types";

interface Errors {
  username: string;
  password: string;
  email: string;
  other: string;
}

const SignUp = () => {
  const setTokenState = useSetRecoilState(tokenState);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({
    username: "",
    password: "",
    email: "",
    other: "",
  });
  const navigate = useNavigate();

  const fields: InputField[] = useMemo<InputField[]>(
    () => [
      {
        id: "username",
        label: "Your username",
        type: "text",
        placeholder: "John Doe",
        required: true,
        handleOnChange: (target) => {
          setUsername(target.value);
        },
      },
      {
        id: "email",
        label: "Your email",
        type: "email",
        placeholder: "name@company.com",
        required: true,
        handleOnChange: (target) => {
          setEmail(target.value);
        },
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        required: true,
        handleOnChange: (target) => {
          setPassword(target.value);
        },
      },
    ],
    [setUsername, setEmail, setPassword]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const unexpectedError: Errors = {
      email: "",
      password: "",
      username: "",
      other: "An unexpected error occurred",
    };
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/v1/user/signup", {
        email,
        username,
        password,
      });

      const token = data?.token;

      if (!token) {
        setErrors(unexpectedError);
        return;
      }

      localStorage.setItem("token", token);
      setTokenState(token);
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.data) {
        const errorData = axiosError.response.data as { errors?: Errors };
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          setErrors(unexpectedError);
        }
      } else {
        setErrors(unexpectedError);
      }
    }
  };

  return (
    <Card>
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
          Create your account
        </h1>
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          {fields.map((field) => (
            <Input
              key={field.id}
              {...field}
              error={errors[field.id as keyof Errors]}
            />
          ))}
          {errors.other && (
            <p className="block my-2 text-sm font-medium text-red-400 text-center">
              {errors.other}
            </p>
          )}
          <Button
            type="submit"
            label={"Sign Up"}
            onClick={() => {}}
            fontBold
            fullWidth
          />

          <p className="text-sm font-light text-gray-500">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="font-medium text-primary-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </Card>
  );
};

export default SignUp;
