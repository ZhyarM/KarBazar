import {
  faGraduationCap,
  faPlus,
  faTimes,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/btns/Button";
import { useState } from "react";
import type { Education } from "../../API/ProfileAPI";

interface UserEducationProps {
  education?: Education[];
  onSave?: (education: Education[]) => Promise<void>;
  readOnly?: boolean;
}

function UserEducation({
  education = [],
  onSave,
  readOnly = false,
}: UserEducationProps) {
  const [myEducation, setMyEducation] = useState<Education[]>(education);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newEdu, setNewEdu] = useState<Education>({
    institution: "",
    degree: "",
    field: "",
    start_date: "",
    end_date: "",
    current: false,
    description: "",
  });

  const handleAddEducation = async () => {
    if (newEdu.institution && newEdu.degree && newEdu.field) {
      const updatedEducation = [...myEducation, { ...newEdu, id: Date.now() }];
      setMyEducation(updatedEducation);
      setNewEdu({
        institution: "",
        degree: "",
        field: "",
        start_date: "",
        end_date: "",
        current: false,
        description: "",
      });
      setIsAdding(false);

      if (onSave) {
        setSaving(true);
        await onSave(updatedEducation);
        setSaving(false);
      }
    }
  };

  const handleRemoveEducation = async (eduId: number | undefined) => {
    const updatedEducation = myEducation.filter((e) => e.id !== eduId);
    setMyEducation(updatedEducation);

    if (onSave) {
      setSaving(true);
      await onSave(updatedEducation);
      setSaving(false);
    }
  };

  return (
    <div className="rounded-4xl shadow-2xl bg-(--color-card)">
      <div className="rounded-4xl p-4 flex justify-between items-center">
        <div>
          <h1 className="font-extrabold text-(--color-text) text-3xl flex items-center gap-3">
            <FontAwesomeIcon
              icon={faGraduationCap}
              className="text-indigo-600"
            />
            Education
          </h1>
          <p className="text-(--color-text-muted)">
            Your academic background
            {saving && <span className="ml-2">(Saving...)</span>}
          </p>
        </div>

        {!readOnly && (
          <div>
            <Button
              bgColor="bg-indigo-200 font-bold"
              text="Add Education"
              icon={<FontAwesomeIcon icon={faPlus} />}
              textColor="text-indigo-700"
              onClick={() => setIsAdding(!isAdding)}
            />
          </div>
        )}
      </div>

      {/* Add Education Form */}
      {isAdding && !readOnly && (
        <div className="px-4 pb-4">
          <div className="p-4 bg-(--color-surface) rounded-xl space-y-3">
            <input
              type="text"
              placeholder="Institution / University"
              value={newEdu.institution}
              onChange={(e) =>
                setNewEdu({ ...newEdu, institution: e.target.value })
              }
              className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm focus:outline-none focus:border-(--color-primary)"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Degree (e.g., Bachelor's)"
                value={newEdu.degree}
                onChange={(e) =>
                  setNewEdu({ ...newEdu, degree: e.target.value })
                }
                className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm focus:outline-none focus:border-(--color-primary)"
              />
              <input
                type="text"
                placeholder="Field of Study"
                value={newEdu.field}
                onChange={(e) =>
                  setNewEdu({ ...newEdu, field: e.target.value })
                }
                className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm focus:outline-none focus:border-(--color-primary)"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-(--color-text-muted)">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newEdu.start_date}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, start_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-(--color-text-muted)">
                  End Date
                </label>
                <input
                  type="date"
                  value={newEdu.end_date || ""}
                  disabled={newEdu.current}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, end_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm disabled:opacity-50"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-(--color-text)">
              <input
                type="checkbox"
                checked={newEdu.current}
                onChange={(e) =>
                  setNewEdu({
                    ...newEdu,
                    current: e.target.checked,
                    end_date: "",
                  })
                }
                className="rounded"
              />
              Currently studying here
            </label>
            <textarea
              placeholder="Description (optional)"
              value={newEdu.description || ""}
              onChange={(e) =>
                setNewEdu({ ...newEdu, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm resize-none h-20"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddEducation}
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

      <div className="p-4">
        <div
          className={`${myEducation.length > 0 ? "" : "border-dashed"} border-2 border-blue-300 hover:border-blue-500 rounded-2xl min-h-60`}
        >
          {myEducation.length > 0 ? (
            <div className="p-4 space-y-4">
              {myEducation.map((edu) => (
                <div
                  key={edu.id}
                  className="flex items-start justify-between gap-2 p-4 bg-(--color-surface) rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                      <FontAwesomeIcon
                        icon={faGraduationCap}
                        className="text-indigo-600"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-(--color-text)">
                        {edu.degree} in {edu.field}
                      </p>
                      <p className="text-sm text-(--color-text-muted)">
                        {edu.institution}
                      </p>
                      <p className="text-xs text-(--color-text-muted)">
                        {edu.start_date &&
                          new Date(edu.start_date).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        {" - "}
                        {edu.current
                          ? "Present"
                          : edu.end_date &&
                            new Date(edu.end_date).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                      </p>
                      {edu.description && (
                        <p className="text-sm text-(--color-text) mt-2">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {!readOnly && (
                    <button
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="text-(--color-text-muted) hover:text-red-500"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center flex-col gap-4">
              <div className="text-indigo-500 bg-indigo-100 h-14 w-14 flex items-center justify-center rounded-2xl">
                <FontAwesomeIcon icon={faGraduationCap} className="text-3xl" />
              </div>
              <h1 className="font-extrabold text-(--color-text) text-2xl leading-relaxed">
                {readOnly ? "No education added" : "Add your education"}
              </h1>
              <p className="w-3/4 text-center text-(--color-text-muted) text-sm font-semibold">
                {readOnly
                  ? ""
                  : "Showcase your academic background to build trust with clients"}
              </p>
              {!readOnly && (
                <Button
                  text="Add your first education"
                  textColor="text-xl text-indigo-700"
                  onClick={() => setIsAdding(true)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserEducation;
