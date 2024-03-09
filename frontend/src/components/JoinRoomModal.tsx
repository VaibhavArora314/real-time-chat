import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

interface JoinRoomModalProps {
  handleJoinModalClose: () => void;
  joinRoom: (roomCode:string) => void
}

const JoinRoomModal = ({ handleJoinModalClose, joinRoom }: JoinRoomModalProps) => {
  const [roomCode, setRoomCode] = useState<string>("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Join room</h2>
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();

          joinRoom(roomCode);
        }}>
          <Input
            id="code"
            label="Enter group invite code"
            type="text"
            placeholder="ABCDEF"
            handleOnChange={({ value }) => {
              setRoomCode(value);
            }}
            error=""
            required
          />
          <div className="flex flex-row justify-between">
            <Button type="submit" onClick={() => {}} label="Join" />
            <Button type="button" onClick={handleJoinModalClose} label="Close" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoomModal;
