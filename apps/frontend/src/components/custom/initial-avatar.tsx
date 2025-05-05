import React, { useMemo } from "react";

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};

const getRandomColor = () => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const InitialsAvatar = ({ firstName, lastName, size = 40 }: any) => {
  const initials = useMemo(
    () => getInitials(firstName, lastName),
    [firstName, lastName]
  );
  const bgColor = useMemo(() => getRandomColor(), []); // only generates once per mount

  return (
    <div
      className={`text-white font-semibold flex items-center justify-center rounded-full ${bgColor}`}
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
};

export default InitialsAvatar;
