import Image from "next/image";
import FrontPageButton from "./studentfrontpagebutton";

export default function Header(props) {
  return (
    <header className="bg-[#2596BE] text-white p-1">{props.children}</header>
  );
}


