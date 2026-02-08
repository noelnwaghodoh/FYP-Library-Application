import Image from "next/image";
import Link from "next/link";

export default function FrontPageButton({
  text,
  imageSource,
  imageWidth,
  imageHeight,
  handleClick,
  altText,
  link,
}) {
  return (
    <div className="p-5" onClick={handleClick}>
      <Image
        src={imageSource}
        width={imageWidth}
        height={imageHeight}
        alt={altText}
      />

      <p className=" flex justify-center">{text}</p>
    </div>
  );
}
