"use client";
import { useState } from "react";
import FormFactory from "@/components/custom/form-factory";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signUpFormSchema } from "@/schema/auth";
import { ArrowRightIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { jwtDecode } from "jwt-decode";
import AuthWrapper from "@/components/custom/auth-wrapper";
import { useToast } from "@/hooks/use-toast";

import type { FieldConfig, FormValues } from "@/types";

export const signUpFormFields: FieldConfig[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
  },
  {
    name: "firstname",
    label: "First Name",
    type: "text",
    placeholder: "Enter your First Name",
  },
  {
    name: "lastname",
    label: "Last Name",
    type: "text",
    placeholder: "Enter your Last Name",
  },
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

export const signUpErrorMessages = {
  INVALID_CREDENTIALS: "Invalid credentials",
  NO_MATCHING_ROLES:
    "You do not have access to this portal. Contact your administrator for more information.",
  GENERIC_SINUP_ERROR: "There was an error signing up.",
} as const;

export default function SignUp() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const { INVALID_CREDENTIALS, NO_MATCHING_ROLES, GENERIC_SINUP_ERROR } =
    signUpErrorMessages;

  const { toast } = useToast();

  async function handleSignUp(data: FormValues): Promise<void> {
    setSignUpError(null);
    setIsSubmitting(true);

    console.log(data);

    const { confirmPassword, ...payload } = data;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const { access_token } = await response.json();
        // await createSession(access_token)
        const decodedToken = jwtDecode(access_token) as any;

        console.log(decodedToken);

        let role = decodedToken.role;

        if (role) {
          toast({ description: "You have successfully signed up" });
          setTimeout(() => {
            router.push(`/dashboard`);
          }, 500);
        } else {
          setSignUpError(NO_MATCHING_ROLES);
          setIsSubmitting(false);
          toast({ variant: "destructive", description: NO_MATCHING_ROLES });
        }
      } else {
        const errorMessage =
          response.status === 401 ? INVALID_CREDENTIALS : GENERIC_SINUP_ERROR;
        setSignUpError(errorMessage);
        setIsSubmitting(false);
        toast({ variant: "destructive", description: errorMessage });
      }
    } catch (error) {
      setSignUpError(GENERIC_SINUP_ERROR);
      setIsSubmitting(false);
      toast({ variant: "destructive", description: GENERIC_SINUP_ERROR });
    }
  }

  return (
    <AuthWrapper>
      <FormFactory
        fields={signUpFormFields}
        schema={signUpFormSchema}
        formWrapperClassName="flex flex-col"
        formFieldElClass="w-full"
        onSubmit={handleSignUp}
        actionButtonsComponent={
          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white"
            >
              {isSubmitting ? "Signing up..." : "Sign up"}
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="link"
              type="button"
              className="text-sm font-semibold"
            >
              Sign In
            </Button>
            <Button
              onClick={() => router.push("/forgot-password")}
              variant="link"
              type="button"
              className="text-sm font-semibold -mt-4"
            >
              Forgot Password <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>

            {signUpError ? (
              <Label className="text-destructive">{signUpError}</Label>
            ) : null}
          </div>
        }
      />
    </AuthWrapper>
  );
}
