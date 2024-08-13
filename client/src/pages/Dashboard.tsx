import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

interface BannerData{
  isVisible: boolean,
  title:string,
  timer:string,
  link:string
}

interface ApiResponse {
  data:{
    newBanner:BannerData
  }
}

const Dashboard= () => {
  const navigate=useNavigate();
  const [data,setData]=useState<BannerData>({
    isVisible: true,
    title:"TUF+",
    timer:"1000000000",
    link:"https://takeuforward.org/"
  })

  const [tempVisible,setTempVisible]=useState<boolean>(data.isVisible);
  const [tempTitle,setTempTitle]=useState<string>(data.title);
  const [tempTimer,setTempTimer]=useState<string>(data.timer);
  const [tempLink,setTempLink]=useState<string>(data.link);

  const [err,setErr]=useState<boolean>(false);
  const [isLoading,setIsLoading]=useState<boolean>(true);

  useEffect(()=>{
    async function authenticate(){
      try {
        await axios.get('https://tuf-assignment-server.onrender.com/api/v1/admin/authenticate',{
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        })
        setIsLoading(false);
      } catch (error) {
        navigate('/signin')
      }
    }
    authenticate();
  },[])

  useEffect(()=>{
    async function db(){
      const dbData:ApiResponse=await axios.get('https://tuf-assignment-server.onrender.com/api/v1/banner/getbanner');
      const dbBanner:BannerData=dbData.data.newBanner;
      setData(dbBanner);
      setTempVisible(dbBanner.isVisible);
      setTempTitle(dbBanner.title);
      setTempTimer(dbBanner.timer);
      setTempLink(dbBanner.link);
    }
    db();
  },[])


    const handleToggle = () => {
        setTempVisible(prev => !prev);
    };

    const handleSave = async() => {
      try {
        await axios.post('https://tuf-assignment-server.onrender.com/api/v1/banner/updatebanner',{
          isVisible:tempVisible,
          title:tempTitle,
          timer:Number(tempTimer),
          link: tempLink
        })
        setErr(false);
      } catch (error) {
        setErr(true);
      }
    };

    if(isLoading) return (
      <div>Loading...</div>
    );

    return (
      <div className='bg-black'>
        <Header/>
        <div className="flex justify-center items-center h-[92vh] bg-slate-900 p-5">
        <div className="flex flex-col border-2 bg-white border-gray-300 rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6 text-center">Dashboard</h2>
            
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-700">Show Banner</span>
                <label className="inline-flex items-center cursor-pointer">
                    <input
                    type="checkbox"
                    checked={tempVisible}
                    onChange={handleToggle}
                    className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 transition-colors">
                    <div
                        className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${
                        tempVisible ? 'translate-x-full' : 'translate-x-0'
                        }`}
                    ></div>
                    </div>
                </label>
            </div>

            
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
            type="text"
            id="title"
            value={tempTitle}
            onChange={((e)=>setTempTitle(e.target.value))}
            className="border-2 border-gray-300 rounded-md px-2 py-1 mb-4 w-full"
            />

            <label htmlFor="timer" className="block text-sm font-medium text-gray-700 mb-2">Timer (ms)</label>
            <input
            type="text"
            id="timer"
            value={tempTimer}
            onChange={(e)=>{
              const newValue=e.target.value;
              if (/^\d*$/.test(newValue)) {
                setTempTimer(newValue);
              }
            }}
            className="border-2 border-gray-300 rounded-md px-2 py-1 mb-4 w-full"
            />

            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">Link</label>
            <input
            type="text"
            id="link"
            value={tempLink}
            onChange={(e)=>setTempLink(e.target.value)}
            className="border-2 border-gray-300 rounded-md px-2 py-1 mb-4 w-full"
            />
            
            <button
            onClick={handleSave}
            className="bg-blue-500 text-white rounded-md py-2 px-4 mt-4 hover:bg-blue-600"
            >
            Save
            </button>
            {err
            ?  <div>Enter valid inputs</div>
            :  null
            }
        </div>
        </div>
      </div>
        
    );
}

export default Dashboard;