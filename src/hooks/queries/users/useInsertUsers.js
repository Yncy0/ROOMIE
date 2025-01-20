import supabase from "@/utils/supabase";

export const useInsertUser = (i) => {
  const query = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          username: i.username,
          full_name: i.full_name,
          avatar_url: i.avatar_url,
        },
      ])
      .select();

    if (error) throw error;

    return data;
  };

  return query;
};
