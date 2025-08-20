import { useMutation } from "@tanstack/react-query";
import createPhotographer from "../_actions/create-photographer";

export default function useCreatePhotographer() {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: CreatePhotographerBody) => {
      const payload = await createPhotographer(data);
      if ("errors" in payload) {
        throw new Error("error creating Photographer");
      }
      return payload;
    },
  });
  return { AddPhotographer: mutate, AddPending: isPending, AddError: error };
}
