"use client";import { API_URL } from "@/config";

import Header from "@/components/ui/header";
import PageHeader from "@/components/ui/pageheader";
import SearchForm from "@/components/ui/search";
import React, { useEffect, useState } from "react";
import FrontPageButton from "@/components/ui/studentfrontpagebutton";
import CatalogueSearchBar from "@/components/ui/search";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import SearchResults from "../components/search-results";
import { SuggestedReading } from "../components/suggested-reading";
import { BookDisplay } from "../components/book-display";

export default function Page() {
  const [message, setMessage] = useState("");

  const [searchResultList, setSearchResultList] = useState([]);
  const [books, setBooks] = useState([]);
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
    console.log("data is " + data);
    setBooks(data);
    setDisplayBook(null);

    console.log("the search says yes");

    return data;
  }

  console.log(
    "from the parent searchQuery in use state is : " +
      JSON.stringify(searchQuery),
  );

  console.log("from the child searchList is " + searchResultList);
  return (
    <>
      <PageHeader title="Catalogue" />
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
          <SearchResults books={books} onBookSelect={(book) => setDisplayBook(book)} />
        ) : (
          <SuggestedReading message={message} />
        )}
      </main>
    </>
  );
}
