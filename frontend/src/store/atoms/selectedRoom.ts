import { atom } from "recoil";

export const selectedRoomAtom = atom<string>({
    key: "selectedRoom",
    default: "",
})