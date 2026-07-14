import React from "react";

const StatusBadge = ({ status }) => {
  const currentStatus = (status || "pending").toLowerCase();

  const statusStyles = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-300",
      dot: "bg-yellow-500",
      label: "Pending",
    },
    confirmed: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-300",
      dot: "bg-blue-500",
      label: "Confirmed",
    },
    assigned: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-300",
      dot: "bg-purple-500",
      label: "Assigned",
    },
    "in-progress": {
      bg: "bg-cyan-100",
      text: "text-cyan-700",
      border: "border-cyan-300",
      dot: "bg-cyan-500",
      label: "In Progress",
    },
    completed: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-300",
      dot: "bg-green-500",
      label: "Completed",
    },
    cancelled: {
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-300",
      dot: "bg-red-500",
      label: "Cancelled",
    },
  };

  const style =
    statusStyles[currentStatus] || statusStyles.pending;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        px-3
        py-1.5
        rounded-full
        text-sm
        font-semibold
        border
        ${style.bg}
        ${style.text}
        ${style.border}
      `}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full ${style.dot}`}
      ></span>

      {style.label}
    </span>
  );
};

export default StatusBadge;