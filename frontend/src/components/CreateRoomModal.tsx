import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";

interface CreateRoomModalProps {
  handleCreateModalClose: () => void;
  createRoom: (title: string, description: string) => void;
}

const CreateRoomModal = ({
  handleCreateModalClose,
  createRoom,
}: CreateRoomModalProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error,setError] = useState({
    title: "",
    description: ""
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim().length < 5 || title.trim().length > 40){
      setError({
        title: "Title need to have length between 5 and 40.",
        description: ""
      })
      return;
    }

    if (description.trim().length > 100){
      setError({
        title: "",
        description: "Description can have max 100 length."
      })
      return;
    }

    createRoom(title, description);
    handleCreateModalClose();
  };

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
            error={error.title}
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
            error={error.description}
            handleOnChange={({ value }) => {
              setDescription(value);
            }}
          />

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
