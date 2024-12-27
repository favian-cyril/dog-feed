import { Route, Routes } from 'react-router'
import { Login } from './pages/login'
import { SignUp } from './pages/signup'

function App() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
    </Routes>
  )
}

export default App
