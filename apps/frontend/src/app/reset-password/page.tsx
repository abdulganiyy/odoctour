"use client";
import { useEffect, useState } from "react";
import FormFactory from "@/components/custom/form-factory";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordFormSchema } from "@/schema/auth";
import { ArrowRightIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import AuthWrapper from "@/components/custom/auth-wrapper";
import { useToast } from "@/hooks/use-toast";

import type { FieldConfig, FormValues } from "@/types";

export const resetPasswordFormFields: FieldConfig[] = [
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "••••••••",
  },
];

export const resetPasswordErrorMessages = {
  GENERIC_ERROR: "There was an error resetting your password.",
} as const;

export default function ForgotPassword() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { GENERIC_ERROR } = resetPasswordErrorMessages;
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  async function handleResetPassword(data: FormValues): Promise<void> {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword: data.password }),
        }
      );

      if (response.ok) {
        const { message } = await response.json();
        toast({ description: message });
        setIsSubmitting(false);
      }
    } catch (error: any) {
      setError(GENERIC_ERROR);
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: GENERIC_ERROR,
      });
    }
  }

  return (
    <AuthWrapper>
      <FormFactory
        fields={resetPasswordFormFields}
        schema={resetPasswordFormSchema}
        formWrapperClassName="flex flex-col"
        formFieldElClass="w-full"
        onSubmit={handleResetPassword}
        actionButtonsComponent={
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            <Button
              onClick={() => router.push("/signin")}
              variant="link"
              type="button"
              className="text-sm font-semibold"
            >
              Sign In
            </Button>

            {error ? <Label className="text-destructive">{error}</Label> : null}
          </div>
        }
      />
    </AuthWrapper>
  );
}
