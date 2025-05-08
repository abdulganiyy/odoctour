import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import apiService from "@/lib/apiService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePaginationFooter from "./table-pagination-footer";
import InitialsAvatar from "@/components/custom/initial-avatar";

const UsersTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [data, setData] = useState<any[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const usersList = data;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = usersList
    ? usersList.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = usersList ? Math.ceil(usersList.length / itemsPerPage) : 0;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiService.get(`/user`);
        setData(response);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      {isLoading ? (
        <p className="text-center py-4">Loading meetings...</p>
      ) : (
        <>
          {/* Mobile View */}

          {/* Desktop View */}
          <div className="mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="max-md:hidden mx-auto">
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableCell>User Photo</TableCell>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((user) => {
                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            {user?.profilePicture?.url ? (
                              <img
                                className="rounded-full w-10 h-10"
                                src={user?.profilePicture?.url}
                                alt="profile image"
                              />
                            ) : (
                              <InitialsAvatar
                                firstName={user.firstname}
                                lastName={user.lastname}
                              />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {user.firstname}
                          </TableCell>
                          <TableCell>{user.lastname}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone || "-"}</TableCell>
                          <TableCell>{user.role.name}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="md:p-4 bg-background rounded">
              {currentItems.length > 0 ? (
                <TablePaginationFooter
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              ) : (
                <p className="text-center py-4">
                  There are currently no meetings to display.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UsersTable;

// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// const users = [
//   {
//     id: "1",
//     firstname: "Balogun",
//     lastname: "Abdulganiyy",
//     email: "abdul@servant.io",
//     role: "User",
//   },
//   {
//     id: "2",
//     firstname: "Taofeek",
//     lastname: "Mutalib",
//     email: "mutolib@nig.io",
//     role: "User",
//   },
//   {
//     id: "3",
//     firstname: "Adigun",
//     lastname: "Tola",
//     email: "tola@me.io",
//     role: "Doctor",
//   },
//   {
//     id: "4",
//     firstname: "Dairo",
//     lastname: "Mubarak",
//     email: "dairo@gb.io",
//     role: "Admin",
//   },
// ];

// const UserListTable = () => {
//   return (
//     <div className="mt-2 border-[1px] border-solid border-gray-300 rounded-sm">
//       <Table>
//         {/* <TableCaption>A list of your recent users.</TableCaption> */}
//         <TableHeader>
//           <TableRow>
//             <TableHead>First Name</TableHead>
//             <TableHead>Last Name</TableHead>
//             <TableHead>Email</TableHead>
//             <TableHead>Role</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {users.map((user) => (
//             <TableRow key={user.id}>
//               <TableCell className="font-medium">{user.firstname}</TableCell>
//               <TableCell>{user.lastname}</TableCell>
//               <TableCell>{user.email}</TableCell>
//               <TableCell>{user.role}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default UserListTable;
