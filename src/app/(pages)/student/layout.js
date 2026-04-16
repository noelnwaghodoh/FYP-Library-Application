// Implemented via AI
import Header from "@/components/ui/header";

export default function StudentLayout({ children }) {
  return (
    <>
      {/* 
        This automatically drops the Pomodoro Timer tracking engine uniformly 
        above every single student-mapped route segment without duplication 
      */}
      <Header />
      {children}
    </>
  );
}
