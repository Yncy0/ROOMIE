import supabase from "@/utils/supabase";
import React from "react";

const useSubscription = () => {
  React.useEffect(() => {
    const channels = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "schedule" },
        (payload) => {
          console.log("Change received!", payload);
        }
      )
      .subscribe();

    return () => {
      channels.unsubscribe();
    };
  }, []);
};

export default useSubscription;
