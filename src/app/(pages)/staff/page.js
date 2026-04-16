"use client";
import PageHeader from "@/components/ui/pageheader";
import FrontPageButton from "@/components/ui/studentfrontpagebutton";

export default function StaffDashboard() {
  return (
    <main className="min-h-screen bg-gray-50/30">
      <PageHeader title="Welcome," />
      
      <div className="flex flex-col md:flex-row items-center justify-center min-h-[65vh] gap-16 p-8">
        
        <FrontPageButton
          text="Manage the Catalogue"
          imageSource="/images/manage-books.png" 
          imageWidth={130}
          imageHeight={130}
          altText="Manage Catalogue Icon"
          link="/staff/manage-catalogue"
        />
        
        <FrontPageButton
          text="Add a new Book"
          imageSource="/images/add-book.png" 
          imageWidth={130}
          imageHeight={130}
          altText="Add Book Icon"
          link="/staff/add-a-book"
        />

      </div>
    </main>
  );
}