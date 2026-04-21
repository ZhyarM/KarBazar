interface SuggestionsProps {
  text: string;
  onClick?: () => void;
}

function ProgressSuggestions({ text, onClick }: SuggestionsProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl bg-white max-w-fit px-2 py-1 border border-gray-300 cursor-pointer hover:bg-gray-50 transition"
    >
      <p className="text-sm text-gray-500">{text}</p>
    </button>
  );
}

export default ProgressSuggestions;
