import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {

  const number = "923001234567";

  const message =
    "Assalam-o-Alaikum, I need Electrical Services.";

  return (

    <a
      href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-green-500 text-white flex justify-center items-center text-4xl shadow-xl hover:scale-110 transition"
    >
      <FaWhatsapp />
    </a>

  );

};

export default WhatsAppButton;