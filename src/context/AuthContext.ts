import { createContext } from "react"

const initUser = {
  user: {loggedIn: false, loading: true},
  setUser: () => {}
}

interface IAuthContext {
  user: IAuthUser;
  setUser: any;
}

interface IAuthUser {
  loading: boolean;
  loggedIn: boolean;
  id?: string;
  pfp?: string;
  username?: string;
  tag?: string;
  admin?: boolean;
}

export default createContext<IAuthContext>(initUser);
export type {
  IAuthUser
}