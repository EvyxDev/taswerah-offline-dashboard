import { getAuthToken } from "@/lib/utils/auth.token";
import FolderPage from "./_components/folder-pagr";
import { getPhotosByBarcode } from "@/lib/api/barcodes";

interface PageProps {
  params: {
    folderId: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function Page({ params }: PageProps) {
  const folderId = params?.folderId;
  const token = await getAuthToken();
  const photos = await getPhotosByBarcode(token || "", folderId || "");
  return (
    <>
      <FolderPage photos={photos} />
    </>
  );
}
