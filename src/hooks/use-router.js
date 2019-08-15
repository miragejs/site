import { useContext } from "react";
import { RouterContext } from "../routes/app";
import { Router } from "../lib/router";

export function useRouter() {
  return useContext(RouterContext) || new Router(); 
}
