"use server";
import { revalidatePath } from "next/cache";

interface UploadResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function uploadPhotosAction(
  formData: FormData
): Promise<UploadResponse> {
  try {
    const response = await fetch(
      "https://taswera.evyx.lol/api/branch-manager/photos/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    revalidatePath("/");
    revalidatePath("/employee-photos");
    if (response.ok) {
      return {
        success: true,
        message: "Photos uploaded successfully!",
      };
    } else {
      const errorData = await response.text();
      console.log(errorData);
      return {
        success: false,
        error: `Upload failed: ${response.status} ${response.statusText}`,
      };
    }
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
