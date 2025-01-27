import supabase from "@/utils/supabase";

export const useUpdateBookedRooms = async (s, id) => {
  const { data, error } = await supabase
    .from("booked_rooms")
    .update({ status: s })
    .eq("id", id)
    .single()
    .select();

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
};
