import {
  faAward,
  faPlus,
  faTimes,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/btns/Button";
import { useState } from "react";
import type { Certification } from "../../API/ProfileAPI";

interface UserCertificationProps {
  certifications?: Certification[];
  onSave?: (certifications: Certification[]) => Promise<void>;
  readOnly?: boolean;
}

function UserCertification({
  certifications = [],
  onSave,
  readOnly = false,
}: UserCertificationProps) {
  const [myCerts, setMyCerts] = useState<Certification[]>(certifications);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCert, setNewCert] = useState<Certification>({
    name: "",
    issuer: "",
    issue_date: "",
    credential_url: "",
  });

  const handleAddCertification = async () => {
    if (newCert.name && newCert.issuer) {
      const updatedCerts = [...myCerts, { ...newCert, id: Date.now() }];
      setMyCerts(updatedCerts);
      setNewCert({ name: "", issuer: "", issue_date: "", credential_url: "" });
      setIsAdding(false);

      if (onSave) {
        setSaving(true);
        await onSave(updatedCerts);
        setSaving(false);
      }
    }
  };

  const handleRemoveCertification = async (certId: number | undefined) => {
    const updatedCerts = myCerts.filter((c) => c.id !== certId);
    setMyCerts(updatedCerts);

    if (onSave) {
      setSaving(true);
      await onSave(updatedCerts);
      setSaving(false);
    }
  };

  return (
    <div className="rounded-4xl shadow-2xl bg-(--color-card) w-full h-full flex flex-col">
      {/* Header */}
      <div className="rounded-t-4xl p-4 sm:p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faAward}
            className="text-lg sm:text-xl text-indigo-700"
          />
          <h1 className="font-extrabold text-(--color-text) text-lg sm:text-xl">
            Certifications
          </h1>
          {saving && (
            <span className="text-sm text-(--color-text-muted) font-normal">
              (Saving...)
            </span>
          )}
        </div>

        {!readOnly && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex justify-center items-center gap-1 hover:opacity-75 transition-opacity"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs sm:text-sm" />
            <p className="font-extrabold text-sm sm:text-base">Add</p>
          </button>
        )}
      </div>

      {/* Add Certification Form */}
      {isAdding && !readOnly && (
        <div className="px-4 pb-4">
          <div className="p-4 bg-(--color-surface) rounded-xl space-y-3">
            <input
              type="text"
              placeholder="Certification Name"
              value={newCert.name}
              onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
              className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm"
            />
            <input
              type="text"
              placeholder="Issuing Organization"
              value={newCert.issuer}
              onChange={(e) =>
                setNewCert({ ...newCert, issuer: e.target.value })
              }
              className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm"
            />
            <input
              type="date"
              placeholder="Issue Date"
              value={newCert.issue_date}
              onChange={(e) =>
                setNewCert({ ...newCert, issue_date: e.target.value })
              }
              className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm"
            />
            <input
              type="url"
              placeholder="Credential URL (optional)"
              value={newCert.credential_url || ""}
              onChange={(e) =>
                setNewCert({ ...newCert, credential_url: e.target.value })
              }
              className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCertification}
                className="flex-1 px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faSave} />
                Save
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:opacity-90"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Body */}
      <div className="p-4 h-full flex-1">
        <div
          className={`${
            myCerts.length > 0 ? "" : "border-dashed"
          } border-2 border-blue-300 hover:border-blue-500 rounded-2xl w-full h-full min-h-[200px] transition-colors duration-300`}
        >
          {myCerts.length > 0 ? (
            <div className="p-4 sm:p-6 space-y-3">
              {myCerts.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-start justify-between gap-2 p-3 bg-(--color-surface) rounded-xl"
                >
                  <div className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faAward}
                      className="mt-1 text-indigo-500"
                    />
                    <div>
                      <p className="font-semibold text-(--color-text)">
                        {cert.name}
                      </p>
                      <p className="text-sm text-(--color-text-muted)">
                        {cert.issuer}
                      </p>
                      {cert.issue_date && (
                        <p className="text-xs text-(--color-text-muted)">
                          Issued:{" "}
                          {new Date(cert.issue_date).toLocaleDateString()}
                        </p>
                      )}
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-500 hover:underline"
                        >
                          View Credential
                        </a>
                      )}
                    </div>
                  </div>
                  {!readOnly && (
                    <button
                      onClick={() => handleRemoveCertification(cert.id)}
                      className="text-(--color-text-muted) hover:text-red-500"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="h-full py-8 sm:py-12 flex items-center justify-center flex-col gap-4 text-center">
              <div className="text-indigo-500 h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-2xl bg-indigo-50/50">
                <FontAwesomeIcon
                  icon={faAward}
                  className="text-2xl sm:text-3xl"
                />
              </div>

              <h1 className="w-4/5 sm:w-3/4 text-center text-(--color-text-muted) text-xs sm:text-sm font-semibold">
                Add certificates to boost credibility
              </h1>

              <div className="text-xs sm:text-sm scale-90 sm:scale-100">
                <Button
                  text="Add Certifications"
                  textColor="text-base sm:text-xl text-indigo-500"
                  onClick={() => setIsAdding(true)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserCertification;
