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
import { cn } from "@/lib/utils";

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
        callbackURL: process.env.NEXT_PUBLIC_FRONTEND_URL,
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
        toast.success("Welcome back to Food Hub!", { id: toastId });
        router.push("/");
      } catch (error) {
        toast.error("Authentication failed. Please check your credentials.", { id: toastId });
      }
    },
  });

  return (
    <div className="w-full space-y-10">
      <form
        className="space-y-8"
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
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">
                    Email Identity
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="alex@culinary.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-16 pl-12 rounded-[1.5rem] border-border/50 bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold text-base"
                    />
                  </div>
                  {isInvalid && <FieldError className="text-[10px] font-black text-destructive mt-2 ml-4 uppercase tracking-wider" errors={field.state.meta.errors} />}
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
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                      Security Code
                    </label>
                    <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4 transition-all">
                      Recovery?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      placeholder="••••••••"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-16 pl-12 rounded-[1.5rem] border-border/50 bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold text-base"
                    />
                  </div>
                  {isInvalid && <FieldError className="text-[10px] font-black text-destructive mt-2 ml-4 uppercase tracking-wider" errors={field.state.meta.errors} />}
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
              className="w-full h-16 rounded-[1.5rem] bg-foreground text-background hover:bg-primary hover:text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border-none"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-3 border-current border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <LogIn size={20} strokeWidth={3} />
                  <span>Authenticate</span>
                </>
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50"></div>
        </div>
        <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em]">
          <span className="bg-card px-6 text-muted-foreground">OR CONNECT VIA</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={GoogleLoginHandler}
        className="w-full h-16 rounded-[1.5rem] border-border/50 bg-muted/20 hover:bg-muted/50 hover:border-border transition-all flex items-center justify-center gap-4 font-black text-[10px] uppercase tracking-widest text-foreground group"
      >
        <div className="bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
            <Chrome size={18} className="text-rose-500" />
        </div>
        <span>Sign in with Google</span>
      </Button>
    </div>
  );
}
