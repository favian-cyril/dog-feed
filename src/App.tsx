import { Route, Routes } from 'react-router'
import { Login } from './pages/login'
import { SignUp } from './pages/signup'
import AuthLayout from './pages/auth/layout'
import Dashboard from './pages/auth/dashboard'
import SelectBreed from './pages/auth/select-breed'

function App() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route element={<AuthLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="select-breed" element={<SelectBreed />} />
      </Route>
    </Routes>
  )
}

export default App
