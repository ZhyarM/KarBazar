import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Button from "../../components/btns/Button";

interface UserTopSkillsProps {
  skills: string[];
  onSave?: (skills: string[]) => Promise<void>;
  readOnly?: boolean;
}

function UserTopSkills({
  skills,
  onSave,
  readOnly = false,
}: UserTopSkillsProps) {
  const [mySkills, setMySkills] = useState<string[]>(skills);
  const [newSkill, setNewSkill] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAddSkill = async () => {
    if (newSkill.trim() && !mySkills.includes(newSkill.trim())) {
      const updatedSkills = [...mySkills, newSkill.trim()];
      setMySkills(updatedSkills);
      setNewSkill("");
      setIsAdding(false);

      if (onSave) {
        setSaving(true);
        await onSave(updatedSkills);
        setSaving(false);
      }
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const updatedSkills = mySkills.filter((s) => s !== skillToRemove);
    setMySkills(updatedSkills);

    if (onSave) {
      setSaving(true);
      await onSave(updatedSkills);
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-full p-6 bg-(--color-card) shadow-xl text-(--color-text) rounded-4xl flex flex-col gap-2 font-bold text-md">
      <div className="flex justify-between pb-2 font-extrabold gap-4 text-left">
        <div className="flex items-center">
          <p className="text-xl">Skills</p>
          {saving && (
            <span className="ml-2 text-sm text-(--color-text-muted)">
              (Saving...)
            </span>
          )}
        </div>
        {!readOnly && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="hover:text-(--color-primary) transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        )}
      </div>

      {isAdding && !readOnly && (
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
            placeholder="Enter skill..."
            className="flex-1 px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-surface) text-(--color-text) text-sm focus:outline-none focus:border-(--color-primary)"
          />
          <button
            onClick={handleAddSkill}
            className="px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:opacity-90"
          >
            Add
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {mySkills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-2 px-3 py-1 bg-(--color-surface) rounded-full text-sm"
          >
            {skill}
            {!readOnly && (
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="text-(--color-text-muted) hover:text-red-500 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xs" />
              </button>
            )}
          </span>
        ))}
      </div>

      {mySkills.length === 0 && !isAdding && !readOnly && (
        <div className="w-full border border-(--color-text-muted) flex rounded-xl border-dashed">
          <Button
            text="Add Your First Skill"
            textColor="text-indigo-700"
            bold="font-bold"
            onClick={() => setIsAdding(true)}
          />
        </div>
      )}

      {mySkills.length === 0 && readOnly && (
        <p className="text-(--color-text-muted)">No skills added</p>
      )}
    </div>
  );
}

export default UserTopSkills;
