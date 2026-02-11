import Header from "@/app/components/ui/header";
import FrontPageButton from "@/app/components/ui/studentfrontpagebutton";
export default function Page() {
  return (
    <>
      <Header text={"Welcome"}>
        <div className="flex">
          <div>
            <h1 className="">&nbsp;</h1>
            <h2 className="">Catalogue</h2>
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
        </div>
      </Header>
    </>
  );
}
