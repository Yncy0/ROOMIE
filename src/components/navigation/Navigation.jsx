import {
  faLayerGroup,
  faObjectUngroup,
  faObjectGroup,
  faBoxArchive,
  faUserGroup,
  faCalendar,
  faCalendarWeek,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { colors } from "@mui/material";

export const Navigation = [
  {
    title: "Dashboard",
    href: "#",
    Icon: faObjectGroup,
  },

  {
    title: "Rooms",
    href: "#",
    Icon: faLayerGroup,
  },
  {
    title: "Bookings",
    href: "#",
    Icon: faBook,
  },

  {
    title: "Schedule",
    href: "#",
    Icon: faCalendar,
  },

  {
    title: "User Schedule",
    href: "#",
    Icon: faCalendarWeek,
  },

  {
    title: "Users",
    href: "#",
    Icon: faUserGroup,
  },

  {
    title: "Backlogs",
    href: "#",
    Icon: faObjectUngroup,
  },

  {
    title: "Archieves",
    href: "#",
    Icon: faBoxArchive,
  },

  // {
  //     title: "Logout",
  //     href: "#"
  // }
];
