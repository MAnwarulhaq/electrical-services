export const inputClass =
  "w-full mt-2 border border-slate-200 rounded-xl px-4 py-3.5 outline-none bg-white transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10";

export const FormLabel = ({ children }) => (
  <label className="block text-sm font-black text-slate-700">
    {children}
  </label>
);

export const Input = ({ label, ...props }) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <input {...props} className={inputClass} />
  </div>
);

export const Textarea = ({ label, ...props }) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <textarea
      {...props}
      className={`${inputClass} resize-none`}
    />
  </div>
);

export const FormSection = ({
  title,
  description,
  icon,
  children,
}) => (
  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
    <div className="p-5 border-b border-slate-100 flex items-start gap-3">
      <div className="w-10 h-10 shrink-0 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
        {icon}
      </div>

      <div>
        <h3 className="font-black text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
    </div>

    <div className="p-5">{children}</div>
  </div>
);

export const ModernCheckbox = ({
  name,
  checked,
  onChange,
  title,
  description,
  icon,
  iconClass,
}) => (
  <label
    className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition ${
      checked
        ? "border-yellow-400 bg-yellow-50"
        : "border-slate-200 hover:border-slate-300"
    }`}
  >
    <div
      className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${iconClass}`}
    >
      {icon}
    </div>

    <div className="flex-1">
      <p className="font-black text-sm text-slate-900">{title}</p>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>

    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-5 h-5 accent-yellow-400"
    />
  </label>
);