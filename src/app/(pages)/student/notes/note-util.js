"use client";
import { API_URL } from "@/config";
import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

// --- MODAL COMPONENTS ---
export function CreateFolderModal({ isOpen, onClose, onSubmit }) {
  const [folderName, setFolderName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim() === "") return;
    onSubmit(folderName);
    setFolderName(""); // Reset for next time
  };

  const handleCancel = () => {
    setFolderName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Create New Folder</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Folder Name
          </label>
          <input
            type="text"
            autoFocus
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2ba5c7] focus:border-transparent transition-all"
            placeholder="e.g. Physics 101"
          />
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={folderName.trim() === ""}
              className="px-4 py-2 text-sm font-medium text-white bg-[#2ba5c7] rounded-md hover:bg-[#228b9e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- CARD COMPONENTS ---
export function FolderCard({ label, onClick }) {
  // Truncate the name dynamically if it stretches past 20 characters
  const displayLabel = label && label.length > 20 
    ? label.substring(0, 20) + "..." 
    : label;

  return (
    <div onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-transform w-[90px]">
      <Image 
        src="/images/folder.png" 
        alt="Folder Icon"
        width={72} 
        height={72} 
        className="object-contain"
      />
      <span className="text-[14px] font-normal text-gray-800 text-center" title={label}>
        {displayLabel}
      </span>
    </div>
  );
}

export function FileCard({ label, onClick }) {
  // Truncate the name dynamically if it stretches past 20 characters
  const displayLabel = label && label.length > 20 
    ? label.substring(0, 20) + "..." 
    : label;

  return (
    <div onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-transform w-[90px]">
      <Image 
        src="/images/file (1).png" 
        alt="File Icon"
        width={72} 
        height={72} 
        className="object-contain"
      />
      <span className="text-[14px] font-normal text-gray-800 text-center" title={label}>
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

    // If backend returns the newly created DB item in the response
    if (response.data.success) {
      // Magically push the new db entry into the React Array without needing to refresh!
      setFolders((prev) => [...prev, response.data.newFolder]);
    }
  } catch (error) {
    console.error("Failed to create folder:", error);
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
        folderId: parentFolderId || null,
        parentID: parentFolderId || null
      },
      { withCredentials: true }
    );

    if (response.data.success) {
       setFiles((prev) => [...prev, response.data.newNote]);
       
       // Return the database generated ID to power the Next.js router redirection
       // Assumes your backend returns an 'id' or 'note_id' field. Change this if your SQL key is radically different.
       return response.data.newNote.id || response.data.NoteID || response.data.newNote.NoteID;
    }
    return null;
  } catch (error) {
    console.error("Failed to create note:", error);
    return null;
  }
}
