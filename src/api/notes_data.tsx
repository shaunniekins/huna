import { supabase } from "../../utils/supabase";
import { NoteData } from "@/types/dataTypes";

export const fetchNoteData = async () => {
  try {
    const { data: notes, error } = await supabase.from("notes").select("*");
    if (error) {
      console.error(error);
    } else {
      return notes;
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

export const insertNoteData = async (rowData: NoteData) => {
  // console.log("rowData", rowData);
  try {
    const { data, error } = await supabase
      .from("notes")
      .insert([rowData])
      .select("*");

    if (error) {
      //   console.error("Error inserting data:", error);
      return { data: null, error };
    } else {
      // console.log("Successfully inserted data:", data);
      return { data, error: null };
    }
  } catch (error) {
    // console.error("An error occurred:", error);
    return { data: null, error };
  }
};
