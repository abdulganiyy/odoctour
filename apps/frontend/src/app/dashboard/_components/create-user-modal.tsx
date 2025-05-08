import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import FormFactory from "@/components/custom/form-factory";

import type { FieldConfig, FormValues } from "@/types";
import { createNewUserFormSchema } from "@/schema/user";
import apiService from "@/lib/apiService";
import { useToast } from "@/hooks/use-toast";

export const createNewUserFormFields = (roles: any[]): FieldConfig[] => [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter phone number",
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
  {
    name: "picture",
    label: "Upload Picture",
    type: "picture-upload",
  },
];

export const createNewUserErrorMessages = {
  INVALID_CREDENTIALS: "Invalid credentials",
  NO_MATCHING_ROLES:
    "You do not have access to this portal. Contact your administrator for more information.",
  GENERIC_ERROR: "There was an error creating a user.",
} as const;

export function CreateUserModal() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { GENERIC_ERROR } = createNewUserErrorMessages;
  const [roles, setRoles] = useState<any[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const getRoles = async () => {
      try {
        const response = await apiService.get("/role");
        setRoles(response);
      } catch (error) {
        console.log(error);
      }
    };

    getRoles();
  }, []);

  async function handleCreateUser(data: FormValues | any): Promise<void> {
    setError(null);
    setIsSubmitting(true);

    console.log(data);

    const { confirmPassword, role, picture, ...payload } = data;

    try {
      await apiService.post("/user", {
        ...payload,
        roleId: role,
        profilePictureId: picture.id,
      });

      setIsSubmitting(false);
      toast({ description: "New user has been successfully created" });
    } catch (error: any) {
      setError(GENERIC_ERROR);
      setIsSubmitting(false);
      toast({ variant: "destructive", description: error.message });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-black text-white">Add New User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <FormFactory
          fields={createNewUserFormFields(roles)}
          schema={createNewUserFormSchema}
          formWrapperClassName="flex flex-col"
          formFieldElClass="w-full"
          onSubmit={handleCreateUser}
          actionButtonsComponent={
            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>

              {error ? (
                <Label className="text-destructive">{error}</Label>
              ) : null}
            </div>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
