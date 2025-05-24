// Pagination.jsx (New component)
"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, totalItems, limit }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updatePage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const updateLimit = (newLimit) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", newLimit);
    params.set("page", "1"); // Reset to first page when changing limit
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  const pageNumbers = [];

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Items per page selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Items per page:</span>
        <Select value={limit.toString()} onValueChange={(value) => updateLimit(parseInt(value))}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* First page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Show first page if not in range */}
        {startPage > 1 && (
          <>
            <Button
              variant={1 === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => updatePage(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="text-gray-500">...</span>}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant={pageNum === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => updatePage(pageNum)}
          >
            {pageNum}
          </Button>
        ))}

        {/* Show last page if not in range */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
            <Button
              variant={totalPages === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => updatePage(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Next page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Page info */}
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages} ({totalItems} total)
      </div>
    </div>
  );
}