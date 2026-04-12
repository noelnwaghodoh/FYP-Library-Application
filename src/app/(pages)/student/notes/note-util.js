import React from 'react';
import Image from 'next/image';

export function FolderCard({ label }) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-transform w-[90px]">
      <Image 
        src="/images/folder.png" 
        alt="Folder Icon"
        width={72} 
        height={72} 
        className="object-contain"
      />
      <span className="text-[14px] font-normal text-gray-800 text-center">{label}</span>
    </div>
  );
}

export function FileCard({ label }) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-transform w-[90px]">
      <Image 
        src="/images/file (1).png" 
        alt="File Icon"
        width={72} 
        height={72} 
        className="object-contain"
      />
      <span className="text-[14px] font-normal text-gray-800 text-center">{label}</span>
    </div>
  );
}

export function AddFolderButton() {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-transform w-[90px]">
      <Image 
        src="/images/add-folder.png" 
        alt="Add Folder"
        width={72} 
        height={72} 
        className="object-contain"
      />
      {/* Empty span to maintain exact height alignment with actual folders */}
      <span className="text-[14px] text-transparent select-none">&nbsp;</span>
    </div>
  );
}

export function AddFileButton() {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-transform w-[90px]">
      <Image 
        src="/images/add-file.png" 
        alt="Add File"
        width={72} 
        height={72} 
        className="object-contain"
      />
      {/* Empty span to maintain exact height alignment with actual folders */}
      <span className="text-[14px] text-transparent select-none">&nbsp;</span>
    </div>
  );
}
