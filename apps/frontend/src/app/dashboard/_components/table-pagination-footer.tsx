import {
  Pagination,
  PaginationContent,
  // PaginationEllipsis, // TODO: implement pagination for large number of pages
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useIsMobile } from "@/hooks/use-mobile";

interface TablePaginationFooterProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TablePaginationFooter: React.FC<TablePaginationFooterProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const mobile = useIsMobile();
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              onPageChange(Math.max(1, currentPage - 1));
            }}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
        {/* Show only current page number on mobile */}
        {mobile ? (
          <PaginationItem>
            <PaginationLink>Page {currentPage}</PaginationLink>
          </PaginationItem>
        ) : (
          // Show all page numbers on larger screens
          Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => {
                  onPageChange(page);
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              onPageChange(Math.min(totalPages, currentPage + 1));
            }}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePaginationFooter;
