"use client";
import Header from "@/components/ui/header";
import PageHeader from "@/components/ui/pageheader";
import SearchForm from "@/components/ui/search";
import React, { useEffect, useState } from "react";
import FrontPageButton from "@/components/ui/studentfrontpagebutton";
import CatalogueSearchBar from "@/components/ui/search";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import SearchResults from "../components/search-results";
export default function Page() {
  const [message, setMessage] = useState("Loading");

  const [searchResultList, setSearchResultList] = useState([]);
  const [books ,setBooks] = useState([]);
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
    const response = await fetch(`http://localhost:8080/catalogue?${params}`);
    const data = await response.json();
    console.log("data is " + data);
    setBooks(data);

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
        {books && books.length > 0 ? (
          <SearchResults books={books} />
        ) : (
          <div>
            <p>
              You can Enter your course details to view your suggested reading
            </p>
            <p>{message}</p>
          </div>
        )}
      </main>
    </>
  );
}
