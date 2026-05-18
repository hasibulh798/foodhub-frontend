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
import { providerServices } from "@/services/provider.service";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, Store, MapPin, Image as ImageIcon, Banknote, Chrome, Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, "Owner identity is required"),
  email: z.string().email("Invalid email identity"),
  password: z.string().min(8, "Security code must be at least 8 characters"),
  phone: z.string().min(11, "Valid contact number required"),
  businessName: z.string().min(3, "Restaurant name is required"),
  address: z.string().min(3, "Operating address is required"),
  logoUrl: z.string().url("Valid logo URL required"),
  deliveryFee: z.number().min(0, "Delivery fee must be 0 or more"),
});

export function RestaurantForm2() {
  const GoogleLoginHandler = async () => {
    try {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
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
      businessName: "",
      address: "",
      logoUrl: "",
      deliveryFee: 60,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Registering your culinary brand...");
      try {
        const res = await providerServices.createProvider(value);
        if(!res.data){
          toast.error("Registration failed. Please verify your details.", { id: toastId });
          return;
        }
        toast.success("Welcome to the Food Hub family!", { id: toastId });
        router.push("/");
      } catch (error) {
        toast.error("Process failed. Please try again later.", { id: toastId });
      }
    },
  });

  return (
    <div className="w-full space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
      <form
        id="reg-form"
        className="space-y-10"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary bg-primary/5 w-fit px-3 py-1 rounded-full">Owner Details</h3>
                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form.Field name="name">
                    {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                        <Field data-invalid={isInvalid} className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Identity</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                id={field.name}
                                name={field.name}
                                type="text"
                                placeholder="Owner Name"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="h-14 pl-12 rounded-2xl border-border/50 bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm"
                            />
                        </div>
                        {isInvalid && <FieldError className="text-[10px] font-black text-destructive mt-1 ml-2 uppercase" errors={field.state.meta.errors} />}
                        </Field>
                    );
                    }}
                </form.Field>

                <form.Field name="email">
                    {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                        <Field data-invalid={isInvalid} className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                id={field.name}
                                name={field.name}
                                type="email"
                                placeholder="owner@email.com"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="h-14 pl-12 rounded-2xl border-border/50 bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm"
                            />
                        </div>
                        {isInvalid && <FieldError className="text-[10px] font-black text-destructive mt-1 ml-2 uppercase" errors={field.state.meta.errors} />}
                        </Field>
                    );
                    }}
                </form.Field>

                <form.Field name="password">
                    {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                        <Field data-invalid={isInvalid} className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Security</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                id={field.name}
                                name={field.name}
                                type="password"
                                placeholder="••••••••"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="h-14 pl-12 rounded-2xl border-border/50 bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm"
                            />
                        </div>
                        {isInvalid && <FieldError className="text-[10px] font-black text-destructive mt-1 ml-2 uppercase" errors={field.state.meta.errors} />}
                        </Field>
                    );
                    }}
                </form.Field>

                <form.Field name="phone">
                    {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                        <Field data-invalid={isInvalid} className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Contact</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                id={field.name}
                                name={field.name}
                                type="text"
                                placeholder="+880 1XXX XXXXXX"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="h-14 pl-12 rounded-2xl border-border/50 bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm"
                            />
                        </div>
                        {isInvalid && <FieldError className="text-[10px] font-black text-destructive mt-1 ml-2 uppercase" errors={field.state.meta.errors} />}
                        </Field>
                    );
                    }}
                </form.Field>
                </FieldGroup>
            </div>

            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 bg-emerald-500/5 w-fit px-3 py-1 rounded-full">Brand Details</h3>
                <FieldGroup className="grid grid-cols-1 gap-6">
                <form.Field name="businessName">
                    {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                        <Field data-invalid={isInvalid} className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Restaurant Name</label>
                        <div className="relative group">
                            <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                            <Input
                                id={field.name}
                                name={field.name}
                                type="text"
                                placeholder="Gourmet Kitchen"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="h-14 pl-12 rounded-2xl border-border/50 bg-muted/30 focus:bg-background focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm"
                            />
                        </div>
                        {isInvalid && <FieldError className="text-[10px] font-black text-destructive mt-1 ml-2 uppercase" errors={field.state.meta.errors} />}
                        </Field>
                    );
                    }}
                </form.Field>

                <form.Field name="address">
                    {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                        <Field data-invalid={isInvalid} className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Address</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                            <Input
                                id={field.name}
                                name={field.name}
                                type="text"
                                placeholder="Full operating address"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="h-14 pl-12 rounded-2xl border-border/50 bg-muted/30 focus:bg-background focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm"
                            />
                        </div>
                        {isInvalid && <FieldError className="text-[10px] font-black text-destructive mt-1 ml-2 uppercase" errors={field.state.meta.errors} />}
                        </Field>
                    );
                    }}
                </form.Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form.Field name="logoUrl">
                        {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                            <Field data-invalid={isInvalid} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Brand Logo</label>
                            <div className="relative group">
                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="text"
                                    placeholder="https://..."
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="h-14 pl-12 rounded-2xl border-border/50 bg-muted/30 focus:bg-background focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm"
                                />
                            </div>
                            {isInvalid && <FieldError className="text-[10px] font-black text-destructive mt-1 ml-2 uppercase" errors={field.state.meta.errors} />}
                            </Field>
                        );
                        }}
                    </form.Field>

                    <form.Field name="deliveryFee">
                        {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                            <Field data-invalid={isInvalid} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Fee (BDT)</label>
                            <div className="relative group">
                                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="number"
                                    placeholder="60"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(Number(e.target.value))}
                                    className="h-14 pl-12 rounded-2xl border-border/50 bg-muted/30 focus:bg-background focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm"
                                />
                            </div>
                            {isInvalid && <FieldError className="text-[10px] font-black text-destructive mt-1 ml-2 uppercase" errors={field.state.meta.errors} />}
                            </Field>
                        );
                        }}
                    </form.Field>
                </div>
                </FieldGroup>
            </div>
        </div>

        <div className="space-y-4 pt-6">
            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
                {([canSubmit, isSubmitting]) => (
                    <Button
                        disabled={!canSubmit || isSubmitting}
                        className="w-full h-16 rounded-[1.5rem] bg-foreground text-background hover:bg-emerald-500 hover:text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border-none"
                        type="submit"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initiate Brand"}
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
