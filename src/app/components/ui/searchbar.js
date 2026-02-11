import Image from "next/image";

function SearchField() {
  return <div className="bg-white text-[#919191] flex">Search</div>;
}

export default function SearchBar(props) {
  return <div className="bg-black text-white p-1">{props.children}</div>;
}
