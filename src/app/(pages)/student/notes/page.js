import Header from "@/components/ui/header";
import PageHeader from "@/components/ui/pageheader";
import { FolderCard, FileCard, AddFolderButton, AddFileButton } from "./note-util";

export default function Page() {

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);

  
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header pulling styles from existing central repository */}
      <PageHeader title="Notes" />

      {/* Main Container handling the Horizontal layout of the Note Explorer Component Grid */}
      <main className="px-10 py-12">
        <div className="flex flex-row gap-6 flex-wrap items-start max-w-4xl">
          
          {/* Active Folder with Documents */}
          <FolderCard label="Folder 1" hasDocs={true} />
          
          {/* Empty Folder */}
          <FolderCard label="Folder 2" hasDocs={false} />
          
          {/* Single Note File */}
          <FileCard label="File 1" />
          
          {/* Utility Creators */}
          <AddFolderButton />
          
          <AddFileButton />
        </div>
      </main>
    </div>
  );
}
