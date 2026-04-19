"use client";
import { API_URL } from "@/config";
import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

// --- MODAL WRAPPERS ---
import { SingleInputModal } from "@/components/ui/modal";

export function CreateFolderModal({ isOpen, onClose, onSubmit }) {
  return (
    <SingleInputModal 
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
    <SingleInputModal 
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
// ConfirmModal is now imported strictly inside notes/page.js instead!

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
 * @param {Function} onError - Optional callback structurally rendering SQL conflict messages visually
 */
export async function handleAddFolder(currentUser, folderName, parentFolderId, setFolders, onError) {
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
      if (onError) onError(error.response.data.error);
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
 * @param {Function} onError - Optional callback structurally rendering SQL conflict messages visually
 */
export async function handleAddNote(currentUser, noteName, parentFolderId, setFiles, onError) {
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
      if (onError) onError(error.response.data.error);
    } else {
      console.error("Failed to create note:", error);
    }
    return null;
  }
}

export async function handleDeleteFolder(currentUser, folderId, onSuccess, onError) {
  if (!currentUser) return;
  try {
    await axios.delete(`${API_URL}/notes/folders/${folderId}`, { withCredentials: true });
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Failed to delete folder:", error);
  }
}

export async function handleDeleteNote(currentUser, noteId, onSuccess, onError) {
  if (!currentUser) return;
  try {
    await axios.delete(`${API_URL}/notes/${noteId}`, { withCredentials: true });
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Failed to delete note:", error);
  }
}

export async function handleRenameFolder(currentUser, folderId, newName, onSuccess, onError) {
  if (!currentUser) return;
  try {
    await axios.put(`${API_URL}/notes/folders/${folderId}`, { folderName: newName }, { withCredentials: true });
    if (onSuccess) onSuccess();
  } catch (error) {
    if (error.response && error.response.status === 409) {
        if (onError) onError(error.response.data.error);
    } else {
        console.error("Failed to rename folder:", error);
    }
  }
}

export async function handleRenameNote(currentUser, noteId, newName, onSuccess, onError) {
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
    if (error.response && error.response.status === 409) {
        if (onError) onError(error.response.data.error);
    } else { 
        console.error("Failed to rename note:", error);
    }
  }
}

export async function handleMoveFolder(currentUser, folderId, newParentId, onSuccess, onError) {
  if (!currentUser) return;
  try {
    await axios.put(`${API_URL}/notes/folders/${folderId}/move`, { parentId: newParentId }, { withCredentials: true });
    if (onSuccess) onSuccess();
  } catch (error) {
    if (error.response && (error.response.status === 409 || error.response.status === 400)) {
       if (onError) onError(error.response.data.error);
    } else {
       console.error("Failed to move folder:", error);
    }
  }
}

export async function handleMoveNote(currentUser, noteId, newFolderId, onSuccess, onError) {
  if (!currentUser) return;
  try {
    await axios.put(`${API_URL}/notes/${noteId}/move`, { folderId: newFolderId }, { withCredentials: true });
    if (onSuccess) onSuccess();
  } catch (error) {
    if (error.response && error.response.status === 409) {
       if (onError) onError(error.response.data.error);
    } else {
       console.error("Failed to move note:", error);
    }
  }
}
