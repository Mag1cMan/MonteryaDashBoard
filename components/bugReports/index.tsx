"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { FaBug } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { Button, Pagination, Tooltip } from "@nextui-org/react";
import { InfoIcon } from "../icons/accounts/info-icon";
import { AddUser } from "../accounts/add-user";
import { ExportIcon } from "../icons/accounts/export-icon";
import BugTableWrapper from "../table/BugTables/bugtable";
import { BugList, BugType } from "../table/data";
import { Select, SelectItem } from "@nextui-org/select";

const BugReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<BugList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limitPerPage = 8; // Assuming 10 items per page

  const handleSearchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(e.target.value == "All"){
      console.log(e.target.value);
      setSearchQuery("");
      return;
    }
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let offset = (currentPage - 1) * limitPerPage;
        const res = await fetch(
          `https://api.monterya.com/AuthTest/dashboardapi/fetchBugReports?offset=${offset}&limit=${limitPerPage}` +
            (searchQuery ? `&search=${searchQuery}` : "")
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await res.json();
        setData(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, searchQuery]);

  const handlePaginationClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="my-14 lg:px-6 max-w-[105rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex gap-4">
        <li className="flex items-center gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Home</span>
          </Link>
          <span> / </span>
        </li>

        <li className="flex items-center gap-2">
          <FaBug />
          <span>Users</span>
          <span> / </span>
        </li>

        <li className="flex items-center gap-2">
          <TbReportSearch />
          <span> Bug List</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All Accounts</h3>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap flex-grow">
          <Select
            isRequired
            label="BugType"
            placeholder="Select a BugType"
            // defaultSelectedKeys={["cat"]}
            className="flex-grow max-w-xs"
            onChange={handleSearchChange}
          >
            {BugType.map((bugtype) => (
              <SelectItem key={bugtype.key}>{bugtype.label}</SelectItem>
            ))}
          </Select>
          <Tooltip content="Find user by ID or Name">
            <div>
              <InfoIcon />
            </div>
          </Tooltip>
        </div>
        <div className="flex items-center gap-3.5 flex-wrap md:flex-nowra">
          {/* <AddUser /> */}
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>

      <div className="max-w-[105rem] mx-auto w-full">
        {/* Add if loadin here plase */}
        <BugTableWrapper
          bugs={data}
          bugsType="other"
          totalUsers={5}
          page={1}
          pageLimit={5}
          loading={loading}
        />{" "}
      </div>

      <Pagination onChange={handlePaginationClick} total={10} initialPage={1} />
    </div>
  );
};

export default BugReport;
