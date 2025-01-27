import supabase from "@/utils/supabase";

export const useUpdateBookedRooms = async (s, id) => {
  if (s === "PENDING RESERVE") {
    s == "ONGOING";
  }

  const { data, error } = await supabase
    .from("booked_rooms")
    .update({ status: s })
    .eq("id", id)
    .select();

  if (error) {
    console.log(error);
    throw error;
  }

  if (data) console.log(data);

  return data;
};
