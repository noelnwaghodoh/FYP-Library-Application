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
  const content = (
      <div className="p-5" onClick={handleClick}>
        <Image
          src={imageSource}
          width={imageWidth}
          height={imageHeight}
          alt={altText}
        />
        <p className="flex justify-center text-center mt-2">{text}</p>
      </div>
  );

  // If a click handler is provided but no link, render purely as an interactive button!
  if (handleClick && !link) {
    return <button type="button" className="focus:outline-none">{content}</button>;
  }

  // Otherwise, fallback exactly to original routing behavior
  return (
    <Link href={link ? link : "student"}>
      {content}
    </Link>
  );
}
