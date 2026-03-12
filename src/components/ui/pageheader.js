import FrontPageButton from "./studentfrontpagebutton";
import Header from "./header";

export default function PageHeader({ title }) {
  return (
    <header className="bg-[#2596BE] text-white p-1">
      <div className="flex">
        <div>
          <h1 className="">&nbsp;</h1>
          <h2 className="">{title}</h2>
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
    </header>
  );
}
