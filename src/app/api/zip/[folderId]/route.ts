import JSZip from "jszip";
import { getAuthToken } from "@/lib/utils/auth.token";
import { getPhotosByBarcode } from "@/lib/api/barcodes";

export const runtime = "nodejs";

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
    const folder = zip.folder(folderId)!;

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
        folder.file(fileNameFromPath, arrayBuffer);
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
