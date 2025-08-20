import { useMutation } from "@tanstack/react-query";
import editPhotographer from "../_actions/edit-photographer";

export default function useEditPhotographer() {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({
      data,
      id,
    }: {
      data: CreatePhotographerBody;
      id: string;
    }) => {
      const payload = await editPhotographer(data, id);
      if ("errors" in payload) {
        throw new Error("Error Editing Photographer");
      }
      return payload;
    },
  });

  return { EditPhotographer: mutate, EditPending: isPending, EditError: error };
}
