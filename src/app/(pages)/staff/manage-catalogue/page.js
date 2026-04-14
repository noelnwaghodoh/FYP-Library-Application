"use client";import { API_URL } from "@/config";

import React, { useState } from "react";
import Header from "@/components/ui/header";
import PageHeader from "@/components/ui/pageheader";
import CatalogueSearchBar from "@/components/ui/search";
import axios from "axios";

export default function ManageCataloguePage() {
  const [searchQuery, setSearchQuery] = useState({ searchText: "" });
  const [searchCompleteList, setSearchCompleteList] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [editValues, setEditValues] = useState({});

  // Re-creating the specific backend fetch loop to securely isolate results
  const executeCatalogueSearch = async (term) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("searchText", term || "");
      const response = await fetch(`${API_URL}/catalogue?${params}`);
      const data = await response.json();
      setBooks(data || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTrigger = (book) => {
    setBookToEdit(book);
    setEditValues({
      bookTitle: book.BookTitle || book.title || "",
      bookAuthor: book.BookAuthor || book.author || "",
      bookPublisher: book.ItemPublisher || book.BookPublisher || "",
      bookContributors: book.BookContributors || "",
      bookIdentifier: book.BookIdentifier || book.isbn || "",
      // Ensure the MySQL ISO timestamp is stripped to YYYY-MM-DD for native HTML5 Date picker compatibility
      bookReleaseDate: book.BookDate ? book.BookDate.split("T")[0] : "",
      bookSubjects: book.ItemSubjects || book.BookSubjects || "",
      bookEdition: book.BookEdition || "",
      bookDescription: book.ItemDescription || book.BookDescription || ""
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    setEditValues({
      ...editValues,
      [e.target.name]: e.target.value
    });
  };

  const executeEditRecord = async (e) => {
    e.preventDefault();
    if (!bookToEdit) return;
    
    try {
      const targetId = bookToEdit.BookID || bookToEdit.id;
      await axios.put(`${API_URL}/catalogue/${targetId}`, editValues, { withCredentials: true });
      
      // Mutate Table immediately
      setBooks((currentList) => currentList.map(b => {
        if (b.BookID === targetId || b.id === targetId) {
           return { ...b, BookTitle: editValues.bookTitle, title: editValues.bookTitle, BookAuthor: editValues.bookAuthor, author: editValues.bookAuthor, BookIdentifier: editValues.bookIdentifier, isbn: editValues.bookIdentifier };
        }
        return b;
      }));
      setIsEditModalOpen(false);
      setBookToEdit(null);
    } catch (error) {
      console.error("Failed to update record:", error);
      alert("Failed to update the record. Check the server console.");
    }
  };

  const handleDeleteTrigger = (book) => {
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

  const executeDeleteRecord = async () => {
    if (!bookToDelete) return;
    
    console.log(`Executing two-phase commit deletion for book id: ${bookToDelete.BookID}`);
    try {
      await axios.delete(`${API_URL}/catalogue/${bookToDelete.BookID}`, { withCredentials: true });
      // Purge locally from UI instantly so the user sees feedback
      setBooks((currentList) => currentList.filter(book => book.BookID !== bookToDelete.BookID));
      setIsDeleteModalOpen(false);
      setBookToDelete(null);
    } catch (error) {
      console.error("Failed to delete record:", error);
      alert("Failed to delete the record. Check the server console.");
    }
  };

  return (
    <>
      <Header />
      <PageHeader title="Manage the Catalogue" />
      
      {/* Black Subheader matching Wireframe */}
    
           <CatalogueSearchBar 
             searchQueryValue={searchQuery}
             searchListValue={searchCompleteList}
             setSearchListValue={setSearchCompleteList}
             setSearchQueryValue={setSearchQuery}
             handleClickButton={executeCatalogueSearch} 
           />
     
      
      <main className="min-h-[70vh] bg-gray-50 p-8">
        <div className="bg-white rounded shadow-md overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm border-b-2 border-gray-300">
                <th className="py-4 px-6 font-bold">Book Title</th>
                <th className="py-4 px-6 font-bold">Author</th>
                <th className="py-4 px-6 font-bold">Identifier / ISBN</th>
                <th className="py-4 px-6 font-bold text-center">Admin Controls</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                  <tr><td colSpan="4" className="text-center py-10 font-semibold text-gray-500">Executing Database Fetch...</td></tr>
              ) : books.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-10 text-gray-500 italic">No catalogue records found. Try searching.</td></tr>
              ) : (
                books.map((book, index) => (
                  <tr key={book.id || index} className="border-b hover:bg-blue-50 transition">
                    <td className="py-4 px-6 text-gray-800 font-medium">{book.BookTitle || book.title || "Unknown Title"}</td>
                    <td className="py-4 px-6 text-gray-600">{book.BookAuthor || book.author || "-"}</td>
                    <td className="py-4 px-6 text-gray-600 font-mono text-sm">{book.BookIdentifier || book.isbn || "-"}</td>
                    <td className="py-4 px-6 flex justify-center gap-3">
                      <button onClick={() => handleEditTrigger(book)} className="bg-amber-500 hover:bg-amber-600 outline-none text-white px-4 py-2 rounded font-bold shadow-sm transition">
                         Edit
                      </button>
                      <button onClick={() => handleDeleteTrigger(book)} className="bg-red-500 hover:bg-red-600 outline-none text-white px-4 py-2 rounded font-bold shadow-sm transition">
                         Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Tailwind Fixed Delete Modal overlay */}
      {isDeleteModalOpen && bookToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-[0.65] flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-2xl max-w-lg w-full transform transition-all text-center">
            <h3 className="text-2xl font-bold text-red-600 mb-2">Confirm Permanent Deletion</h3>
            <p className="text-gray-900 italic font-bold my-4 border bg-gray-100 p-2 break-words">
               {bookToDelete.BookTitle || bookToDelete.title || "Unknown Title"}
            </p>
            <p className="text-gray-600 mb-8 border-t border-gray-200 pt-4 px-2">
               WARNING: Executing this action will permanently delete this catalogue record and completely destroy its associated physical PDF from the AWS S3 Bucket. This action cannot be reversed.
            </p>
            <div className="flex justify-center gap-4">
               <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 bg-gray-200 rounded font-semibold text-gray-800 hover:bg-gray-300 transition outline-none">
                  Cancel
               </button>
               <button onClick={executeDeleteRecord} className="px-6 py-2 bg-red-600 rounded font-semibold text-white hover:bg-red-700 transition shadow-md outline-none">
                  Confirm Deletion
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Tailwind Fixed Edit Modal overlay */}
      {isEditModalOpen && bookToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-[0.65] flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Edit Catalogue Record</h3>
            <form onSubmit={executeEditRecord} className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-semibold text-gray-700">Title</label>
                  <input required name="bookTitle" value={editValues.bookTitle} onChange={handleEditInputChange} className="mt-1 w-full border border-gray-300 rounded p-2 focus:border-blue-500 outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700">Author</label>
                  <input required name="bookAuthor" value={editValues.bookAuthor} onChange={handleEditInputChange} className="mt-1 w-full border border-gray-300 rounded p-2 focus:border-blue-500 outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700">ISBN / Identifier</label>
                  <input required name="bookIdentifier" value={editValues.bookIdentifier} onChange={handleEditInputChange} className="mt-1 w-full border border-gray-300 rounded p-2 focus:border-blue-500 outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700">Publisher</label>
                  <input name="bookPublisher" value={editValues.bookPublisher} onChange={handleEditInputChange} className="mt-1 w-full border border-gray-300 rounded p-2 focus:border-blue-500 outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700">Contributors</label>
                  <input name="bookContributors" value={editValues.bookContributors} onChange={handleEditInputChange} className="mt-1 w-full border border-gray-300 rounded p-2 focus:border-blue-500 outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700">Release Date</label>
                  <input type="date" name="bookReleaseDate" value={editValues.bookReleaseDate} onChange={handleEditInputChange} className="mt-1 w-full border border-gray-300 rounded p-2 focus:border-blue-500 outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700">Edition</label>
                  <input type="number" min="1" name="bookEdition" value={editValues.bookEdition} onChange={handleEditInputChange} className="mt-1 w-full border border-gray-300 rounded p-2 focus:border-blue-500 outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700">Subjects</label>
                  <input name="bookSubjects" value={editValues.bookSubjects} onChange={handleEditInputChange} className="mt-1 w-full border border-gray-300 rounded p-2 focus:border-blue-500 outline-none" />
               </div>
               <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">Description</label>
                  <textarea name="bookDescription" value={editValues.bookDescription} onChange={handleEditInputChange} rows="3" className="mt-1 w-full border border-gray-300 rounded p-2 focus:border-blue-500 outline-none"></textarea>
               </div>
               <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t pt-4">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2 bg-gray-200 rounded font-semibold hover:bg-gray-300 text-gray-800 transition outline-none">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 rounded font-semibold text-white hover:bg-blue-700 transition outline-none">Save Changes</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}