import supabase from "@/utils/supabase";

export const useInsertRooms = (
  room_name,
  room_image,
  room_type,
  room_capacity,
  building_id
) => {
  const query = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .insert([
        {
          room_name: room_name,
          room_image: room_image,
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
