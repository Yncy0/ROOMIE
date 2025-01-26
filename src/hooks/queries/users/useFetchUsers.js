import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const useFetchUsers = () => {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select(`*`);

      if (error) throw error;

      return data;
    },
  });
};
