import Image from "next/image";

export default function Header(props) {
  return (
    <header className="bg-[#2596BE] text-white p-1 flex">
      {props.children}
    </header>
  );
}
