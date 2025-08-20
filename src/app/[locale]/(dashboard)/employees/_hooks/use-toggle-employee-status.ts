import { useMutation } from "@tanstack/react-query";
import togglePhotographerStatus from "../_actions/toggle-photographer-status";

interface TogglePhotographerStatusParams {
  photographerId: string | number;
  status: "active" | "inactive";
}

export default function useToggleEmployeeStatus() {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ photographerId, status }: TogglePhotographerStatusParams) => {
      const payload = await togglePhotographerStatus(photographerId, status);
      if ("errors" in payload) {
        throw new Error("Error toggling employee status");
      }
      return payload;
    },
  });

  return {
    toggleStatus: mutate,
    togglePending: isPending,
    toggleError: error,
  };
}
