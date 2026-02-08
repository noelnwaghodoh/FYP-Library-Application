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
          <p></p>
          <p>Announcements </p>
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
      </div>
    </main>
  );
}
