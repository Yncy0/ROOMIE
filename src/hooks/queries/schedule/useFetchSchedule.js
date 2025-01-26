import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const useFetchSchedule = () => {
  return useQuery({
    queryKey: ["schedule"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedule")
        .select(`*, course(*), subject(*), profiles(*), rooms(*)`);

      if (error) throw error;

      return data;
    },
  });
};
