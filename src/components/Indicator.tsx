import React from "react";

interface IndicatorProps {
  msg: string;
  status: boolean;
}

const Indicator: React.FC<IndicatorProps> = ({ msg, status }) => {
  const backgroundColor = status ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`max-w-[75%] text-white top-2 md:top-5 right-1 absolute rounded-lg md:rounded-l-lg flex flex-wrap justify-center items-center px-5 py-3 text-sm md:text-md font-Montserrat ${backgroundColor}`}>
      {msg}
    </div>
  );
};
1;
export default Indicator;
