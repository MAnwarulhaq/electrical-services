const inputClass =
  "w-full mt-2 border border-slate-200 bg-white rounded-xl px-4 py-3.5 outline-none transition duration-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 disabled:bg-slate-100 disabled:cursor-not-allowed";

const FormInput = ({ label, required, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-black text-slate-700">
        {label}

        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <input
        {...props}
        required={required}
        className={inputClass}
      />
    </div>
  );
};

export { inputClass };
export default FormInput;