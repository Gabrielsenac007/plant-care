import { Toaster } from "react-hot-toast"
import { AppRoutes } from "./Routes"


function App() {

  return (
    <div>
      <AppRoutes />
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Nunito, sans-serif' } }} />
    </div>
  )
}

export default App
