import { v4 as uuidv4 } from "uuid";
import supabase from "@/utils/supabase";

export async function useHandleImageUpload() {
  try {
    const fileInput = document.getElementById("imageInput");
    if (fileInput.files.length === 0) {
      alert("Please select an image file.");
      return null;
    }

    const file = fileInput.files[0];
    const filePath = `rooms/${uuidv4()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("Rooms")
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from("Rooms")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Error uploading image: " + error.message);
    return null;
  }
}
