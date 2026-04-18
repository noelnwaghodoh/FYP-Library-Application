"use client";
import { API_URL } from "@/config";
import React, { useEffect, useState } from "react";
import PageHeader from "@/components/ui/pageheader";
import CatalogueSearchBar from "@/components/ui/search";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import SearchResults from "../components/search-results";
import { SuggestedReading } from "../components/suggested-reading";
import { BookDisplay } from "../components/book-display";

function DiscoveryContent() {
  const [message, setMessage] = useState("");

  const [searchResultList, setSearchResultList] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchMeta, setSearchMeta] = useState({});
  const [displayBook, setDisplayBook] = useState(null);
  const searchParams = useSearchParams();

  console.log(
    "This is the search query when the page first loads i think" +
      searchParams.get("query"),
  );
  const [searchQuery, setSearchQuery] = useState({
    searchText: searchParams.get("query") ? searchParams.get("query") : "",
  });
  const [searchCompleteList, setSearchCompleteList] = useState([]);

  async function handleSearch(term)  {
    const params = new URLSearchParams();
     console.log("term is " + term);
    params.append("searchText", term);
    const response = await fetch(`${API_URL}/catalogue?${params}`);
    const data = await response.json();
    
    // Defensively handle BOTH the old Array mapping and the new Object mapping seamlessly!
    if (Array.isArray(data)) {
        setBooks(data);
        setSearchMeta({});
    } else {
        setBooks(data.results || data.books || []);
        setSearchMeta({
            isFallback: data.isFallback,
            isRelated: data.isRelated,
            exactMatch: data.exactMatch
        });
    }

    setDisplayBook(null);

    return data;
  }

  async function handleCourseSelect(courseId) {
    if (!courseId) return;
    try {
      const response = await fetch(`${API_URL}/courses/${courseId}/books`);
      const data = await response.json();
      
      // Defensively parse purely array-based responses from typical basic SQL fetches
      setBooks(data.results || data.books || (Array.isArray(data) ? data : []));
      setSearchMeta({
          isCourseRecommended: true
      });
      setDisplayBook(null);
    } catch (error) {
       console.error("Failed to fetch course books", error);
    }
  }

  console.log(
    "from the parent searchQuery in use state is : " +
      JSON.stringify(searchQuery),
  );

  console.log("from the child searchList is " + searchResultList);
  return (
    <>
      <PageHeader title="Catalogue" backRoute="/student" />
      <main>
        <CatalogueSearchBar
          searchQueryValue={searchQuery}
          searchListValue={searchCompleteList}
          setSearchListValue={setSearchCompleteList}
          setSearchQueryValue={setSearchQuery}
          handleClickButton={handleSearch}
        />

        {displayBook ? (
          <BookDisplay book={displayBook} />
        ) : books && books.length > 0 ? (
          <SearchResults books={books} meta={searchMeta} onBookSelect={(book) => setDisplayBook(book)} />
        ) : (
          <SuggestedReading message={message} onCourseSelect={handleCourseSelect} />
        )}
      </main>
    </>
  );
}


export default function Page() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center font-semibold text-gray-500">Loading Discovery Environment...</div>}>
      <DiscoveryContent />
    </React.Suspense>
  );
}
