"use client";
import { API_URL } from "@/config";
import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

// --- MODAL COMPONENTS ---
export function GenericModal({ isOpen, onClose, onSubmit, title, label, placeholder, submitText, initialValue = "" }) {
  const [inputValue, setInputValue] = React.useState(initialValue);

  // Update input carefully whenever it surfaces
  React.useEffect(() => {
    if (isOpen) setInputValue(initialValue);
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
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
          
          <div className="mt-6 flex justify-end gap-3">
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
      </div>
    </div>
  );
}

export function CreateFolderModal({ isOpen, onClose, onSubmit }) {
  return (
    <GenericModal 
      isOpen={isOpen} 
      onClose={onClose} 
      onSubmit={onSubmit} 
      title="Create New Folder"
      label="Folder Name"
      placeholder="e.g. Physics 101"
      submitText="Create"
    />
  );
}

export function RenameModal({ isOpen, onClose, onSubmit, initialValue }) {
  return (
    <GenericModal 
      isOpen={isOpen} 
      onClose={onClose} 
      onSubmit={onSubmit} 
      title="Rename Item"
      label="New Title"
      placeholder="Type a new name..."
      submitText="Save Changes"
      initialValue={initialValue}
    />
  );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-700 text-sm font-medium">{message}</p>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button type="button" onClick={onConfirm} className="px-4 py-2 text-sm font-bold text-white bg-[#2ba5c7] rounded-md hover:bg-[#228b9e] transition-colors shadow-sm">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CARD COMPONENTS ---
export function FolderCard({ label, onClick, onContextMenu, draggable, onDragStart, onDragOver, onDragLeave, onDrop }) {
  const displayLabel = label && label.length > 20 
    ? label.substring(0, 20) + "..." 
    : label;

  return (
    <div 
      onClick={onClick} 
      onContextMenu={onContextMenu} 
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-transform w-[90px]`}
    >
      <Image 
        src="/images/folder.png" 
        alt="Folder Icon"
        width={72} 
        height={72} 
        className="object-contain drop-shadow-sm pointer-events-none"
      />
      <span className="text-[14px] font-medium text-gray-800 text-center select-none pointer-events-none" title={label}>
        {displayLabel}
      </span>
    </div>
  );
}

export function FileCard({ label, onClick, onContextMenu, draggable, onDragStart }) {
  const displayLabel = label && label.length > 20 
    ? label.substring(0, 20) + "..." 
    : label;

  return (
    <div 
      onClick={onClick} 
      onContextMenu={onContextMenu} 
      draggable={draggable}
      onDragStart={onDragStart}
      className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-transform w-[90px]"
    >
      <Image 
        src="/images/file (1).png" 
        alt="File Icon"
        width={72} 
        height={72} 
        className="object-contain drop-shadow-sm pointer-events-none"
      />
      <span className="text-[14px] font-medium text-gray-800 text-center select-none pointer-events-none" title={label}>
        {displayLabel}
      </span>
    </div>
  );
}

export function AddFolderButton({ onClick }) {
  return (
    <div onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-transform w-[90px]">
      <Image 
        src="/images/add-folder.png" 
        alt="Add Folder"
        width={72} 
        height={72} 
        className="object-contain"
      />
      {/* Empty span to maintain exact height alignment with actual folders */}
      <span className="text-[14px] text-transparent select-none">&nbsp;</span>
    </div>
  );
}

export function AddFileButton({ onClick }) {
  return (
    <div onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-transform w-[90px]">
      <Image 
        src="/images/add-file.png" 
        alt="Add File"
        width={72} 
        height={72} 
        className="object-contain"
      />
      {/* Empty span to maintain exact height alignment with actual folders */}
      <span className="text-[14px] text-transparent select-none">&nbsp;</span>
    </div>
  );
}

// --- API HANDLER FUNCTIONS ---

/**
 * Sends a request to backend to create a new Folder
 * @param {Object} currentUser - The logged in user object, used to attach ownership to the new folder
 * @param {string} folderName - The name of the folder trying to be created
 * @param {number|null} parentFolderId - Optional: the folder this folder will belong to
 * @param {Function} setFolders - The React hook setter to update the frontend state seamlessly
 */
export async function handleAddFolder(currentUser, folderName, parentFolderId, setFolders) {
  if (!currentUser) return console.error("No user logged in to create a folder for.");

  try {
    const response = await axios.post(
      `${API_URL}/notes/folders`, 
      {
        name: folderName,
        FolderName: folderName,
        folderName: folderName,
        folderId: parentFolderId || null,
        parentID: parentFolderId || null
      },
      { withCredentials: true }
    );

    // The backend returns the raw new Folder object directly
    if (response.data && response.data.FolderID) {
      setFolders((prev) => [...prev, response.data]);
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      alert(error.response.data.error);
    } else {
      console.error("Failed to create folder:", error);
    }
  }
}

/**
 * Sends a request to backend to create a new File/Note
 * @param {Object} currentUser - The logged in user object
 * @param {string} noteName - The name/title of the note
 * @param {number|null} parentFolderId - Optional: the folder this note will belong to
 * @param {Function} setFiles - The React hook setter to update the frontend state seamlessly
 */
export async function handleAddNote(currentUser, noteName, parentFolderId, setFiles) {
  if (!currentUser) return console.error("No user logged in to create a note for.");

  try {
    const response = await axios.post(
      `${API_URL}/notes`, 
      {
        title: noteName,
        NoteTitle: noteName,
        noteTitle: noteName,
        folderId: parentFolderId || null,
        parentID: parentFolderId || null
      },
      { withCredentials: true }
    );

    if (response.data && response.data.NoteID) {
       setFiles((prev) => [...prev, response.data]);
       return response.data.NoteID;
    }
    return null;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      alert(error.response.data.error);
    } else {
      console.error("Failed to create note:", error);
    }
    return null;
  }
}

export async function handleDeleteFolder(currentUser, folderId, onSuccess) {
  if (!currentUser) return;
  try {
    await axios.delete(`${API_URL}/notes/folders/${folderId}`, { withCredentials: true });
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Failed to delete folder:", error);
  }
}

export async function handleDeleteNote(currentUser, noteId, onSuccess) {
  if (!currentUser) return;
  try {
    await axios.delete(`${API_URL}/notes/${noteId}`, { withCredentials: true });
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Failed to delete note:", error);
  }
}

export async function handleRenameFolder(currentUser, folderId, newName, onSuccess) {
  if (!currentUser) return;
  try {
    await axios.put(`${API_URL}/notes/folders/${folderId}`, { folderName: newName }, { withCredentials: true });
    if (onSuccess) onSuccess();
  } catch (error) {
    if (error.response && error.response.status === 409) alert(error.response.data.error);
    else console.error("Failed to rename folder:", error);
  }
}

export async function handleRenameNote(currentUser, noteId, newName, onSuccess) {
  if (!currentUser) return;
  try {
    // Safely retrieve the existing node content first to avoid wiping out the actual note body
    const noteResponse = await axios.get(`${API_URL}/notes/${noteId}`, { withCredentials: true });
    
    // Process JSON parse safely
    let contentPayload = "";
    if (noteResponse.data && noteResponse.data.length > 0) {
       const raw = noteResponse.data[0].NotesContent;
       if (raw && raw !== "null") {
          try { contentPayload = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch(e) { contentPayload = raw; }
       }
    }

    await axios.put(`${API_URL}/notes/${noteId}`, { 
       title: newName, 
       content: contentPayload 
    }, { withCredentials: true });
    
    if (onSuccess) onSuccess();
  } catch (error) {
    if (error.response && error.response.status === 409) alert(error.response.data.error);
    else console.error("Failed to rename note:", error);
  }
}

export async function handleMoveFolder(currentUser, folderId, newParentId, onSuccess) {
  if (!currentUser) return;
  try {
    await axios.put(`${API_URL}/notes/folders/${folderId}/move`, { parentId: newParentId }, { withCredentials: true });
    if (onSuccess) onSuccess();
  } catch (error) {
    if (error.response && (error.response.status === 409 || error.response.status === 400)) alert(error.response.data.error);
    else console.error("Failed to move folder:", error);
  }
}

export async function handleMoveNote(currentUser, noteId, newFolderId, onSuccess) {
  if (!currentUser) return;
  try {
    await axios.put(`${API_URL}/notes/${noteId}/move`, { folderId: newFolderId }, { withCredentials: true });
    if (onSuccess) onSuccess();
  } catch (error) {
    if (error.response && error.response.status === 409) alert(error.response.data.error);
    else console.error("Failed to move note:", error);
  }
}
