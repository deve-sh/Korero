import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type User from "../../types/User";

const authAtom = atomWithStorage<User | null>("korero-auth-user", null);

const useAuth = () => useAtom(authAtom);

export default useAuth;
