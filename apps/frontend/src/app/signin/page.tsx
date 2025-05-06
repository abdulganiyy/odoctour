"use client";
import { useEffect, useState } from "react";
import FormFactory from "@/components/custom/form-factory";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { loginFormSchema } from "@/schema/auth";
import { ArrowRightIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { jwtDecode } from "jwt-decode";
import AuthWrapper from "@/components/custom/auth-wrapper";
import { useToast } from "@/hooks/use-toast";

import type { FieldConfig, FormValues } from "@/types";

export const loginFormFields: FieldConfig[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
  },
];

export const loginErrorMessages = {
  INVALID_CREDENTIALS: "Invalid username or password.",
  NO_MATCHING_ROLES:
    "You do not have access to this portal. Contact your administrator for more information.",
  GENERIC_LOGIN_ERROR: "There was an error logging in.",
} as const;

export default function Home() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { INVALID_CREDENTIALS, NO_MATCHING_ROLES, GENERIC_LOGIN_ERROR } =
    loginErrorMessages;

  const { toast } = useToast();

  async function handleLogin(data: FormValues): Promise<void> {
    setLoginError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const { access_token } = await response.json();
        // createSession(access_token)
        console.log(access_token);

        if (typeof window !== "undefined") {
          document.cookie = `session=${access_token};`;
        }

        const decodedToken = jwtDecode(access_token) as any;

        console.log(decodedToken);

        let role = decodedToken.role;

        console.log(role);

        if (role) {
          setTimeout(() => {
            let triedConsultation = localStorage.getItem("triedConsultation");

            toast({ description: "Login Successful" });

            if (triedConsultation && role == "User") {
              router.push("/meetings/93e3430a-5aaa-4d5e-92e0-402acbe22d94");
            } else {
              router.push(`/dashboard`);
            }
          }, 500);
        } else {
          setLoginError(NO_MATCHING_ROLES);
          setIsSubmitting(false);
        }
      } else {
        const errorMessage =
          response.status === 401 ? INVALID_CREDENTIALS : GENERIC_LOGIN_ERROR;
        setLoginError(errorMessage);
        setIsSubmitting(false);
      }
    } catch (error) {
      setLoginError(GENERIC_LOGIN_ERROR);
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        description: GENERIC_LOGIN_ERROR,
      });
    }
  }

  return (
    <AuthWrapper>
      <FormFactory
        fields={loginFormFields}
        schema={loginFormSchema}
        formWrapperClassName="flex flex-col"
        formFieldElClass="w-full"
        onSubmit={handleLogin}
        actionButtonsComponent={
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
            <Button
              onClick={() => router.push("/signup")}
              variant="link"
              //   variant="secondary"
              type="button"
              className="text-sm font-semibold"
            >
              Sign Up
            </Button>
            <Button
              onClick={() => router.push("/forgot-password")}
              variant="link"
              type="button"
              className="text-sm font-semibold -mt-4"
            >
              Forgot Password <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>

            {loginError ? (
              <Label className="text-destructive">{loginError}</Label>
            ) : null}
          </div>
        }
      />
    </AuthWrapper>
  );
}
