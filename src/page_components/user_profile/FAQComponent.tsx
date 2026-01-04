import FAQitem from "./../../utils/FAQ.ts";

function UserFAQ() {
  return (
    <>
      <div className="flex flex-col items-start gap-2 px-2">
        <h1 className="subsection-title text-(--color-text) mb-1.5">
          Frequently Asked question
        </h1>
        {FAQitem.map((item) => (
          <div
            key={item.id}
            className="w-full flex flex-col gap-2 border-b-2 border-b-(--color-border) p-2 hover:bg-(--color-bg-muted) rounded-md"
          >
            <h2 className="text-(--color-text) text-lg font-bold">
              {item.question}
            </h2>
            <span className="text-(--color-text-muted) text-md">
              {item.answer}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default UserFAQ;
