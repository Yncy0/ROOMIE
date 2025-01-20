import supabase from "@/utils/supabase";

export const useUpdateSchedule = (i) => {
  const query = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .update({
        days: i.days,
        time_in: i.time_in,
        time_out: i.time_out,
        subject_id: i.subject_id,
        course_id: i.course_id,
        profile_id: i.profile_id,
        room_id: i.room_id,
      })
      .select();

    if (error) throw error;

    return data;
  };

  return query;
};
