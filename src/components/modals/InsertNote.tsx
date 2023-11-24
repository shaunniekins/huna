import { SetStateAction, useState } from "react";
import { NoteData } from "@/types/dataTypes";
import { supabase } from "../../../utils/supabase";
import { insertNoteData } from "@/api/notes_data";

interface InsertNoteModalProps {
  insertToggle: boolean;
  setInsertToggle: (value: boolean) => void;
  currentUsername: string;
  theme: string;
}

const InsertNoteModal: React.FC<InsertNoteModalProps> = ({
  insertToggle,
  setInsertToggle,
  currentUsername,
  theme,
}) => {
  const [currentUserData, setCurrentUserData] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [tagSelected, setTagSelected] = useState("");
  // const [textNote, setTextNote] = useState("");

  const characterCount = noteInput.length;
  const maxCharacterLimit = 280;
  const characterIndicator = `${characterCount}/${maxCharacterLimit}`;

  // console.log("currentUsername", currentUsername);

  const handleNoteInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setNoteInput(e.target.value);
  };

  const handleCancel = () => {
    if (noteInput.trim() !== "") {
      let cancel = confirm("Changes you made may not be saved. Proceed?");

      if (cancel) {
        setInsertToggle(false);
      }
    }
    setInsertToggle(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (noteInput && noteInput.trim() !== "") {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        const newNoteData: NoteData = {
          profile_id: user?.id || "",
          username: currentUsername,
          content: noteInput,
          tag: tagSelected,
        };

        setInsertToggle(false);
        setNoteInput("");
        setTagSelected("none");
        insertNoteData(newNoteData);
      } catch {
        console.log("no data");
      }
    }
  };

  let tagBackgroundColor;

  // Define the background color based on the tag value
  switch (tagSelected) {
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
      className={` fixed inset-0 flex items-center justify-center  bg-opacity-50  z-50 ${
        theme === "dark" ? "bg-gray-900" : "bg-black"
      }`}>
      <div
        className={` w-80 md:w-[35rem] rounded-2xl text-end ${
          theme === "dark"
            ? "bg-[#242526] text-white"
            : "bg-[#FFFFFF] text-black"
        }`}>
        <button
          className={`px-4 py-2 text-black ${
            theme === "dark" ? "text-gray-300" : " text-gray-600"
          }`}
          onClick={handleCancel}>
          X
        </button>
        <div className={`border-t-2 border-gray-300`} />
        <div className="px-2 py-2 flex flex-1 flex-col">
          <form onSubmit={handleSubmit} className="flex-grow space-y-3">
            <div className="relative">
              <textarea
                rows={5}
                maxLength={maxCharacterLimit}
                value={noteInput}
                onChange={handleNoteInputChange}
                className={`w-full rounded-2xl p-2 resize-none cursor-pointer outline-none text-xl ${
                  theme === "dark"
                    ? "bg-[#242526] text-white"
                    : "bg-[#FFFFFF] text-black"
                }`}
                placeholder="Enter your note here..."
              />
              <p
                className={`absolute bottom-2 right-2 ${
                  theme === "dark" ? "text-gray-300" : " text-gray-600"
                }`}>
                {characterIndicator}
              </p>
            </div>

            <div className="w-full flex space-x-2">
              <select
                id="tag"
                name="tag"
                value={tagSelected}
                onChange={(e) => setTagSelected(e.target.value)}
                className={`w-[3rem] h-full rounded-full p-2 appearance-none select-none text-sm ${tagBackgroundColor}`}>
                <option value="none" className="bg-gray-200" />
                <option value="disgust" className="bg-green-200" />
                <option value="fear" className="bg-purple-200" />
                <option value="happy" className="bg-yellow-200" />
                <option value="mad" className="bg-red-200" />
                <option value="sad" className="bg-blue-200" />
              </select>
              <button
                className={`w-full px-4 py-2 text-sm rounded-full  text-white ${
                  (!noteInput && noteInput.trim() === "") ||
                  noteInput.length > 280 ||
                  noteInput.length < 5
                    ? "bg-gray-500"
                    : "bg-blue-500"
                }`}
                disabled={
                  (!noteInput && noteInput.trim() === "") ||
                  noteInput.length > 280 ||
                  noteInput.length < 5
                }>
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InsertNoteModal;
