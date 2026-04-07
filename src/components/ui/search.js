import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function CatalogueSearchBar0() {
  [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="bg-white text-[#919191] rounded-full max-w-40 flex">
        <Search className=" rounded-full max-w-40 flex" />
        <Image
          src="/images/search-interface-symbol.png"
          width={20}
          height={20}
          alt={"Click to search"}
        />
      </div>
    </>
  );
}

export function DataSearchBar() {
  return (
    <>
      <div className="bg-white text-[#919191] rounded-full max-w-40 flex">
        <Search className=" rounded-full max-w-40 flex" />
        <Image
          src="/images/search-interface-symbol.png"
          width={20}
          height={20}
          alt={"Click to search"}
        />
      </div>
    </>
  );
}

export function SearchSubmitButton({ buttonText, buttonClick }) {
  return <button onclick={buttonClick}>{buttonText}</button>;
}

export function SearchSubmitImage({ onSubmit }) {
  return (
    <Image
      src="/images/search-interface-symbol.png"
      width={20}
      height={20}
      alt={"Click to search"}
      onClick={onSubmit}
    />
  );
}

//this could be at file level as well
export function SearchResults({ searchResults, setSearchQueryValue }) {
  console.log("the search results in the child is " + searchResults);

  const handleClick = () => {
    setSearchQueryValue();
  };

  if (!searchResults || searchResults.length === 0) return null;
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white text-black shadow-lg rounded-md max-h-60 overflow-y-auto border border-gray-200 z-50">
      {searchResults.map((item, index) => (
        <div
          onClick={() => {
            setSearchQueryValue({ searchText: item.BookTitle });
          }}
          key={index}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 border-gray-100 truncate text-sm"
        >
          {item.BookTitle}
        </div>
      ))}
    </div>
  );
}

export function Search({ onSearchChange, placeholder, searchQuery, onFocus, onBlur }) {
  const searchParams = useSearchParams();
  console.log(searchParams.get("query")?.toString());
  return (
    <div className="bg-white text-[#919191]">
      <input
        className="w-150 outline-none px-2"
        title="Search"
        value={searchQuery.searchText}
        placeholder={placeholder}
        onChange={onSearchChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}

export default function CatalogueSearchBar({
  searchQueryValue,
  searchListValue,
  setSearchQueryValue,
  setSearchListValue,
  handleClickButton,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const handleSearchChange = async (event) => {
    console.log(event);
    setSearchQueryValue({ searchText: event.target.value });
    console.log(JSON.stringify(searchQueryValue));
    console.log("event.target.length is " + event.target.value.length);
    if (event.target.value.length >= 3) {
      console.log("searching");
      const params = new URLSearchParams();
      params.append("searchText", event.target.value);
      console.log(params.toString());
      /* const newsearchResults = await axios.get(
        "http://localhost:8080/books/search",
        { params: { searchText: event.target.value } },
      );
      */
      const newsearchResults = await fetch(
        `http://localhost:8080/books?${params}`,
      );

      const data = await newsearchResults.json();
      console.log(data);
      setSearchListValue(data);
    }

    if (event.target.value.length == 0) setSearchListValue([]);
  };

  const handleSearchSubmit = async (event) => {
    console.log(
      "This is theh search query value after pressing handle search submit " +
        JSON.stringify(searchQueryValue),
    );
    const params = new URLSearchParams();
    params.append("query", searchQueryValue.searchText);
    const searchResults = await fetch(
      `http://localhost:8080/books/search?${params}`,
    );

    const data = await searchResults.json();
    console.log(data);
    
    // Execute the prop function passed from page.js (which is handleSearch)
    if (handleClickButton) {
      handleClickButton(searchQueryValue.searchText);
    }

    // Keep the local URL updating routing as well
    handleClickOfButton(searchQueryValue.searchText);
  };

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { replace } = useRouter();

  function handleClickOfButton(term) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }
  //const searchResults = ["A", "B"];
  return (
    <>
      <div className="bg-[#000000]  text-white p-1 flex items-center">
        <div className="pr-4">Search for a Book </div>
        <div className="relative">
          <div className="bg-[#FFFFFF]   p-1 flex">
            <Search
              className="grow-1"
              placeholder="Search for a book"
              onSearchChange={handleSearchChange}
              searchQuery={searchQueryValue}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            />
            <SearchSubmitImage
              className="grow-1"
              onSubmit={handleSearchSubmit}
            />
          </div>
          {isFocused && (
            <SearchResults
              searchResults={searchListValue}
              setSearchQueryValue={setSearchQueryValue}
            />
          )}
        </div>
      </div>
    </>
  );
}
