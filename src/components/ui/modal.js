"use client";
import React, { useState, useEffect } from 'react';

/**
 * The core wrapper for all Modals.
 * Manages the background overlay blur, the standard white box UI layout, scroll handling, and the header.
 */
export function BaseModal({ isOpen, title, maxWidth = "max-w-md", children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`bg-white rounded-lg shadow-xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col`}>
        {title && (
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{title}</h3>
            </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Used extensively throughout the Student Notes Explorer.
 * Contains purely one input field to dynamically create/rename folders and files quickly.
 */
export function SingleInputModal({ isOpen, onClose, onSubmit, title, label, placeholder, submitText, initialValue = "" }) {
  const [inputValue, setInputValue] = useState(initialValue);

  // Update input cleanly when rendering
  useEffect(() => {
    if (isOpen) setInputValue(initialValue);
  }, [isOpen, initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;
    onSubmit(inputValue);
    setInputValue("");
  };

  const handleCancel = () => {
    setInputValue(initialValue);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} title={title} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        <input
          type="text"
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2ba5c7] focus:border-transparent transition-all text-gray-800"
          placeholder={placeholder}
        />
        
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-transparent">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={inputValue.trim() === ""}
            className="px-4 py-2 text-sm font-bold text-white bg-[#2ba5c7] rounded-md hover:bg-[#228b9e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {submitText}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

/**
 * A standard confirmation modal executing two-phase permanent commit checks!
 * Useful for AWS S3 file deletions and Drag-and-drop structural moves.
 */
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", isDanger = false, showCancel = true }) {
  return (
    <BaseModal isOpen={isOpen} title={title} maxWidth="max-w-md">
      <p className="text-gray-700 text-sm font-medium">{message}</p>
      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-transparent">
        {showCancel && (
            <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
        )}
        <button 
            type="button" 
            onClick={onConfirm} 
            className={`px-4 py-2 text-sm font-bold text-white rounded-md transition-colors shadow-sm ${isDanger ? "bg-red-600 hover:bg-red-700" : "bg-[#2ba5c7] hover:bg-[#228b9e]"}`}
        >
          {confirmText}
        </button>
      </div>
    </BaseModal>
  );
}
