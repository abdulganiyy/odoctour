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

const MeetingsTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [data, setData] = useState<any[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const meetingsList = data;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = meetingsList
    ? meetingsList.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = meetingsList
    ? Math.ceil(meetingsList.length / itemsPerPage)
    : 0;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await apiService.get(`/meeting`);
        setData(response);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchMeetings();
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
            <div className="max-md:hid mx-auto">
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="md:col-span-3">Name</TableHead>
                      <TableHead className="md:col-span-3">Type</TableHead>
                      <TableHead className="md:col-span-2">Link</TableHead>
                      <TableHead className="md:col-span-1 text-center">
                        Duration
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((meeting) => {
                      return (
                        <TableRow key={meeting.id}>
                          <TableCell className="font-medium">
                            {meeting.name}
                          </TableCell>
                          <TableCell>{meeting.type}</TableCell>
                          <TableCell>{meeting.url}</TableCell>
                          <TableCell className="text-center">
                            {meeting.duration}mins
                          </TableCell>
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

export default MeetingsTable;
