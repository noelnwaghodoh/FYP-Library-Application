import FrontPageButton from "./studentfrontpagebutton";
import Header from "./header";
import Home from "./home";
import { useRouter } from "next/navigation";

export default function PageHeader({ title, backRoute }) {
  const router = useRouter();
  
  return (
    <header className="bg-[#2596BE] text-white p-1">
      <div className="flex">
        <div className="flex items-center gap-3">
          {backRoute && (
            <button onClick={() => router.push(backRoute)} className="text-white hover:text-gray-200 transition-colors ml-4 mr-2">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
               </svg>
            </button>
          )}
          <div>
            <h1 className="">&nbsp;</h1>
            <h2 className={backRoute ? "" : "pl-4"}>{title}</h2>
          </div>
        </div>
        <div className="ml-auto flex items-end gap-6 pr-4 mb-2">
          {/* Explicitly wrap Home to push it down to the text baseline of the title */}
          <div className="text-[18px] font-medium tracking-wide hover:text-gray-200 transition-colors cursor-pointer select-none pb-[8px]">
            <Home />
          </div>
          <div className="flex gap-2">
         
          </div>
        </div>
      </div>
    </header>
  );
}
