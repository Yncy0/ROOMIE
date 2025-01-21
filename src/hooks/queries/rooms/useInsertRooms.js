import { useHandleImageUpload } from "@/hooks/useHandleImageUpload";
import supabase from "@/utils/supabase";

export const useInsertRooms = (
  room_name,
  room_image,
  room_type,
  room_capacity,
  building_id
) => {
  let finalImageUrl = room_image;

  const query = async () => {
    if (!room_image.startsWith("http")) {
      const uploadedImageUrl = await useHandleImageUpload();

      if (!uploadedImageUrl) return;

      finalImageUrl = uploadedImageUrl;
    }

    const { data, error } = await supabase
      .from("rooms")
      .insert([
        {
          room_name: room_name,
          room_image: finalImageUrl,
          room_type: room_type,
          room_capacity: room_capacity,
          building_id: building_id,
        },
      ])
      .select();

    if (error) throw error;

    return data;
  };

  return query;
};
