import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const useFetchBookedRooms = () => {
  return useQuery({
    queryKey: ["booked_rooms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("booked_rooms")
        .select(`*, rooms(*)`);

      if (error) throw error;

      return data;
    },
  });
};
