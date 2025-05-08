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
import { addMinutes, format } from "date-fns";

const generateSlot = (startTime: string, durationInMinutes: number) => {
  const formattedDate = format(startTime, "MMMM d, yyyy"); // "January 2"
  const start = new Date(startTime);
  const end = addMinutes(start, durationInMinutes);
  return `${formattedDate}, ${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
};

const BookingsTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [data, setData] = useState<any[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const bookingsList = data;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bookingsList
    ? bookingsList.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = bookingsList
    ? Math.ceil(bookingsList.length / itemsPerPage)
    : 0;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiService.get(`/booking`);
        setData(response);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchBookings();
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
                      <TableHead className="md:col-span-2">
                        Description
                      </TableHead>
                      <TableHead className="md:col-span-1">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems
                      .sort(
                        (a: any, b: any) =>
                          +new Date(b.date) - +new Date(a.date)
                      )
                      .map((booking) => {
                        return (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                              {booking.name}
                            </TableCell>
                            <TableCell>{booking.meeting.type}</TableCell>
                            <TableCell>
                              <a
                                className="cursor-pointer text-blue-600"
                                href={booking.meeting.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {booking.meeting.url}
                              </a>
                            </TableCell>
                            <TableCell>{booking.description}</TableCell>
                            <TableCell>
                              {generateSlot(
                                booking.time,
                                booking.meeting.duration
                              )}
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
                  There are currently no doctors' appointments to display.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BookingsTable;
