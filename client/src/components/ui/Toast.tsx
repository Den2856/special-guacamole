import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdError, MdCheckCircle } from "react-icons/md";

type Props = { message: string; isError: boolean };

function Toast({ message, isError }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {/* контейнер не перехватывает клики, чтобы не мешать UI под ним */}
      <div className="fixed inset-x-0 bottom-6 z-[9999] flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95, rotate: -1 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.96, rotate: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className={`pointer-events-none rounded-xl px-4 py-3 shadow-xl backdrop-blur-md 
            ${isError ? "bg-error" : "bg-emerald-600/90"} 
            text-white font-semibold inline-flex items-center gap-3`}
        >
          {isError ? <MdError className="text-2xl" /> : <MdCheckCircle className="text-2xl" />}
          <p className="text-sm sm:text-base">{message}</p>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

const UnauthorizedToastHandler = ({ message, isError }: Props) => {
  return <Toast message={message} isError={isError} />;
};

export default UnauthorizedToastHandler;
