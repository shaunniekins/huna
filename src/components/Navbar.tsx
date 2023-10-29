import { AiOutlineUser, AiOutlinePlusCircle } from "react-icons/ai";
import { MdOutlineCircle } from "react-icons/md";
import Image from "next/image";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";

interface NavbarProps {
  isDefaultLayout: boolean;
  setDefaultLayout: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isDefaultLayout,
  setDefaultLayout,
}) => {
  const router = useRouter();

  const handleSignOut = async () => {
    let { error } = await supabase.auth.signOut();
    router.push("/signin");
  };

  return (
    <div className="top-0 sticky bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-400">
      <div className="my-[-20%]">
        <Image src="/huna1.2.png" alt="Usap Logo" width={100} height={100} />
      </div>
      <div className="flex space-x-3 items-center">
        <button
          //   className="rounded-full hover:bg-gray-400 py-1 px-2"
          onClick={() => setDefaultLayout(!isDefaultLayout)}>
          <p className="text-[25px]">{isDefaultLayout ? "⊞" : "⊟"}</p>
        </button>
        <MdOutlineCircle size={30} />
        <AiOutlinePlusCircle size={30} />
        <button className="" onClick={handleSignOut}>
          <AiOutlineUser size={30} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
