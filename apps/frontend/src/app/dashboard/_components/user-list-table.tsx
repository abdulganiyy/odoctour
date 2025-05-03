import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const users = [
  {
    id: "1",
    firstname: "Balogun",
    lastname: "Abdulganiyy",
    email: "abdul@servant.io",
    role: "User",
  },
  {
    id: "2",
    firstname: "Taofeek",
    lastname: "Mutalib",
    email: "mutolib@nig.io",
    role: "User",
  },
  {
    id: "3",
    firstname: "Adigun",
    lastname: "Tola",
    email: "tola@me.io",
    role: "Doctor",
  },
  {
    id: "4",
    firstname: "Dairo",
    lastname: "Mubarak",
    email: "dairo@gb.io",
    role: "Admin",
  },
];

const UserListTable = () => {
  return (
    <div className="mt-2 border-[1px] border-solid border-gray-300 rounded-sm">
      <Table>
        {/* <TableCaption>A list of your recent users.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.firstname}</TableCell>
              <TableCell>{user.lastname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserListTable;
