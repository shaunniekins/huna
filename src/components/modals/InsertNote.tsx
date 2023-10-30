import { SetStateAction, useState } from "react";
import { NoteData } from "@/types/dataTypes";
import { supabase } from "../../../utils/supabase";
import { insertNoteData } from "@/api/notes_data";

interface InsertNoteModalProps {
  insertToggle: boolean;
  setInsertToggle: (value: boolean) => void;
  currentUsername: string;
}

const InsertNoteModal: React.FC<InsertNoteModalProps> = ({
  insertToggle,
  setInsertToggle,
  currentUsername,
}) => {
  const [currentUserData, setCurrentUserData] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [tagSelected, setTagSelected] = useState("");

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
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 bg-black">
      <div className="bg-white w-80 rounded-2xl text-end">
        <button className=" px-4 py-2 text-black" onClick={handleCancel}>
          X
        </button>
        <div className={`border-t-2 border-gray-300`} />
        <div className="px-2 py-2 flex flex-1 flex-col">
          <form onSubmit={handleSubmit} className="flex-grow space-y-3">
            <textarea
              rows={3}
              value={noteInput}
              onChange={handleNoteInputChange}
              className="w-full rounded-2xl p-2 resize-none cursor-pointer outline-none text-xl"
              placeholder="Enter your note here..."
            />
            <div className="w-full flex space-x-2">
              <select
                id="tag"
                name="tag"
                value={tagSelected}
                onChange={(e) => setTagSelected(e.target.value)}
                className={`w-[12%] h-[10%] rounded-full p-2 appearance-none select-none text-sm ${tagBackgroundColor}`}>
                <option value="none" className="bg-gray-200" />
                <option value="disgust" className="bg-green-200" />
                <option value="fear" className="bg-purple-200" />
                <option value="happy" className="bg-yellow-200" />
                <option value="mad" className="bg-red-200" />
                <option value="sad" className="bg-blue-200" />
              </select>
              <button
                className={`w-full px-4 py-2 text-sm rounded-full  text-white ${
                  !noteInput && noteInput.trim() === ""
                    ? "bg-gray-500"
                    : "bg-blue-500"
                }`}
                disabled={!noteInput && noteInput.trim() === ""}>
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
