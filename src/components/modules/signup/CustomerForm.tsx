/* eslint-disable react/no-children-prop */
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
import { User, Mail, Lock, Phone, Chrome, Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Identity is required"),
  email: z.string().email("Invalid email identity"),
  password: z.string().min(8, "Security code must be at least 8 characters"),
  phone: z.string().min(11, "Valid contact number required"),
});

export function CustomerForm() {
  const GoogleLoginHandler = async () => {
    try {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: process.env.NEXT_PUBLIC_FRONTEND_URL,
        });
    } catch (err) {
        toast.error("Google connection failed");
    }
  };
  
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating your gourmet profile...");
      try {
        const { data, error } = await authClient.signUp.email(value);
        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }
        toast.success("Welcome to the community!", { id: toastId });
        router.push("/login");
      } catch (error) {
        toast.error("Process failed. Please try again.", { id: toastId });
      }
    },
  });

  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <form
        id="reg-form"
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup className="space-y-6">
          <form.Field name="name">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">
                    Full Identity
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="Alex Gourmet"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-16 pl-12 rounded-[1.5rem] border-border/50 bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    />
                  </div>
                  {isInvalid && <FieldError className="text-[10px] font-black text-destructive mt-2 ml-4 uppercase tracking-wider" errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="email">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="alex@example.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-16 pl-12 rounded-[1.5rem] border-border/50 bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold"
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
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">
                    Security Code
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      placeholder="••••••••"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-16 pl-12 rounded-[1.5rem] border-border/50 bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    />
                  </div>
                  {isInvalid && <FieldError className="text-[10px] font-black text-destructive mt-2 ml-4 uppercase tracking-wider" errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="phone">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">
                    Contact Number
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="+880 1XXX XXXXXX"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-16 pl-12 rounded-[1.5rem] border-border/50 bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    />
                  </div>
                  {isInvalid && <FieldError className="text-[10px] font-black text-destructive mt-2 ml-4 uppercase tracking-wider" errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>

        <div className="space-y-4">
            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
                {([canSubmit, isSubmitting]) => (
                    <Button
                        disabled={!canSubmit || isSubmitting}
                        className="w-full h-16 rounded-[1.5rem] bg-foreground text-background hover:bg-primary hover:text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border-none"
                        type="submit"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Establish Profile"}
                    </Button>
                )}
            </form.Subscribe>

            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em]">
                    <span className="bg-card px-6 text-muted-foreground">Or connect via</span>
                </div>
            </div>

            <Button
                className="w-full h-16 rounded-[1.5rem] border-border/50 bg-muted/20 hover:bg-muted/50 transition-all flex items-center justify-center gap-4 font-black text-[10px] uppercase tracking-widest text-foreground group"
                onClick={() => GoogleLoginHandler()}
                variant="outline"
                type="button"
            >
                <div className="bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    <Chrome size={18} className="text-rose-500" />
                </div>
                <span>Sync with Google</span>
            </Button>
        </div>
      </form>
    </div>
  );
}
