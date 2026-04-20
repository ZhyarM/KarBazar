import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  createAdminAccount,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
  type AdminUser,
} from "../../API/AdminAPI";
import { useLanguage } from "../../context/LanguageContext";

function AdminUsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "client" | "freelancer" | "admin"
  >("all");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const fieldClassName =
    "px-3 py-2 rounded-md border border-(--color-border) bg-(--color-bg) text-(--color-text) placeholder:text-(--color-text-muted)";

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getAdminUsers({
        search: search || undefined,
        role: roleFilter === "all" ? undefined : roleFilter,
        per_page: 50,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to load admin users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateAdmin = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await createAdminAccount(form);
      setForm({ name: "", email: "", password: "", password_confirmation: "" });
      await loadUsers();
    } catch (error) {
      console.error("Failed to create admin:", error);
      alert(
        error instanceof Error ? error.message : t("admin.users.actionFailed"),
      );
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    try {
      await updateAdminUserStatus(user.id, !user.is_active);
      await loadUsers();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(
        error instanceof Error ? error.message : t("admin.users.actionFailed"),
      );
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const confirmed = window.confirm(t("admin.users.confirmDelete"));
    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminUser(userId);
      await loadUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert(
        error instanceof Error ? error.message : t("admin.users.actionFailed"),
      );
    }
  };

  const handleRoleChange = async (
    user: AdminUser,
    role: "client" | "freelancer" | "admin",
  ) => {
    if (role === user.role) {
      return;
    }

    try {
      await updateAdminUserRole(user.id, role);
      await loadUsers();
    } catch (error) {
      console.error("Failed to update user role:", error);
      alert(
        error instanceof Error ? error.message : t("admin.users.actionFailed"),
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-(--color-text) mb-4">
          {t("admin.users.createAdmin")}
        </h2>
        <form
          onSubmit={handleCreateAdmin}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder={t("admin.users.name")}
            className="px-4 py-2 rounded-md border border-(--color-border) bg-(--color-bg) text-(--color-text)"
            required
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder={t("admin.users.email")}
            className="px-4 py-2 rounded-md border border-(--color-border) bg-(--color-bg) text-(--color-text)"
            required
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder={t("admin.users.password")}
            className="px-4 py-2 rounded-md border border-(--color-border) bg-(--color-bg) text-(--color-text)"
            required
          />
          <input
            type="password"
            value={form.password_confirmation}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                password_confirmation: e.target.value,
              }))
            }
            placeholder={t("admin.users.confirmPassword")}
            className="px-4 py-2 rounded-md border border-(--color-border) bg-(--color-bg) text-(--color-text)"
            required
          />

          <button
            type="submit"
            className="md:col-span-2 px-4 py-2 rounded-md bg-(--color-primary) text-white font-semibold hover:opacity-90 transition-opacity"
          >
            {t("admin.users.createAdmin")}
          </button>
        </form>
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-bold text-(--color-text)">
            {t("admin.users.title")}
          </h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("admin.users.search")}
              className={fieldClassName}
            />
            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(
                  e.target.value as "all" | "client" | "freelancer" | "admin",
                )
              }
              className={fieldClassName}
            >
              <option value="all">{t("admin.users.filterAll")}</option>
              <option value="client">{t("admin.users.filterClient")}</option>
              <option value="freelancer">
                {t("admin.users.filterBusiness")}
              </option>
              <option value="admin">{t("admin.users.filterAdmin")}</option>
            </select>
            <button
              type="button"
              onClick={loadUsers}
              className="px-4 py-2 rounded-md bg-(--color-bg) border border-(--color-border) text-(--color-text) font-semibold"
            >
              {t("admin.users.apply")}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-(--color-primary)"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-(--color-text-muted) border-b border-(--color-border)">
                  <th className="py-3">{t("admin.users.name")}</th>
                  <th className="py-3">{t("admin.users.email")}</th>
                  <th className="py-3">{t("admin.users.role")}</th>
                  <th className="py-3">{t("admin.users.status")}</th>
                  <th className="py-3">{t("admin.users.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-(--color-border) text-(--color-text)"
                  >
                    <td className="py-3">{user.name}</td>
                    <td className="py-3">{user.email}</td>
                    <td className="py-3">
                      <p className="text-xs text-(--color-text-muted) capitalize mb-1">
                        Current: {user.role}
                      </p>
                      <select
                        value={
                          user.role === "business" ? "freelancer" : user.role
                        }
                        onChange={(e) =>
                          handleRoleChange(
                            user,
                            e.target.value as "client" | "freelancer" | "admin",
                          )
                        }
                        className="px-2 py-1 rounded-md border border-(--color-border) bg-(--color-bg) text-(--color-text) text-sm"
                      >
                        <option value="client">Client</option>
                        <option value="freelancer">Business</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.is_active
                          ? t("admin.users.active")
                          : t("admin.users.inactive")}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user)}
                          className="px-3 py-1 rounded-md bg-(--color-bg) border border-(--color-border) text-sm"
                        >
                          {user.is_active
                            ? t("admin.users.deactivate")
                            : t("admin.users.activate")}
                        </button>
                        {user.role !== "admin" && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-3 py-1 rounded-md bg-red-500/10 text-red-600 border border-red-500/20 text-sm"
                          >
                            {t("admin.users.delete")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;
