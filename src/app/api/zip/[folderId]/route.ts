import JSZip from "jszip";
import { getAuthToken } from "@/lib/utils/auth.token";
import { getPhotosByBarcode } from "@/lib/api/barcodes";

export const runtime = "nodejs";

// Extended Photo type that includes the type field
interface PhotoWithType extends Photo {
  type: string | null;
}

// Helper function to determine if image is small or large based on type field
function isSmallImage(photoType: string | null): boolean {
  return photoType === "small";
}

export async function GET(
  _req: Request,
  context: { params: { folderId: string } }
) {
  try {
    const folderId = context.params.folderId;
    if (!folderId) {
      return new Response("Missing folderId", { status: 400 });
    }

    const token = await getAuthToken();
    const photos = await getPhotosByBarcode(token || "", folderId);

    const zip = new JSZip();
    const mainFolder = zip.folder(folderId)!;
    const smallFolder = mainFolder.folder("small")!;
    const largeFolder = mainFolder.folder("large")!;

    await Promise.all(
      (photos || []).map(async (photo, index) => {
        const fileUrl = photo.file_path;
        const res = await fetch(fileUrl);
        if (!res.ok) {
          throw new Error(`Failed to fetch ${fileUrl}`);
        }
        const arrayBuffer = await res.arrayBuffer();
        const fileNameFromPath =
          fileUrl.split("/").pop() || `image_${index + 1}.jpg`;

        // Determine if image is small or large based on type field
        const isSmall = isSmallImage((photo as PhotoWithType).type);

        // Place image in appropriate folder
        if (isSmall) {
          smallFolder.file(fileNameFromPath, arrayBuffer);
        } else {
          largeFolder.file(fileNameFromPath, arrayBuffer);
        }
      })
    );

    const content = await zip.generateAsync({ type: "arraybuffer" });

    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${folderId}.zip"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("ZIP route error:", error);
    return new Response("Failed to generate ZIP", { status: 500 });
  }
}
