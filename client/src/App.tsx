import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Banner from './pages/Banner';
import SignIn from './pages/Signin';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Banner />} />
        <Route path='/signin' element={<SignIn/>}></Route>
        <Route path='/dashboard' element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App


