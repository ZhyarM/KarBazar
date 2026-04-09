import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  getAdminSettings,
  updateAdminSetting,
  type AdminSetting,
} from "../../API/AdminAPI";
import { useLanguage } from "../../context/LanguageContext";

function AdminSettingsPage() {
  const { t } = useLanguage();
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
        description: t("admin.settings.maintenanceDescription"),
      });
      await loadSettings();
    } catch (error) {
      console.error("Failed to update maintenance mode:", error);
      alert(
        error instanceof Error
          ? error.message
          : t("admin.settings.updateMaintenanceFailed"),
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
        alert(t("admin.settings.invalidJson"));
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
      alert(
        error instanceof Error ? error.message : t("admin.settings.saveFailed"),
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-(--color-text)">
          {t("admin.settings.title")}
        </h2>
        <p className="text-(--color-text-muted) mt-2">
          {t("admin.settings.subtitle")}
        </p>
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md border border-(--color-border)">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-(--color-text)">
              {t("admin.settings.maintenanceTitle")}
            </h3>
            <p className="text-sm text-(--color-text-muted) mt-1">
              {t("admin.settings.maintenanceDescription")}
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
              {isMaintenanceEnabled
                ? t("admin.settings.enabled")
                : t("admin.settings.disabled")}
            </span>
            <button
              type="button"
              onClick={toggleMaintenanceMode}
              disabled={savingMaintenance}
              className="px-4 py-2 rounded-md bg-(--color-primary) text-white font-semibold disabled:opacity-60"
            >
              {savingMaintenance
                ? t("admin.settings.updating")
                : isMaintenanceEnabled
                  ? t("admin.settings.disableMaintenance")
                  : t("admin.settings.enableMaintenance")}
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
            placeholder={t("admin.settings.keyPlaceholder")}
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
            placeholder={t("admin.settings.valuePlaceholder")}
            className={`${fieldClassName} md:col-span-2`}
            required
          />
          <input
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder={t("admin.settings.descriptionPlaceholder")}
            className={`${fieldClassName} md:col-span-2`}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-(--color-primary) text-white font-semibold md:col-span-2"
          >
            {t("admin.settings.save")}
          </button>
        </form>
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-(--color-text) mb-4">
          {t("admin.settings.existing")}
        </h3>
        <div className="space-y-2">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="border border-(--color-border) rounded-md p-3 bg-(--color-bg)"
            >
              <p className="font-semibold text-(--color-text)">{setting.key}</p>
              <p className="text-sm text-(--color-text-muted)">
                {t("admin.settings.type")}: {setting.type} |{" "}
                {t("admin.settings.value")}: {String(setting.value)}
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
