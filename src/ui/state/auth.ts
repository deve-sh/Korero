import { atom, useAtom } from "jotai";

import type User from "../../types/User";

const authAtom = atom<User | null>(null);

const useAuth = () => useAtom(authAtom);

export default useAuth;
