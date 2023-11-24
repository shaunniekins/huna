import { AiOutlineUser, AiOutlinePlusCircle } from "react-icons/ai";
import { MdSunny } from "react-icons/md";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { MdOutlineCircle } from "react-icons/md";
import Image from "next/image";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  theme: string;
  setTheme: (value: string) => void;
  setInsertToggle: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  theme,
  setTheme,
  setInsertToggle,
}) => {
  const router = useRouter();

  const handleSignOut = async () => {
    let { error } = await supabase.auth.signOut();
    router.push("/signin");
  };

  return (
    <div
      className={`top-0 sticky p-4 flex justify-between items-center drop-shadow-md ${
        theme === "dark" ? "bg-[#242526] text-white" : "bg-[#FFFFFF] text-black"
      }`}>
      <div className="my-[-20%]">
        <Image src="/huna1.2.png" alt="Usap Logo" width={100} height={100} />
      </div>
      <div className="flex space-x-3 items-center">
        <button
          className="hidden md:flex"
          onClick={() => setInsertToggle(true)}>
          <AiOutlinePlusCircle size={30} />
        </button>
        <button
          onClick={() => {
            const newTheme = theme === "dark" ? "light" : "dark";
            localStorage.setItem("theme", newTheme);
            setTheme(newTheme);
          }}>
          {theme === "light" ? (
            <IoSunnyOutline size={30} />
          ) : (
            <IoMoonOutline size={30} />
          )}
        </button>
        <button
          className=""
          // onClick={handleSignOut}
        >
          <AiOutlineUser size={30} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
