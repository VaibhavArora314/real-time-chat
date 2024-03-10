import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { tokenState } from "./auth";
import axios from "axios";
import { RoomOverviewInteface } from "../../helper/types";

// array of room ids with lastActivity and message and title
export const RoomIDs = atom<RoomOverviewInteface[]>({
    key: "RoomIds",
    default: selector({
        key: "RoomIds/default",
        get: async ({ get }) => {
            const token = get(tokenState);

            try {
                const response = await axios.get('/api/v1/room/my-rooms', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.rooms) return response.data.rooms;
                return [];
            } catch (error) {
                return [];
            }
        }
    })
})

export const sortedRoomIDs = selector<RoomOverviewInteface[]>({
    key: "SortedRoomIds",
    get: ({ get }) => {
        const rooms = [...get(RoomIDs)];
        const sortedRooms = rooms.sort(
            (room1: RoomOverviewInteface, room2: RoomOverviewInteface) => {
                const date1 = Date.parse(room1.lastActivity),
                    date2 = Date.parse(room2.lastActivity);
                if (date1 > date2) {
                    return -1;
                } else if (date1 < date2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
        return sortedRooms
    }
})

export const RoomInfo = atomFamily({
    key: "RoomInfo",
    default: selectorFamily({
        key: 'RoomInfo/default',
        get: id => async ({ get }) => {
            const token = get(tokenState);

            try {
                const response = await axios.get(`/api/v1/room/my-rooms/${id?.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.room) return response.data.room;
                return null;
            } catch (error) {
                return null;
            }
        }
    })
})