// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// export default function HistoryTable({ data }) {
//   if (data.error) {
//     return <p className="text-center text-red-500 mt-8">Error: {data.error}</p>;
//   }

//   if (!data || data?.items?.length === 0) {
//     return (
//       <p className="text-center text-gray-500 mt-8">No roast data found.</p>
//     );
//   }

//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Type</TableHead>
//           <TableHead>Username</TableHead>
//           <TableHead>Date</TableHead>
//           <TableHead>Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {data?.items?.map((item) => (
//           <TableRow key={item.id}>
//             <TableCell>
//               {item.type === "github_roast"
//                 ? "GitHub Roast"
//                 : item.type === "leetcode_roast"
//                 ? "LeetCode Roast"
//                 : item.type === "resume_roast"
//                 ? "Resume Roast"
//                 : "Resume Analysis"}
//             </TableCell>
//             <TableCell>
//               {item.platformUserName ? item.platformUserName : "-"}
//             </TableCell>
//             <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
//             <TableCell>
//               <Link href={`/history/${item.id}`}>
//                 <Button size="sm" variant="outline">
//                   View
//                 </Button>
//               </Link>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HistoryTable({ data }) {
  if (data.error) {
    return <p className="text-center text-red-500 mt-8">Error: {data.error}</p>;
  }

  if (!data || data?.items?.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <p>No roast data found.</p>
        {data.totalItems > 0 && (
          <p className="text-sm mt-2">
            Try adjusting your filters or check other pages.
          </p>
        )}
      </div>
    );
  }

  const startItem = (data.currentPage - 1) * data.limit + 1;
  const endItem = Math.min(data.currentPage * data.limit, data.totalItems);

  return (
    <div>
      {/* Results info */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          Showing {startItem}-{endItem} of {data.totalItems} results
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Date</TableHead>
            {/* <TableHead>Actions</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.items?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.type === "github_roast"
                  ? "GitHub Roast"
                  : item.type === "leetcode_roast"
                  ? "LeetCode Roast"
                  : item.type === "resume_roast"
                  ? "Resume Roast"
                  : "Resume Analysis"}
              </TableCell>
              <TableCell>
                {item.platformUserName ? item.platformUserName : "-"}
              </TableCell>
              <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
              {/* <TableCell>
                <Link href={`/history/${item.id}`}>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </Link>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
