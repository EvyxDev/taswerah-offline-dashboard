import Image from "next/image";

interface FolderProps {
  id?: string;
}
export default function Folder({ id = "112131" }: FolderProps) {
  return (
    <div className="flex items-center gap-3 bg-[#FAFAFA] p-4 rounded-sm w-full  max-w-[300px] mt-3">
      <Image
        src={"/assets/Folder.svg"}
        alt="folder-icon"
        width={35}
        height={30}
      />
      <div className="">
        <p className="font-medium text-sm text-[#324054]">{id}</p>
        <span className="text-[#71839B] font-medium text-sm">
          313 KB . 31 Aug, 2022{" "}
        </span>
      </div>
    </div>
  );
}
