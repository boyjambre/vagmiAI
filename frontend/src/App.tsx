import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import History from "./pages/History"
import Landing from "./pages/Landing"
import SessionResults from "./pages/SessionResult"
import SessionLive from "./pages/SessionLive"
import Profile from "./pages/Profile"
import SessionSetup from "./pages/SessionSetup"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/session/setup" element={<SessionSetup />} />
      <Route path="/session/live" element={<SessionLive />} />
      <Route path="/results/:sessionId" element={<SessionResults />} />
    </Routes>
  )
}

export default App