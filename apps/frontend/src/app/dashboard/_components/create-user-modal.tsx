import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormFactory from "@/components/custom/form-factory";

import type { FieldConfig, FormValues } from "@/types";
import { createNewUserFormSchema } from "@/schema/user";
import apiService from "@/lib/apiService";

export const createNewUserFormFields = (roles: any[]): FieldConfig[] => [
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
  {
    name: "role",
    type: "select",
    label: "Role",
    options: roles.map((role) => ({ label: role.name, value: role.id })),
  },
];

export const createNewUserErrorMessages = {
  INVALID_CREDENTIALS: "Invalid credentials",
  NO_MATCHING_ROLES:
    "You do not have access to this portal. Contact your administrator for more information.",
  GENERIC_ERROR: "There was an error signing up.",
} as const;

export function CreateUserModal() {
  // const { setRoles, setUserData, setAccessToken } = useUserInfo();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { GENERIC_ERROR } = createNewUserErrorMessages;
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    const getRoles = async () => {
      try {
        const response = await apiService.get("/role");
        setRoles(response);

        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    getRoles();
  }, []);

  async function handleSignUp(data: FormValues): Promise<void> {
    setError(null);
    setIsSubmitting(true);

    console.log(data);

    const { confirmPassword, role, ...payload } = data;

    try {
      const response = await apiService.post("/user/doctor", {
        ...payload,
        roleId: role,
      });
      setIsSubmitting(false);
      //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(payload),
      //   });
    } catch (error) {
      console.log(error);
      setError(GENERIC_ERROR);
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-black text-white">Add New User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          {/* <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription> */}
        </DialogHeader>
        {/* <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy />
          </Button>
        </div> */}
        <FormFactory
          fields={createNewUserFormFields(roles)}
          schema={createNewUserFormSchema}
          formWrapperClassName="flex flex-col"
          formFieldElClass="w-full"
          onSubmit={handleSignUp}
          actionButtonsComponent={
            <div className="flex flex-col gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>

              {error ? (
                <Label className="text-destructive">{error}</Label>
              ) : null}
            </div>
          }
        />
        {/* <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
