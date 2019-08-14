import { useContext } from "react";
import { RouterContext } from "./app";

export function useRouter() {
  let routesService = useContext(RouterContext);
  return routesService;
}
