import { useEffect, useState } from "react";
import { FaBolt, FaSave } from "react-icons/fa";
import {
  getSettings,
  updateSettings,
} from "../services/settingsApi";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    whatsappNumber: "",
    companyPhone: "",
    companyEmail: "",
    companyAddress: "",
    businessHours: "",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    stats: {
      happyCustomers: 0,
      completedJobs: 0,
      yearsOfExperience: 0,
      areasCovered: 0,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await getSettings();
      if (res.data.success) {
        setForm(res.data.data);
      }
    } catch (err) {
      console.log(err);
      alert("Unable to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleStats = (e) => {
    setForm({
      ...form,
      stats: {
        ...form.stats,
        [e.target.name]: Number(e.target.value),
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateSettings(form);
      alert("Settings Updated Successfully");
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-yellow-400 text-xl font-bold">
          Loading Settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full mb-4">
            <FaBolt />
            ElectroFX Admin Panel
          </span>

          <h1 className="text-4xl md:text-5xl font-black text-white">
            Website <span className="text-yellow-400">Settings</span>
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Manage company details, social links and homepage statistics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Company Information */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Company Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="WhatsApp Number"
                name="whatsappNumber"
                value={form.whatsappNumber}
                onChange={handleChange}
              />

              <Input
                label="Company Phone"
                name="companyPhone"
                value={form.companyPhone}
                onChange={handleChange}
              />

              <Input
                label="Company Email"
                name="companyEmail"
                value={form.companyEmail}
                onChange={handleChange}
              />

              <Input
                label="Business Hours"
                name="businessHours"
                value={form.businessHours}
                onChange={handleChange}
              />
            </div>

            <div className="mt-6">
              <label className="text-gray-300 font-semibold block mb-2">
                Company Address
              </label>
              <textarea
                rows="3"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition"
                name="companyAddress"
                value={form.companyAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Social Media Links
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Input
                label="Facebook URL"
                name="facebookUrl"
                value={form.facebookUrl}
                onChange={handleChange}
              />

              <Input
                label="Instagram URL"
                name="instagramUrl"
                value={form.instagramUrl}
                onChange={handleChange}
              />

              <Input
                label="Twitter / X URL"
                name="twitterUrl"
                value={form.twitterUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Homepage Statistics
            </h2>

            <div className="grid md:grid-cols-4 gap-5">
              <StatInput
                label="Happy Customers"
                name="happyCustomers"
                value={form.stats.happyCustomers}
                onChange={handleStats}
              />

              <StatInput
                label="Completed Jobs"
                name="completedJobs"
                value={form.stats.completedJobs}
                onChange={handleStats}
              />

              <StatInput
                label="Experience (Years)"
                name="yearsOfExperience"
                value={form.stats.yearsOfExperience}
                onChange={handleStats}
              />

              <StatInput
                label="Areas Covered"
                name="areasCovered"
                value={form.stats.areasCovered}
                onChange={handleStats}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              disabled={saving}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-xl flex items-center gap-3 transition transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <FaSave />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-gray-300 font-semibold block mb-2">
      {label}
    </label>
    <input
      {...props}
      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition"
    />
  </div>
);

const StatInput = ({ label, ...props }) => (
  <div className="bg-slate-950 border border-slate-700 rounded-2xl p-4">
    <p className="text-gray-400 text-sm mb-2">{label}</p>
    <input
      type="number"
      {...props}
      className="w-full bg-transparent text-yellow-400 text-2xl font-bold outline-none"
    />
  </div>
);

export default AdminSettings;