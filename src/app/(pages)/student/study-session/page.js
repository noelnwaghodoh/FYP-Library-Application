import Header from "@/app/components/ui/header";
import FrontPageButton from "@/app/components/ui/studentfrontpagebutton";
export default function Page() {
  return (
    <>
      <Header text={"Welcome"}>
        <div className="table h-20">
          <h1 className="table-cell align-middle">Begin a study session</h1>
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
          text="Study Alone"
          imageSource="/images/user (1).png"
          imageHeight={150}
          imageWidth={150}
          altText="Study Alone"
        />
        <FrontPageButton
          text="Study with Peers"
          imageSource="/images/people.png"
          imageHeight={203}
          imageWidth={203}
          altText="Study With Peers"
        />
      </div>
    </>
  );
}
