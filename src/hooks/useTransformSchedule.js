export const transformScheduleData = (data) => {
  const weekdayToDates = (weekday) => {
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const targetDayIndex = weekdays.indexOf(weekday);

    if (targetDayIndex === -1) {
      throw new Error("Invalid weekday provided");
    }

    const currentYear = dayjs().year(); // Get the current year
    const firstDayOfYear = dayjs(`${currentYear}-01-01`);
    const lastDayOfYear = dayjs(`${currentYear}-12-31`);

    let currentDay = firstDayOfYear;
    const dates = [];

    // Loop through all the days in the year
    while (
      currentDay.isBefore(lastDayOfYear) ||
      currentDay.isSame(lastDayOfYear)
    ) {
      if (currentDay.day() === targetDayIndex) {
        dates.push(currentDay.toDate());
      }
      currentDay = currentDay.add(1, "day");
    }

    return dates;
  };
};
