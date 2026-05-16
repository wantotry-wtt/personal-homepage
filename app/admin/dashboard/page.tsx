"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/providers/I18nProvider";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/admin/login");
        } else {
          alert("Failed to save data");
        }
      } else {
        alert("Data saved successfully!");
      }
    } catch (err) {
      alert("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          {t("admin.dashboard")}
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-8">
        <motion.div className="p-6 rounded-3xl glass" layout>
          <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-200">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-zinc-600 dark:text-zinc-400">Name</label>
              <input
                type="text"
                value={data.profile.name}
                onChange={(e) => setData({ ...data, profile: { ...data.profile, name: e.target.value } })}
                className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 outline-none border border-transparent focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-zinc-600 dark:text-zinc-400">Bio</label>
              <textarea
                value={data.profile.bio}
                onChange={(e) => setData({ ...data, profile: { ...data.profile, bio: e.target.value } })}
                className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 outline-none border border-transparent focus:border-blue-500"
                rows={3}
              />
            </div>
          </div>
        </motion.div>

        <motion.div className="p-6 rounded-3xl glass" layout>
          <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-200">Cards (Raw JSON)</h2>
          <p className="text-sm text-zinc-500 mb-4">Edit the raw JSON data for the bento grid cards below.</p>
          <textarea
            value={JSON.stringify(data.cards, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setData({ ...data, cards: parsed });
              } catch (err) {
                // Ignore parse errors while typing
              }
            }}
            className="w-full h-96 px-4 py-3 rounded-xl bg-black/90 text-green-400 font-mono text-sm outline-none"
          />
        </motion.div>
      </div>
    </div>
  );
}
