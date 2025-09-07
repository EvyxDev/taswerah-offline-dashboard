import SettingsPage from "./_components/settings-page";
import { GetAllFrames } from "@/lib/api/frames.api";
import { GetAllStickers } from "@/lib/api/stickers.api";
import { getAuthToken } from "@/lib/utils/auth.token";

export default async function Page() {
  const token = await getAuthToken();
  const [frames, stickers] = await Promise.all([
    GetAllFrames(token || ""),
    GetAllStickers(token || ""),
  ]);

  // Normalize to shape expected by client

  return <SettingsPage frames={frames} stickers={stickers} />;
}
