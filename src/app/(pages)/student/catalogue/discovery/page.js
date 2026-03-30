"use client";
import Header from "@/components/ui/header";
import PageHeader from "@/components/ui/pageheader";
import SearchForm from "@/components/ui/search";
import React, { useEffect, useState } from "react";
import FrontPageButton from "@/components/ui/studentfrontpagebutton";
import CatalogueSearchBar from "@/components/ui/search";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

export default function Page() {
  const [message, setMessage] = useState("Loading");

  const [searchResultList, setSearchResultList] = useState([]);

  const searchParams = useSearchParams();

  console.log(
    "This is the search query when the page first loads i think" +
      searchParams.get("query"),
  );
  const [searchQuery, setSearchQuery] = useState({
    searchText: searchParams.get("query") ? searchParams.get("query") : "",
  });
  const [searchCompleteList, setSearchCompleteList] = useState([]);

  function handleSearch(term) {
    params = new URLSearchParams(searchParams);
    console.log("the search says yes");
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

        <div>
          <p>
            You can Enter your course details to use view your suggested reading
          </p>
          <p>{message}</p>
        </div>
      </main>
    </>
  );
}
