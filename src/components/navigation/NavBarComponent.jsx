import React from "react";
import { Navigation } from "./Navigation";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronFirst, ChevronLast } from "lucide-react";

export default function NavBarComponent() {
  const [isOpen, setIsOpen] = React.useState(true);
  const [activeLink, setActiveLink] = React.useState(null);

  const openSideBar = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = (index) => {
    setActiveLink(index);
  };

  const location = useLocation();

  return (
    <div
      className={`menu-container round-box ml-2 pt-11 gap-9 items-center duration-150 ease-in-out ${
        isOpen ? "w-32" : "w-52"
      }`}
    >
      <div className="flex flex-row items-center justify-center gap-4 mb-[1px] min-w-full">
        <button onClick={openSideBar} className="py-2">
          {isOpen ? (
            <ChevronLast className="min-w-6 text-white" />
          ) : (
            <ChevronFirst className="min-w-6 text-white" />
          )}{" "}
          {/* Chevron white */}
        </button>
        <h1
          className={`${
            !isOpen ? "block" : "hidden"
          } font-righteous text-white text-xl`}
        >
          ROOMIE
        </h1>{" "}
        {/* Title text white */}
      </div>
      <ul className="flex flex-col gap-6 items-start">
        {Navigation.map((nav, index) => {
          const { Icon } = nav;
          const isActive =
            location.pathname === `/${nav.title.toLowerCase()}` ||
            activeLink === index;

          return (
            <li key={nav.title} className="min-w-full">
              <Link
                to={`/${nav.title.toLowerCase()}`}
                onClick={() => handleClick(index)}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "0.5rem 1.5rem",
                  gap: "1rem",
                  backgroundColor: "transparent", // Default
                  borderRadius: "0.375rem", // Rounded corners
                  color: "white", // Text color white
                  textDecoration: "none",
                  outline: "none",
                  transition:
                    "background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease", // Smooth transition for background, color, and shadow
                }}
                className={`hover:bg-[rgba(226,240,253,0.4)] hover:text-blue-500 hover:shadow-lg 
                                    ${
                                      isActive
                                        ? "bg-[rgba(179,141,81,0.4)] text-blue-500 shadow-xl"
                                        : ""
                                    }`} // Highlight active link
              >
                <FontAwesomeIcon icon={Icon} className="text-white" />{" "}
                {/* Icon white */}
                <span className={`${!isOpen ? "block" : "hidden"} text-white`}>
                  {nav.title}
                </span>{" "}
                {/* Title text white */}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
