import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  getAdminSettings,
  updateAdminSetting,
  type AdminSetting,
} from "../../API/AdminAPI";

function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [form, setForm] = useState({
    key: "",
    value: "",
    type: "string" as "string" | "number" | "boolean" | "json",
    description: "",
  });

  const fieldClassName =
    "px-3 py-2 rounded-md border border-(--color-border) bg-(--color-bg) text-(--color-text) placeholder:text-(--color-text-muted)";

  const loadSettings = async () => {
    try {
      const data = await getAdminSettings();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    let value: string | number | boolean | Record<string, unknown> = form.value;

    if (form.type === "number") {
      value = Number(form.value);
    }

    if (form.type === "boolean") {
      value = form.value === "true" || form.value === "1";
    }

    if (form.type === "json") {
      try {
        value = JSON.parse(form.value);
      } catch {
        alert("Invalid JSON format.");
        return;
      }
    }

    try {
      await updateAdminSetting({
        key: form.key,
        value,
        type: form.type,
        description: form.description || undefined,
      });
      setForm({ key: "", value: "", type: "string", description: "" });
      await loadSettings();
    } catch (error) {
      console.error("Failed to save setting:", error);
      alert(error instanceof Error ? error.message : "Failed to save setting.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-(--color-text)">
          Configure Platform Settings
        </h2>
        <p className="text-(--color-text-muted) mt-2">
          Manage global platform behavior. Keep the platform free by avoiding
          payment-related settings.
        </p>
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <input
            value={form.key}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, key: e.target.value }))
            }
            placeholder="setting_key"
            className={fieldClassName}
            required
          />
          <select
            value={form.type}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                type: e.target.value as
                  | "string"
                  | "number"
                  | "boolean"
                  | "json",
              }))
            }
            className={fieldClassName}
          >
            <option value="string">string</option>
            <option value="number">number</option>
            <option value="boolean">boolean</option>
            <option value="json">json</option>
          </select>
          <input
            value={form.value}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, value: e.target.value }))
            }
            placeholder="value"
            className={`${fieldClassName} md:col-span-2`}
            required
          />
          <input
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="description (optional)"
            className={`${fieldClassName} md:col-span-2`}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-(--color-primary) text-white font-semibold md:col-span-2"
          >
            Save Setting
          </button>
        </form>
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-(--color-text) mb-4">
          Existing Settings
        </h3>
        <div className="space-y-2">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="border border-(--color-border) rounded-md p-3 bg-(--color-bg)"
            >
              <p className="font-semibold text-(--color-text)">{setting.key}</p>
              <p className="text-sm text-(--color-text-muted)">
                Type: {setting.type} | Value: {String(setting.value)}
              </p>
              {setting.description && (
                <p className="text-sm text-(--color-text-muted)">
                  {setting.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminSettingsPage;
