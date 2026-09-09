"use client";

import Portal from "@/components/Tasks/Portal";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmationModal({ isOpen, onClose, onConfirm }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      {/* Overlay covers the entire screen */}
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Modal Box */}
        <div 
          className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the box
        >
          <h2 className="text-xl font-semibold text-gray-900">Are you sure?</h2>
          <p className="mt-2 text-sm text-gray-500">
            This action cannot be undone. Please confirm to proceed.
          </p>
          
          <div className="mt-6 flex justify-end gap-3">
            <button 
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
