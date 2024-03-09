import { atom, selector } from "recoil";
import axios from "axios";

export const tokenState = atom<string | null>({
    key: "tokenState",
    default: localStorage.getItem("token"),
})

export const userState = selector({
    key: 'authState',
    get: async ({ get }) => {
        const userId = get(tokenState);

        if (!userId) return null;

        try {
            const { data } = await axios.get('/api/v1/user/me', {
                headers: {
                    Authorization: `Bearer ${get(tokenState)}`,
                }
            })

            return data?.user;
        } catch (error) {
            return null;
        }
    }
})