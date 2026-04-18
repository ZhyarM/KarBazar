import {
  faAdd,
  faBriefcase,
  faTimes,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/btns/Button";
import { useState } from "react";
import type { WorkExperience } from "../../API/ProfileAPI";

interface UserWorkExperienceProps {
  experience?: WorkExperience[];
  onSave?: (experience: WorkExperience[]) => Promise<void>;
}

function UserWorkExperience({
  experience = [],
  onSave,
}: UserWorkExperienceProps) {
  const [myExperience, setMyExperience] =
    useState<WorkExperience[]>(experience);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newExp, setNewExp] = useState<WorkExperience>({
    company: "",
    position: "",
    start_date: "",
    end_date: "",
    current: false,
    description: "",
  });

  const handleAddExperience = async () => {
    if (newExp.company && newExp.position) {
      const updatedExperience = [
        ...myExperience,
        { ...newExp, id: Date.now() },
      ];
      setMyExperience(updatedExperience);
      setNewExp({
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        current: false,
        description: "",
      });
      setIsAdding(false);

      if (onSave) {
        setSaving(true);
        await onSave(updatedExperience);
        setSaving(false);
      }
    }
  };

  const handleRemoveExperience = async (expId: number | undefined) => {
    const updatedExperience = myExperience.filter((e) => e.id !== expId);
    setMyExperience(updatedExperience);

    if (onSave) {
      setSaving(true);
      await onSave(updatedExperience);
      setSaving(false);
    }
  };

  return (
    <div className="rounded-4xl shadow-2xl bg-(--color-card)">
      <div className="rounded-4xl p-4 flex justify-between items-center">
        <div>
          <h1 className="font-extrabold text-(--color-text) text-3xl">
            Work Experience
          </h1>
          <p className="text-(--color-text-muted)">
            Your professional journey
            {saving && <span className="ml-2">(Saving...)</span>}
          </p>
        </div>

        <div>
          <Button
            bgColor="bg-indigo-200 font-bold"
            text="Add Experience"
            icon={<FontAwesomeIcon icon={faAdd} />}
            textColor="text-indigo-700"
            onClick={() => setIsAdding(!isAdding)}
          />
        </div>
      </div>

      {/* Add Experience Form */}
      {isAdding && (
        <div className="px-4 pb-4">
          <div className="p-4 bg-(--color-surface) rounded-xl space-y-3">
            <input
              type="text"
              placeholder="Company Name"
              value={newExp.company}
              onChange={(e) =>
                setNewExp({ ...newExp, company: e.target.value })
              }
              className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm"
            />
            <input
              type="text"
              placeholder="Position / Job Title"
              value={newExp.position}
              onChange={(e) =>
                setNewExp({ ...newExp, position: e.target.value })
              }
              className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-(--color-text-muted)">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newExp.start_date}
                  onChange={(e) =>
                    setNewExp({ ...newExp, start_date: e.target.value })
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
                  value={newExp.end_date || ""}
                  disabled={newExp.current}
                  onChange={(e) =>
                    setNewExp({ ...newExp, end_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm disabled:opacity-50"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-(--color-text)">
              <input
                type="checkbox"
                checked={newExp.current}
                onChange={(e) =>
                  setNewExp({
                    ...newExp,
                    current: e.target.checked,
                    end_date: "",
                  })
                }
                className="rounded"
              />
              I currently work here
            </label>
            <textarea
              placeholder="Description (optional)"
              value={newExp.description || ""}
              onChange={(e) =>
                setNewExp({ ...newExp, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm resize-none h-20"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddExperience}
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
          className={`${myExperience.length > 0 ? "" : "border-dashed"} border-2 border-blue-300 hover:border-blue-500 rounded-2xl min-h-60`}
        >
          {myExperience.length > 0 ? (
            <div className="p-4 space-y-4">
              {myExperience.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-start justify-between gap-2 p-4 bg-(--color-surface) rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faBriefcase}
                        className="text-indigo-600"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-(--color-text)">
                        {exp.position}
                      </p>
                      <p className="text-sm text-(--color-text-muted)">
                        {exp.company}
                      </p>
                      <p className="text-xs text-(--color-text-muted)">
                        {exp.start_date &&
                          new Date(exp.start_date).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        {" - "}
                        {exp.current
                          ? "Present"
                          : exp.end_date &&
                            new Date(exp.end_date).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-(--color-text) mt-2">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="text-(--color-text-muted) hover:text-red-500"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center flex-col gap-4">
              <h1 className="font-extrabold text-(--color-text) text-2xl leading-relaxed">
                Your story starts here
              </h1>
              <p className="w-3/4 text-center text-(--color-text-muted) text-sm font-semibold">
                Add your work experience to build credibility
              </p>
              <Button
                text="Add your first experience"
                textColor="text-xl text-indigo-700"
                onClick={() => setIsAdding(true)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserWorkExperience;
