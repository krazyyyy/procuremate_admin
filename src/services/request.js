import axios from "axios"
import { medusaUrl } from "./config"

const client = axios.create({ baseURL: medusaUrl })

export default function medusaRequest(method, path = "", payload = {}, headers = {}) {
  const options = {
    method,
    withCredentials: true,
    url: path,
    data: payload,
    header: headers,
    json: true,
  }
  return client(options)
}
