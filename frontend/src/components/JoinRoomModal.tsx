import React ,{ useState } from "react";
import Input from "./Input";
import Button from "./Button";
import axios, { AxiosError } from "axios";
import { useRecoilValue } from "recoil";
import { tokenState } from "../store/atoms/auth";

interface JoinRoomModalProps {
  handleJoinModalClose: () => void;
  joinRoom: (roomCode:string) => void
}

interface ResponseData {
  message?: string,
  error?: string,
}

const JoinRoomModal = ({ handleJoinModalClose, joinRoom }: JoinRoomModalProps) => {
  const [roomCode, setRoomCode] = useState<string>("");
  const [error,setError] = useState<string>("");
  const token = useRecoilValue(tokenState);

  const handleRoomJoin = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post<ResponseData>('/api/v1/room/verify-invite', {
        inviteCode: roomCode
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      joinRoom(roomCode);
      handleJoinModalClose();
    } catch (error) {
      const axiosError = error as AxiosError<ResponseData>;
      const data = axiosError.response?.data;
      setError(data?.error ? data.error : "An unexpected error occurred");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Join room</h2>
        <form className="space-y-4" onSubmit={handleRoomJoin}>
          <Input
            id="code"
            label="Enter group invite code"
            type="text"
            placeholder="ABCDEF"
            handleOnChange={({ value }) => {
              setRoomCode(value);
            }}
            error={error}
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
