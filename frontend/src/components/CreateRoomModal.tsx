import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import axios, { AxiosError } from "axios";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { tokenState } from "../store/atoms/auth";
import { RoomIDs,RoomInfo } from "../store/atoms/room";
import { RoomInfoInteface } from "../helper/types";

interface CreateRoomModalProps {
  handleCreateModalClose: () => void;
}

interface Errors {
  title: string;
  desc: string;
  other: string
}

const CreateRoomModal = ({ handleCreateModalClose }: CreateRoomModalProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({
    title: "",
    desc: "",
    other: ""
  });
  const token = useRecoilValue(tokenState);
  const createNewRoom = useRecoilCallback(({set}) => (room:RoomInfoInteface) => {
    set(RoomInfo(room._id),room);
    set(RoomIDs, (curVal) => [...curVal,{
      _id: room._id,
      lastActivity: room.lastActivity,
      lastMessage: room.lastMessage,
      title: room.title
    }])
  },[])

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/v1/room/create', {
        title,
        description
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // add to recoil state here
      if (response.data.room)
        createNewRoom(response.data.room);

      console.log("Creating new room")

      handleCreateModalClose();
    } catch (error) {
      const axiosError = error as AxiosError;
      const unexpectedError:Errors = {
        title: "",
        desc: "",
        other: "An unexpected error occurred!"
      }
      if (axiosError.response && axiosError.response.data) {
        const errorData = axiosError.response.data as { errors?: Errors }
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          setErrors(unexpectedError);
        }
      } else {
        setErrors(unexpectedError);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Create Group</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="title"
            type="text"
            label="Title"
            placeholder=""
            error={errors.title}
            handleOnChange={({ value }) => {
              setTitle(value);
            }}
            required
          />
          <Input
            id="desc"
            type="text"
            label="Description"
            placeholder=""
            error={errors.desc}
            handleOnChange={({ value }) => {
              setDescription(value);
            }}
          />
          {errors.other && (
            <p className="block my-2 text-sm font-medium text-red-400 text-center">
              {errors.other}
            </p>
          )}

          <div className="flex flex-row justify-between">
            <Button
              type="submit"
              onClick={() => {}}
              label="Create"
              fullWidth={false}
            />
            <Button
              type="button"
              onClick={handleCreateModalClose}
              label="Close"
              fullWidth={false}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
