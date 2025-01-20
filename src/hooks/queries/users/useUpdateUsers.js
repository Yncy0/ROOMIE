import supabase from "@/utils/supabase";

export const useUpdatetUser = (i) => {
  const query = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        username: i.username,
        full_name: i.full_name,
        avatar_url: i.avatar_url,
      })
      .select();

    if (error) throw error;

    return data;
  };

  return query;
};
