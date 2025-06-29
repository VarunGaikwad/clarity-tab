import React, { ReactNode, useRef } from "react";
import { IoMdClose } from "react-icons/io";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  title?: string;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  title = "",
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  return (
    <dialog
      ref={dialogRef}
      open={isOpen}
      style={{
        width: "25%",
        position: "fixed",
        top: "50%",
        transform: "translate(0%, -50%)",
      }}
      className={`bg-black text-white bg-opacity-95 rounded-lg shadow-lg ${className}`}
    >
      <div className="flex justify-between p-4 pb-0">
        <span>{title}</span>
        <IoMdClose
          onClick={onClose}
          className="size-5 cursor-pointer hover:scale-125 transform-transition ease-in-out duration-300"
        />
      </div>
      <div className="px-5 py-2">{children}</div>
    </dialog>
  );
};

export default Dialog;
