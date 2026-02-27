import { useEffect } from "react";

interface ToastMessageProps {
  message: string | null;
  success: boolean | null;
  onClose: () => void;
  duration?: number; // default 2000ms
  visible: boolean;
}

const MessageToast = ({
  message,
  success,
  onClose,
  visible = true,
  duration = 2000,
}: ToastMessageProps) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message || !visible) return null;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        px-4 py-2 rounded-md text-white text-sm
        transition-opacity duration-300
        ${success ? "bg-green-600" : "bg-red-600"}
      `}
    >
      {message}
    </div>
  );
};

export default MessageToast;
