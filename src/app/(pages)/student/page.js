import Header from "../../components/ui/header";
import FrontPageButton from "../../components/ui/studentfrontpagebutton";
import Image from "next/image";

export default function Page() {
  return (
    <main>
      <div>
        <Header text={"Welcome"}>
          <Image
            src="/images/ku_logo.png"
            width={102}
            height={102}
            alt="Kingston University Logo"
          />
          <div>
            <h1>Welcome</h1>
            <p className="text-lg">K1234567</p>
          </div>
          <div className="ml-auto flex">
            <FrontPageButton
              imageSource="/images/add-user.png"
              imageHeight={58}
              imageWidth={58}
              altText="add user button"
            />
            <FrontPageButton
              imageSource="/images/menu.png"
              imageHeight={58}
              imageWidth={58}
              altText="options menu"
            />
          </div>
        </Header>

        <div className=" flex flex-row min-h-screen justify-center items-center">
          <FrontPageButton
            text="Take Notes"
            imageSource="/images/pen.png"
            imageHeight={150}
            imageWidth={150}
            altText="take notes"
          />
          <FrontPageButton
            text="Read"
            imageSource="/images/open-book.png"
            imageHeight={150}
            imageWidth={150}
            altText="read"
          />

          <FrontPageButton
            text="Study Session"
            imageSource="/images/user (1).png"
            imageHeight={150}
            imageWidth={150}
            altText="study session"
          />
        </div>
      </div>
    </main>
  );
}
