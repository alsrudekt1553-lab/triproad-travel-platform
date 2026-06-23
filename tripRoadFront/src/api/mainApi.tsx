import axios from "axios"
import { API_SERVER_HOST } from "./apiConfig"

const prefix = `${API_SERVER_HOST}/api/main`

export const getMainHome = async (): Promise<MainHome> => {
  const res = await axios.get(`${prefix}/home`)
  return res.data
}