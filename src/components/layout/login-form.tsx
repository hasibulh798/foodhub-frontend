"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Chrome } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters!"),
});

export function LoginForm() {
  const router = useRouter();

  const GoogleLoginHandler = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Authenticating...");
      try {
        const { data, error } = await authClient.signIn.email(value);
        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }
        toast.success("Welcome back!", { id: toastId });
        router.push("/");
      } catch (error) {
        toast.error("Authentication failed. Please try again.", { id: toastId });
      }
    },
  });

  return (
    <div className="w-full space-y-8">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup className="space-y-6">
          <form.Field name="email">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="alex@example.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
                    />
                  </div>
                  {isInvalid && <FieldError className="text-[10px] font-bold text-red-500 mt-1 ml-2" errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="password">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">
                      Password
                    </label>
                    <button type="button" className="text-[10px] font-black uppercase tracking-widest text-orange-600 hover:underline">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      placeholder="••••••••"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
                    />
                  </div>
                  {isInvalid && <FieldError className="text-[10px] font-bold text-red-500 mt-1 ml-2" errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full h-16 rounded-[1.5rem] bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
          <span className="bg-white dark:bg-zinc-900 px-4 text-gray-300">Or connect with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={GoogleLoginHandler}
        className="w-full h-14 rounded-2xl border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-3 font-bold text-gray-600"
      >
        <Chrome size={20} className="text-red-500" />
        <span>Continue with Google</span>
      </Button>
    </div>
  );
}
