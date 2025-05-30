
import Filters from "@/components/Filters";
import HistoryTable from "@/components/HistoryTable";
import Pagination from "@/components/Pagination";
import { getFilteredRoasts } from "@/lib/queries";
import DashboardButton from "@/components/DashboardButton";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HistoryPage({ searchParams }) {
  const session = await getSession();
  const page = parseInt(searchParams?.page) || 1;
  const limit = parseInt(searchParams?.limit) || 10;
  
  const data = await getFilteredRoasts({
    ...searchParams,
    page,
    limit
  });

  if (!session ||!session?.userId) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto py-2 md:py-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Analysis History</h1>
        <DashboardButton text="Dashboard" href="/dashboard" />
      </div>

      <Filters />
      <HistoryTable data={data} />
      
      {data.success && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          limit={limit}
        />
      )}
    </div>
  );
}