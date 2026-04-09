import PageHeader from "@/components/ui/pageheader";
import FrontPageButton from "@/components/ui/studentfrontpagebutton";
import Image from "next/image";

export default function Page() {
  return (
    <main>
      <div>
        <PageHeader title="Begin a Study Session" />

        <div className=" flex flex-row min-h-screen justify-center items-center">
          <FrontPageButton
            text="Take Notes"
            imageSource="/images/pen.png"
            imageHeight={150}
            imageWidth={150}
            altText="take notes"
            link="student/notes"
          />
          <FrontPageButton
            text="Read"
            imageSource="/images/open-book.png"
            imageHeight={150}
            imageWidth={150}
            altText="read"
            link="student/catalogue/discovery"
          />

          <FrontPageButton
            text="Study Session"
            imageSource="/images/user (1).png"
            imageHeight={150}
            imageWidth={150}
            altText="study session"
            link="student/study-session"
          />
        </div>
      </div>
    </main>
  );
}
