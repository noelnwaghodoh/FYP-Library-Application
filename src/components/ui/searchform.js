import Image from "next/image";
import { useState } from "react";

export function SearchField({ searchResults }) {
  
  [searchValue, setSearchValue] = useState();
  
  return (
    <>
      <div className="bg-white text-[#919191] rounded-full max-w-40 flex">
        <input title="Search" />
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

export default function SearchForm() {
  return (
    <div className="bg-[#000000]  text-white p-1 flex">
      <div>Search for a Book </div>
      <SearchField className="" />
      <div>
        {searchResults.map((item)) = (
          <div className=""></div>
      )}
      </div>
    </div>
  );
}
