import { useState, useEffect } from 'react';
import axios from 'axios';

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

const Banner= () => {
  const [data,setData]=useState<BannerData>({
    isVisible: true,
    title:"TUF+",
    timer:"10000000",
    link:"https://takeuforward.org/"
  })

  useEffect(()=>{
    async function db(){
      const dbData:ApiResponse=await axios.get('https://tuf-assignment-server.onrender.com/api/v1/banner/getbanner');
      const dbBanner:BannerData=dbData.data.newBanner;
      setData(dbBanner);
      setRemainingTime(Number(dbBanner.timer));
    }
    db();
  },[])

  const [remainingTime, setRemainingTime] = useState<number>(parseInt(data.timer, 10));

  useEffect(() => {
    if (!data.isVisible) return;
    const timerInterval = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timerInterval);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [data.isVisible,data.timer,remainingTime]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;
    if(seconds<0)return null;
    
    return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
  };

  if (!remainingTime) return null;

  return (
    <div>
      <div className="fixed top-0 left-0 w-full bg-blue-500 text-white p-2 z-50">
        <div className="flex justify-center items-center gap-8">
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <p className="text-lg">{formatTime(remainingTime)}</p>
        <a href={data.link} className="text-blue-300 underline">Enroll Now</a>
        </div>
      </div>

      <div className="pt-16"> {/* Adjust padding to accommodate the height of the fixed banner */}
        <div className="flex flex-col gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-center border rounded-lg bg-white shadow-lg overflow-hidden">
              <img
                src="/sample_image.jpg" // Replace with your image URL
                alt="Placeholder"
                className="w-1/3 h-auto object-cover"
              />
              <div className="flex-1 p-4">
                <h2 className="text-lg font-semibold">Card Title {index + 1}</h2>
                <p className='text-gray-700'>
                  The banner is fixed at the top
                </p>
                <p className="text-gray-700">
                  This is a description for card {index + 1}. It includes a brief overview of the card content.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
