import {
  faTrash,
  faTimes,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../../API/ProfileAPI";
import { useLanguage } from "../../context/LanguageContext";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (confirmText !== "DELETE") {
      setError(t("deleteAccount.confirmError"));
      return;
    }

    try {
      setLoading(true);
      await deleteAccount(password);

      // Clear auth data and redirect
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      navigate("/", { replace: true });
      window.location.reload();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t("deleteAccount.failed");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setConfirmText("");
    setError(null);
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-(--color-card) rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-(--color-border)">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faTrash} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-600">{t("deleteAccount.title")}</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-(--color-surface) transition-colors text-(--color-text-muted)"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {step === 1 ? (
          /* Step 1: Warning */
          <div className="p-6 space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-red-500 mt-0.5"
                />
                <div>
                  <h3 className="font-bold text-red-700 mb-1">
                    {t("deleteAccount.irreversible")}
                  </h3>
                  <p className="text-sm text-red-600">
                    {t("deleteAccount.removeIntro")}
                  </p>
                  <ul className="text-sm text-red-600 mt-2 ml-4 list-disc space-y-1">
                    <li>{t("deleteAccount.remove.profile")}</li>
                    <li>{t("deleteAccount.remove.gigs")}</li>
                    <li>{t("deleteAccount.remove.orders")}</li>
                    <li>{t("deleteAccount.remove.messages")}</li>
                    <li>{t("deleteAccount.remove.reviews")}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 bg-(--color-surface) text-(--color-text) rounded-xl font-bold hover:bg-(--color-border) transition-colors"
              >
                {t("deleteAccount.cancel")}
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                {t("deleteAccount.continue")}
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Confirm with password */
          <form onSubmit={handleDelete} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-(--color-text) mb-1">
                {t("deleteAccount.passwordLabel")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-(--color-border) rounded-xl bg-(--color-surface) text-(--color-text) focus:outline-none focus:border-red-500"
                placeholder={t("deleteAccount.passwordPlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-(--color-text) mb-1">
                {t("deleteAccount.confirmLabel")} <span className="text-red-600 font-bold">DELETE</span>
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                required
                className="w-full px-4 py-3 border border-(--color-border) rounded-xl bg-(--color-surface) text-(--color-text) focus:outline-none focus:border-red-500"
                placeholder={t("deleteAccount.confirmPlaceholder")}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-(--color-surface) text-(--color-text) rounded-xl font-bold hover:bg-(--color-border) transition-colors"
              >
                {t("deleteAccount.back")}
              </button>
              <button
                type="submit"
                disabled={loading || confirmText !== "DELETE"}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faTrash} />
                {loading ? t("deleteAccount.deleting") : t("deleteAccount.deleteForever")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default DeleteAccountModal;
