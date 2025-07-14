import Image from "next/image";
import React from "react";
import {
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PasswordInput } from "@/components/common/password-input";
import { DialogSwicher } from "./dialog-swicher";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFields, useLoginSchema } from "@/lib/schemes/auth.schema";
import useLogin from "../_hooks/use-login";

export default function LoginDialog() {
  const { isPending, error, login } = useLogin();
  const loginSchema = useLoginSchema();

  const form = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFields) => {
    login(data, {
      onSuccess: (data) => {
        console.log(data);
      },
    });
  };

  return (
    <DialogContent className="bg-white/30 border-none backdrop-blur-[75px] rounded-3xl w-full max-w-[90%] sm:max-w-[480px] md:max-w-[520px] lg:max-w-[560px] xl:max-w-[600px] 2xl:max-w-[640px]">
      <DialogHeader className="sr-only">
        <DialogTitle>Login Required</DialogTitle>
        <DialogClose />
      </DialogHeader>
      <DialogDescription className="sr-only"></DialogDescription>
      <DialogFooter className="sr-only"></DialogFooter>

      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 pb-4 sm:pb-6 2xl:pb-7 pt-1 px-2 sm:px-4">
        <div className="mb-1 self-end">
          <DialogSwicher />
        </div>

        <Image
          src="/assets/white-logo.png"
          alt="Logo"
          width={256}
          height={56}
          className="w-48 sm:w-56 md:w-60 lg:w-64 2xl:w-64 h-auto"
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col max-w-96 space-y-5"
          >
            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="mt-3 sm:mt-4 2xl:mt-5">
                  <FormLabel className="sr-only">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Phone Number"
                      className="h-12 sm:h-13 2xl:h-14 w-full placeholder:font-homenaje rounded-lg border border-gray-400 bg-white/80 p-2 px-3 pe-8 sm:pe-10 text-xs sm:text-sm focus:outline-none focus:ring-0"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Input */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel className="sr-only">Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Password"
                      className="h-12 sm:h-13 2xl:h-14 w-full placeholder:font-homenaje rounded-lg border border-gray-400 bg-white/80 p-2 px-3 pr-8 sm:pr-10 text-xs sm:text-sm focus:outline-none focus:ring-0"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center mt-2">
                {error.message}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="main-button self-center font-homenaje mt-3 sm:mt-4 h-[50px] sm:h-[55px] 2xl:h-[60px] w-48 sm:w-52 2xl:w-56 bg-[#202020] text-lg sm:text-xl"
            >
              {isPending ? "Confirming..." : "Confirm"}
            </Button>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
}
