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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createRoom(title, description);
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
            error=""
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
            error=""
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
