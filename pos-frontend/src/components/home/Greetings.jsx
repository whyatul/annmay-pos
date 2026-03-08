import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Greetings = () => {
  const userData = useSelector(state => state.user);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const h = dateTime.getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

  return (
    <div className="flex justify-between items-center px-8 pt-6 pb-2">
      <div>
        <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wide">
          {getGreeting()}, <span className="text-[#f6b100]">{userData.name?.split(' ')[0] || "User"}</span>
        </h1>
        <p className="text-[#666] text-sm mt-1">
          Manage your restaurant operations efficiently
        </p>
      </div>
      <div className="bg-[#161616] border border-[#222] rounded-xl px-5 py-3 text-right">
        <h1 className="text-[#f6b100] text-2xl font-bold tracking-wider font-mono">{formatTime(dateTime)}</h1>
        <p className="text-[#666] text-xs mt-0.5">{formatDate(dateTime)}</p>
      </div>
    </div>
  );
};

export default Greetings;
