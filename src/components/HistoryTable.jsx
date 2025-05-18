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
      <p className="text-center text-gray-500 mt-8">No roast data found.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
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
            <TableCell>
              <Link href={`/history/${item.id}`}>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
