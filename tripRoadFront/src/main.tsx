import { createRoot } from "react-dom/client"
import "./index.css"
import { RouterProvider } from "react-router"
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"
import router from "./router/root"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
})

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)