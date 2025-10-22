import { useMutation } from "@tanstack/react-query";
import { SubmitOrderAction } from "../_action/submit-order";

type SubmitOrderData = {
  orderId: number;
  shift_id: number;
  pay_amount: number;
};

export default function useSubmitOrder() {
  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: async (data: SubmitOrderData) => {
      const payload = await SubmitOrderAction(data.orderId, {
        shift_id: data.shift_id,
        pay_amount: data.pay_amount,
      });

      if ("success" in payload && payload.success === false) {
        throw new Error(payload.message);
      }

      return payload;
    },
  });

  return {
    submitOrder: mutate,
    isSubmitting: isPending,
    submitError: error,
    isSuccess,
  };
}
