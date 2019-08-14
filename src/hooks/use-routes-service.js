import { useContext } from "React"
import { RoutesServiceContext } from "../routes/app"

export function useRoutesService() {
  let routesService = useContext(RoutesServiceContext)

  return routesService
}
