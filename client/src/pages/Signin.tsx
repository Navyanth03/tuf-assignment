import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const SignIn= () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [err,setErr]=useState(false);
  const navigate = useNavigate();

  const handleSignIn = async() => {
    try {
      const data=await axios.post('https://tuf-assignment-server.onrender.com/api/v1/admin/signin',{
        userName: userName,
        password
      })
      setErr(false);
      localStorage.setItem('token',data.data.token);
      navigate('/dashboard');
    } catch (error) {
      setErr(true); 
    }

  };

  return (
    <div>
      <Header/>
      <div className="flex flex-col items-center justify-center h-[92vh] bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-4 border rounded"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-6 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            onClick={handleSignIn}
          >
            Sign In
          </button>
          {err
          ?  <div>Enter valid Credentials</div>
          :  null
          }
          <div className='text-center mt-4 bg-slate-500 p-1 rounded-sm'>Username : Admin , Password : 123456</div>
        </div>
      </div>
    </div>

  );
};

export default SignIn;
