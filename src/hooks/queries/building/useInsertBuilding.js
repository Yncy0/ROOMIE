import supabase from "@/utils/supabase";

export const useInsertBuilding = (i) => {
  const query = async () => {
    const { data, error } = await supabase
      .from("building")
      .insert([
        {
          building_name: i.building_name,
        },
      ])
      .select();

    if (error) throw error;

    return data;
  };

  return query;
};
