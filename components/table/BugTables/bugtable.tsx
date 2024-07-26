import {
  Link,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useEffect } from "react";
import { Bugscolumns } from "./bugdata";
import { BugList } from "../data";
import { RenderBugCell } from "./render-bug-cell";

type BugTableWrapperProps = {
  bugs?: BugList[];
  bugsType: string;
  totalUsers: number;
  page: number;
  pageLimit: number;
  loading: boolean;
};
const columnKeys: Array<keyof BugList> = [
  "BugId",
  "bugDetails",
  "bugName",
  "bugType",
  "bugImage",
  "resolve",
];

export default function BugTableWrapper({
  bugs,
  bugsType,
  totalUsers,
  page,
  pageLimit,
  loading,
}: BugTableWrapperProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={Bugscolumns}>
          {(column: any) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={bugs}
          isLoading={loading}
          loadingContent={<Spinner />}
        >
          {(item: BugList) => (
            <TableRow key={item.BugId}>
              {columnKeys.map((columnKey) => (
                <TableCell key={columnKey}>
                  <RenderBugCell Bugs={item} columnKey={columnKey} />
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
