import { useInsertRooms } from "./queries/rooms/useInsertRooms";

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

    return publicUrlData.publicUrl, data;
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Error uploading image: " + error.message);
    return null;
  }
}

export async function useSaveData(
  room_name,
  room_image,
  room_type,
  room_capacity
) {
  let finalImageUrl = room_image;

  // Upload image if an image file was selected

  const { data } = useInsertRooms(
    room_name,
    finalImageUrl,
    room_type,
    room_capacity
  );

  alert("Data saved successfully");
  navigate("/rooms");

  return data;

  //   try {
  //     const { data, error } = await supabase.from("rooms").insert([
  //       {
  //         room_name,
  //         room_description,
  //         room_capacity,
  //         room_location,
  //         room_image: finalImageUrl,
  //       },
  //     ]);

  //     if (error) throw error;

  //     alert("Data saved successfully");
  //     navigate("/rooms");

  //     return data;
  //   } catch (error) {
  //     console.error("Error saving data:", error);
  //     alert("Error saving data: " + error.message);
  //   }
}
