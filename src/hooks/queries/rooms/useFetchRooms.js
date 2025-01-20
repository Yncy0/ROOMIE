import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const useFetchRooms = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select(`*, building(id, building_name)`)
        .order("room_name", { ascending: true });

      if (error) throw error;

      return data;
    },
  });
};
