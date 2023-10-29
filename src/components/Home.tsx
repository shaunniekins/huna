"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import InsertNoteModal from "./modals/InsertNote";
import { fetchNoteData } from "@/api/notes_data";

import { AiOutlinePlus } from "react-icons/ai";
import { supabase } from "../../utils/supabase";
import { NoteDataItem } from "@/types/dataTypes";

// interface NoteCardProps {
//   note: string;
//   isDefaultLayout: boolean;
//   tag: string
// }

// const NoteCard:React.FC<NoteCardProps> = ({
//   note,
//   isDefaultLayout,
//   tag,
// }) => {
//   let tagBackgroundColor;

type Note = any;

const NoteCard = ({
  note,
  isDefaultLayout,
  tag,
}: {
  note: string;
  isDefaultLayout: boolean;
  tag: string;
}) => {
  let tagBackgroundColor;

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
      tagBackgroundColor = "bg-gray-200"; // Default to gray for unknown tags
      break;
  }

  return (
    <div
      className={`flex flex-col  border bg-white rounded-xl pt-4  px-4 space-y-4
      `}>
      <p className="break-all text-sm">{note}</p>
      <div className="flex justify-between pb-4 text-xs text-gray-600">
        <p className={`rounded-full px-2 ${tagBackgroundColor}`}>{tag}</p>
        <p className="">username</p>
      </div>
    </div>
    // the bg color of the tag will be based on the tag
  );
};

const Home = () => {
  const [insertToggle, setInsertToggle] = useState(false);
  const [isDefaultLayout, setDefaultLayout] = useState(true);

  const [noteData, setNoteData] = useState<NoteDataItem[]>([]);

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
                content: payload.new.content,
                tag: payload.new.tag || null,
              },
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="w-screen bg-gray-100">
      <Navbar
        isDefaultLayout={isDefaultLayout}
        setDefaultLayout={setDefaultLayout}
      />
      <div
        className={`min-h-[90dvh] px-4 py-5 space-y-2 ${
          isDefaultLayout ? "flex flex-col" : "grid grid-cols-2 gap-x-2"
        }`}>
        {noteData &&
          noteData.map((noteItem: NoteDataItem, index: number) => (
            <NoteCard
              key={index}
              note={noteItem.content}
              isDefaultLayout={isDefaultLayout}
              tag={noteItem.tag || ""}
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
        />
      )}
    </div>
  );
};

export default Home;
