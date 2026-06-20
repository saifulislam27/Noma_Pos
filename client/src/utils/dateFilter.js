export const getDateRange = (
  filter
) => {

  const now = new Date();

  switch (filter) {

    case "today":

      return {
        start: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        ),
        end: now,
      };

    case "yesterday":

      const yesterday =
        new Date();

      yesterday.setDate(
        yesterday.getDate() - 1
      );

      return {
        start: new Date(
          yesterday.getFullYear(),
          yesterday.getMonth(),
          yesterday.getDate()
        ),
        end: yesterday,
      };

    case "week":

      const weekStart =
        new Date();

      weekStart.setDate(
        now.getDate() - 7
      );

      return {
        start: weekStart,
        end: now,
      };

    case "month":

      return {
        start: new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        ),
        end: now,
      };

    default:

      return {
        start: null,
        end: null,
      };
  }
};