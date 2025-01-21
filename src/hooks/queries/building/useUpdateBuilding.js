import supabase from "@/utils/supabase";

export const useUpdateBuilding = (i) => {
  const query = async () => {
    const { data, error } = await supabase
      .from("building")
      .update({
        building_name: i.building_name,
      })
      .eq("id", i.id)
      .select();

    if (error) throw error;

    return data;
  };

  return query;
};
