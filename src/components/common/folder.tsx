import Image from "next/image";

export interface FolderProps {
  code: {
    barcode: string;
    size_bytes: number;
    size: string;
    date: string;
  };
}
export default function Folder({ code }: FolderProps) {
  return (
    <div className="flex gap-3 bg-[#FAFAFA] p-4 rounded-sm w-full  max-w-[300px] mt-3">
      <Image
        src={"/assets/Folder.svg"}
        alt="folder-icon"
        width={35}
        height={30}
      />
      <div>
        <p className="font-medium text-sm text-[#324054]">{code?.barcode}</p>
        <span className="text-[#71839B] font-medium text-sm">{code?.size}</span>
        <span className="text-[#71839B] font-medium text-sm block">
          {code?.date}
        </span>
      </div>
    </div>
  );
}
