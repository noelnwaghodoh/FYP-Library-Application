import FrontPageButton from "./studentfrontpagebutton";
import Header from "./header";
import Home from "./home";
import { useRouter } from "next/navigation";

export default function PageHeader({ title, backRoute, onBackClick, children }) {
  const router = useRouter();
  
  return (
    <header className="bg-[#2596BE] text-white py-4 px-2 shadow-sm relative z-10">
      <div className="flex items-center justify-between w-full">
        {/* Left Side: Optional Back Arrow + Title */}
        <div className="flex items-center gap-4">
          {(backRoute || onBackClick) && (
            <button onClick={onBackClick ? onBackClick : () => router.push(backRoute)} className="text-white hover:text-gray-200 transition-transform hover:-translate-x-1 ml-4 h-full flex items-center justify-center">
               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
               </svg>
            </button>
          )}
          <h2 className={`text-[20px] font-semibold tracking-wide leading-none select-none m-0 ${backRoute ? "ml-0" : "ml-4"}`}>
            {title}
          </h2>
        </div>
        
        {/* Right Side: Optional Toggles + Home Routing Link */}
        <div className="flex items-center gap-8 pr-6 h-full">
          <div className="flex items-center gap-3">
             {children}
          </div>
          <div className="flex items-center gap-6">
            <span onClick={() => router.push('/staff')} className="text-[15px] font-bold uppercase tracking-wider hover:text-gray-200 transition-colors cursor-pointer select-none opacity-90 hover:opacity-100">
              STAFF
            </span>
            <div className="text-[17px] font-medium tracking-wider hover:text-gray-200 transition-colors cursor-pointer select-none leading-none">
              <Home />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
