import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  getAdminSettings,
  updateAdminSetting,
  type AdminSetting,
} from "../../API/AdminAPI";

function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [savingMaintenance, setSavingMaintenance] = useState(false);
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

  const maintenanceSetting = settings.find(
    (setting) => setting.key === "platform_maintenance_mode",
  );

  const isMaintenanceEnabled =
    maintenanceSetting?.type === "boolean"
      ? maintenanceSetting.value === "1" || maintenanceSetting.value === "true"
      : false;

  const toggleMaintenanceMode = async () => {
    setSavingMaintenance(true);
    try {
      await updateAdminSetting({
        key: "platform_maintenance_mode",
        value: !isMaintenanceEnabled,
        type: "boolean",
        description:
          "Blocks non-admin API requests while the platform is in maintenance mode.",
      });
      await loadSettings();
    } catch (error) {
      console.error("Failed to update maintenance mode:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update maintenance mode.",
      );
    } finally {
      setSavingMaintenance(false);
    }
  };

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

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md border border-(--color-border)">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-(--color-text)">
              Maintenance Mode
            </h3>
            <p className="text-sm text-(--color-text-muted) mt-1">
              When enabled, the backend returns 503 for non-admin requests.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isMaintenanceEnabled
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {isMaintenanceEnabled ? "Enabled" : "Disabled"}
            </span>
            <button
              type="button"
              onClick={toggleMaintenanceMode}
              disabled={savingMaintenance}
              className="px-4 py-2 rounded-md bg-(--color-primary) text-white font-semibold disabled:opacity-60"
            >
              {savingMaintenance
                ? "Updating..."
                : isMaintenanceEnabled
                  ? "Disable Maintenance"
                  : "Enable Maintenance"}
            </button>
          </div>
        </div>
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
