import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

const Alert = ({ type, message, onClose }) => {
  const isSuccess = type === "success";

  return (
    <div
      className={`mb-6 border rounded-xl p-4 flex items-center justify-between gap-4 ${
        isSuccess
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-red-50 border-red-200 text-red-700"
      }`}
    >
      <div className="flex items-center gap-3 font-semibold">
        {isSuccess ? <FaCheckCircle /> : <FaExclamationTriangle />}
        {message}
      </div>

      <button type="button" onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
};

export default Alert;