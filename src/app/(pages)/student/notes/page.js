"use client";
import { API_URL } from "@/config";
import Header from "@/components/ui/header";
import PageHeader from "@/components/ui/pageheader";
import { FolderCard, FileCard, AddFolderButton, AddFileButton, handleAddNote, handleAddFolder, CreateFolderModal, RenameModal, handleDeleteFolder, handleDeleteNote, handleRenameFolder, handleRenameNote } from "./note-util";
import { useState, useEffect } from "react";
import axios from "axios";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Page() {
  const router = useRouter(); // Next.js App Router navigator
  
  const [viewMode, setViewMode] = useState("grid");
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Modal tracking state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    const handleGlobalClick = () => setContextMenu(null);
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({
      mouseX: e.pageX,
      mouseY: e.pageY,
      item: item
    });
  };

  const executeDelete = async () => {
    if (!contextMenu) return;
    const item = contextMenu.item;
    const isFolder = item.type === 'folder';
    const id = isFolder ? (item.id || item.folderID || item.folder_id || item.FolderID) : (item.id || item.noteID || item.note_id || item.NoteID);
    
    if (confirm(`Are you extremely sure you want to permanently delete this ${isFolder ? 'folder' : 'file'}?`)) {
      if (isFolder) await handleDeleteFolder(currentUser, id, () => getRootFolders());
      else await handleDeleteNote(currentUser, id, () => getRootFiles());
    }
  };

  const executeRenameSubmit = async (newName) => {
    if (!renameTarget) return;
    const isFolder = renameTarget.type === 'folder';
    const id = isFolder ? (renameTarget.id || renameTarget.folderID || renameTarget.folder_id || renameTarget.FolderID) : (renameTarget.id || renameTarget.noteID || renameTarget.note_id || renameTarget.NoteID);
    
    if (isFolder) await handleRenameFolder(currentUser, id, newName, () => getRootFolders());
    else await handleRenameNote(currentUser, id, newName, () => getRootFiles());
    setRenameTarget(null);
  };
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Wrapper function firing open the Modal overlay instead of directly mutating database
  const createNewFolder = () => {
    setIsModalOpen(true);
  };
  
  // Actually commits the data to the MySQL Database once the user clicks "Create"
  const handleModalSubmit = async (folderName) => {
    await handleAddFolder(currentUser, folderName, null, setFolders);
    setIsModalOpen(false);
  };

  // Wrapper function cleanly executing note generation BEFORE redirecting natively
  const createAndNavigate = async () => {
    // We explicitly supply "untitled" as the default base name here!
    const newNoteId = await handleAddNote(currentUser, "untitled", null, setFiles);
    
    if (newNoteId) {
      // Transition strictly to the rich text editor page holding that exact ID
      router.push(`/student/notes/${newNoteId}`);
    }
  };

  useEffect(() => {
    getCurrentUser();
    getRootFolders();
    getRootFiles();
  }, []);

  function getCurrentUser() {
    axios.get(`${API_URL}/me`, { withCredentials: true })
      .then(res => {
        setCurrentUser(res.data); // Now you have the user object!
      })
      .catch(err => console.log("Not logged in or session expired"));
  }
  
  function getRootFolders() {
   
    axios.get(`${API_URL}/notes/folders`, { withCredentials: true })
      .then(res => {
        // Defensively process the array whether it's raw or wrapped in an object
        const payload = res.data;
        console.log("RAW FOLDERS FETCHED FROM BACKEND: ", res.data);
        if (Array.isArray(payload)) {
           setFolders(payload);
        } else if (payload && payload.folders) {
           setFolders(payload.folders);
        } else {
           console.log("Unrecognized folder payload shape:", payload);
        }
      })
      .catch(err => console.log("Not logged in or session expired"));
  }
  function getRootFiles() {
    console.log("THIS FUNCTION IS BEING CALLED IN THE FIRST PLACE")
    axios.get(`${API_URL}/notes`, { withCredentials: true })
      .then(res => {
        console.log("RAW FILES FETCHED FROM BACKEND: ", res.data);
        setFiles(res.data);
      })
      .catch(err => console.error("Failed to fetch files:", err));
  }

  // Combine folders and files into a single unified array so they display in one grid
  const allItems = [
    ...folders.map(f => ({ ...f, type: 'folder' })),
    ...files.map(f => ({ ...f, type: 'file' }))
  ];

  // Derive the sliced items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header pulling styles from existing central repository */}
      <PageHeader title="Notes" backRoute="/student">
        <button onClick={() => setViewMode('grid')} title="Grid View" className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        </button>
        <button onClick={() => setViewMode('table')} title="List View" className={`p-1.5 rounded transition ${viewMode === 'table' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        </button>
      </PageHeader>

      {/* Main Container handling the Horizontal layout of the Note Explorer Component Grid */}
      <main className="px-10 py-12">
        {viewMode === "grid" ? (
          <div className="flex flex-row gap-6 flex-wrap items-start max-w-4xl">
            {currentItems.map((item, index) => {
              if (item.type === 'folder') {
                const folderId = item.id || item.folderID || item.folder_id || item.FolderID;
                return (
                  <FolderCard 
                    key={index} 
                    onClick={() => router.push(`/student/notes/folder/${folderId}`)}
                    onContextMenu={(e) => handleContextMenu(e, item)}
                    label={item.FolderName || item.title || `Untitled Folder`} 
                    hasDocs={item.hasDocs || false} 
                  />
                );
              }
              const noteId = item.id || item.noteID || item.note_id || item.NoteID;
              return (
                <FileCard 
                  key={index} 
                  onClick={() => router.push(`/student/notes/${noteId}`)} 
                  onContextMenu={(e) => handleContextMenu(e, item)}
                  label={item.NoteTitle || item.name || `Untitled Note`} 
                />
              );
            })}
            <AddFolderButton onClick={createNewFolder} />
            <AddFileButton onClick={createAndNavigate} />
          </div>
        ) : (
          <div className="w-full max-w-4xl">
             <div className="w-full flex justify-end gap-3 mb-4">
               <button onClick={createNewFolder} className="bg-[#2ba5c7] text-white px-4 py-2 rounded font-medium shadow-sm hover:opacity-90 transition">New Folder</button>
               <button onClick={createAndNavigate} className="bg-[#5CB85C] text-white px-4 py-2 rounded font-medium shadow-sm hover:opacity-90 transition">New File</button>
             </div>
             <div className="bg-white rounded shadow-md overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse select-none">
                  <thead>
                     <tr className="bg-gray-100 text-gray-700 text-sm border-b-2 border-gray-300">
                       <th className="py-4 px-6 font-bold w-16 text-center">Type</th>
                       <th className="py-4 px-6 font-bold">Name</th>
                     </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                       <tr><td colSpan="2" className="text-center py-8 text-gray-500 italic">This directory is empty.</td></tr>
                    ) : (
                       currentItems.map((item, index) => {
                           const isFolder = item.type === "folder";
                           const id = isFolder ? (item.id || item.folderID || item.folder_id || item.FolderID) : (item.id || item.noteID || item.note_id || item.NoteID);
                           const name = isFolder ? (item.FolderName || item.title || "Untitled Folder") : (item.NoteTitle || item.name || "Untitled Note");
                           const targetUrl = isFolder ? `/student/notes/folder/${id}` : `/student/notes/${id}`;
                           
                           return (
                             <tr key={index} onContextMenu={(e) => handleContextMenu(e, item)} onDoubleClick={() => router.push(targetUrl)} title="Double-click to open. Right-click for options." className="border-b hover:bg-blue-50 transition cursor-pointer">
                               <td className="py-4 px-6 flex justify-center">
                                  <Image src={isFolder ? "/images/folder.png" : "/images/file (1).png"} alt="icon" width={24} height={24} className="object-contain" />
                               </td>
                               <td className="py-4 px-6 text-gray-800 font-medium">{name}</td>
                             </tr>
                           );
                       })
                    )}
                  </tbody>
                </table>
             </div>
             <div className="text-xs text-gray-400 mt-2 italic text-right w-full">Double-click any row to open the file or folder.</div>
          </div>
        )}

        {/* Pagination Toolbar */}
        {totalPages > 1 && (
          <div className="flex justify-start w-full mt-10 gap-3 max-w-4xl">
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-[#2ba5c7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600 text-sm font-medium flex items-center">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-[#2ba5c7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Renders safely on top of everything when isModalOpen becomes true */}
      <CreateFolderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleModalSubmit} 
      />

      {/* Rename Modal safely handles both files and folders using GenericModal */}
      <RenameModal 
        isOpen={renameTarget !== null}
        onClose={() => setRenameTarget(null)}
        onSubmit={executeRenameSubmit}
        initialValue={renameTarget ? (renameTarget.type === 'folder' ? (renameTarget.FolderName || renameTarget.title) : (renameTarget.NoteTitle || renameTarget.name)) : ""}
      />

      {/* Floating Right-Click Context Menu */}
      {contextMenu !== null && (
        <div 
          className="absolute z-[9999] bg-white border border-gray-200 shadow-xl rounded-md py-1 w-40 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
        >
          <button 
             className="px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#2ba5c7] flex items-center gap-2 transition-colors w-full"
             onClick={() => setRenameTarget(contextMenu.item)}
          >
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
             Rename
          </button>
          <div className="h-px bg-gray-100 my-1 w-full" />
          <button 
             className="px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors w-full"
             onClick={executeDelete}
          >
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
             Delete
          </button>
        </div>
      )}
    </div>
  );
}
