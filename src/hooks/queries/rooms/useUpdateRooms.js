import supabase from "@/utils/supabase";

export const useUpdateRooms = (i) => {
  const query = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .update({
        room_name: i.room_name,
        room_image: i.room_image,
        room_type: i.room_type,
        room_capacity: i.room_capacity,
        building_id: i.building_id,
      })
      .select();

    if (error) throw error;

    return data;
  };

  return query;
};
