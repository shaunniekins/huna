import { supabase } from "../../utils/supabase";
import { ProfileData } from "@/types/dataTypes";

export const insertProfileData = async (rowData: ProfileData) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert([rowData])
      .select("*");

    if (error) {
      console.error("Error inserting data:", error);
      return { data: null, error };
    } else {
      // console.log("Successfully inserted data:", data);
      return { data, error: null };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: null, error };
  }
};
