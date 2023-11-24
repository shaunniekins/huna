"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import InsertNoteModal from "./modals/InsertNote";
import { fetchNoteData } from "@/api/notes_data";

import { AiOutlinePlus } from "react-icons/ai";
import { supabase } from "../../utils/supabase";
import { NoteDataItem, ProfileData } from "@/types/dataTypes";
import { useRouter } from "next/navigation";
import { fetchProfileData } from "@/api/profiles_data";

// interface NoteCardProps {
//   note: string;
//   tag: string
// }

// const NoteCard:React.FC<NoteCardProps> = ({
//   note,
//   tag,
// }) => {
//   let tagBackgroundColor;

type Note = any;
type User = any;
type Username = any;

const NoteCard = ({
  username,
  note,
  tag,
  theme,
}: {
  username: string;
  note: string;
  tag: string;
  theme: string;
}) => {
  let tagBackgroundColor;

  // console.log("username", username);
  // console.log("tag", tag);

  // Define the background color based on the tag value
  switch (tag) {
    case "happy":
      tagBackgroundColor = "bg-yellow-200";
      break;
    case "disgust":
      tagBackgroundColor = "bg-green-200";
      break;
    case "sad":
      tagBackgroundColor = "bg-blue-200";
      break;
    case "mad":
      tagBackgroundColor = "bg-red-200";
      break;
    case "fear":
      tagBackgroundColor = "bg-purple-200";
      break;
    default:
      tagBackgroundColor = theme === "dark" ? "bg-gray-300" : "bg-gray-200";
      break;
  }

  return (
    <div
      className={`w-full lg:w-[50rem] flex flex-col   shadow-lg h-[350px] rounded-lg px-6 justify-center items-center font-sans ${
        theme === "dark" ? "bg-[#242526] text-white" : "bg-[#FFFFFF] text-black"
      }
      `}>
      <div
        className={`h-6 w-full rounded-b-3xl mx-2 text-black text-center ${tagBackgroundColor}  font-semibold`}>
        {tag}
      </div>
      <p className="break-all text-center flex-1 self-center justify-self-center flex justify-center items-center text-md">
        {note}
      </p>
      <div className="flex self-start items-center space-x-1">
        <div className=" flex space-x-[-5px]">
          <button className="text-sm">🤣</button>
          <button className="text-sm">😥</button>
          <button className="text-sm">😠</button>
          <button className="text-sm">🤢</button>
          <button className="text-sm">😨</button>
        </div>
        <p className="text-xs">12</p>
      </div>
      <div className="w-full flex justify-between pb-3 items-center ">
        <div className="flex space-x-1 items-center">
          <button className="text-xl hover:scale-125 scale transition delay-75 duration-500 ease-in-out">
            🤣
          </button>
          <p className="text-sm">Haha</p>
        </div>

        <div className="h-full items-center flex space-x-3 ">
          {/* <p className={`rounded-full px-2 ${tagBackgroundColor}`}>{tag}</p> */}
          <p
            className={`text-xs flex flex-col items-center font-semibold ${
              theme === "dark" ? "text-gray-300" : " text-gray-600"
            }`}>
            {username}
            <span className=" font-thin">2 hours ago</span>
          </p>
        </div>
      </div>
    </div>
    // the bg color of the tag will be based on the tag
  );
};

const Home = () => {
  const [insertToggle, setInsertToggle] = useState(false);

  const [noteData, setNoteData] = useState<NoteDataItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<ProfileData[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        setTheme(e.newValue || "light");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error && error.status === 401) {
          // Handle the error
        } else if (error) {
          // Handle the error
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await fetchProfileData();

        if (error) {
          console.error("Error fetching profile data:", error);
        } else {
          setProfileData(data || []);

          if (data) {
            // Use .find only if data is not null
            const currentUserProfile = data.find(
              (profile) => profile.id === user.id
            );

            if (currentUserProfile) {
              setCurrentUsername(currentUserProfile.username);
              // You can use currentUsername in your component
            }
          }
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const notes = await fetchNoteData();
      if (notes !== undefined) {
        setNoteData(notes);
      }
    };

    fetchData();

    const channel = supabase
      .channel(`realtime sessions`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notes",
        },
        //   (payload) => {
        //     if (payload.new) {
        //       setNoteData(payload.new);
        //       // setNoteData((prevSessions: any) => [...prevSessions, payload.new]);
        //     }
        //   }
        // )
        // .subscribe();
        (payload) => {
          if (payload.new) {
            setNoteData((prevNoteData) => [
              ...prevNoteData,
              {
                profile_id: payload.new.string,
                username: payload.new.username,
                content: payload.new.content,
                tag: payload.new.tag,
              },
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div
      className={`w-screen  ${
        theme === "dark" ? "bg-[#18191A] text-white" : "bg-[#F0F2F5] text-black"
      }`}>
      <Navbar
        theme={theme}
        setTheme={setTheme}
        setInsertToggle={setInsertToggle}
      />
      {/* `container w-screen mx-auto min-h-[90dvh] px-4 md:px-0 py-5 space-y-8 flex flex-col justify-center items-center` */}
      {/* px-5 mx-[-0.30rem] sm:mx-[5rem] xl:mx-[26rem] 2xl:mx-[34rem] h-fit */}
      <div
        className={
          " container mx-auto min-h-[100dvh] px-4 md:px-0 py-5 space-y-8 flex flex-col justify-center items-center"
        }>
        {noteData &&
          noteData
            .slice()
            .reverse() // Reverse the array
            .map((noteItem: NoteDataItem, index: number) => (
              <NoteCard
                key={index}
                username={noteItem.username}
                note={noteItem.content}
                tag={noteItem.tag}
                theme={theme}
              />
            ))}
      </div>

      <div className="flex md:hidden bottom-5 right-4 fixed z-50 rounded-full bg-blue-400 p-2 items-center justify-center">
        <button
          className="text-4xl font-normal z-10 text-white flex items-center justify-center"
          onClick={() => setInsertToggle(true)}>
          <AiOutlinePlus />
          {/* {isToggle ? "▼" : "▲"} */}
        </button>
      </div>
      {insertToggle && (
        <InsertNoteModal
          insertToggle={insertToggle}
          setInsertToggle={setInsertToggle}
          currentUsername={currentUsername}
          theme={theme}
        />
      )}
    </div>
  );
};

export default Home;
