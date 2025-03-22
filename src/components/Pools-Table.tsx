import React, { useEffect, useState } from "react";
import { Pool } from "../interfaces/pools.interface";
import { PoolDataFields } from "../types/pool";
import Table from "./Table";

interface Props {
  tableData: Pool[];
  clickOnItem?: (tokenPair: string, account?: string) => void;
}

const PoolsTable = ({ tableData, clickOnItem }: Props) => {
  const [data, setData] = useState<Pool[]>(tableData);
  const [showingData, setShowingData] = useState<Pool[]>([]);
  const [rowCount, setRowCount] = useState(10);
  const [pages, setPages] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [orderBy, setOrderBy] = useState<PoolDataFields>("_id");

  useEffect(() => {
    if (tableData && tableData.length) {
      const tempData = [...tableData];
      tempData.slice(pageIndex * rowCount, pageIndex * rowCount + rowCount);
      setShowingData(tempData);
      setPages(Math.floor(tableData.length / 10));
    }
  }, []);

  const orderTable = (orderBy: PoolDataFields, asc?: boolean) => {
    const tempTableData = [...data];
    if (asc) {
      if (orderBy === "tokenPair" || orderBy === "creator") {
        tempTableData.sort((a, b) =>
          String(a[orderBy]).localeCompare(String(b[orderBy]))
        );
      } else {
        tempTableData.sort((a, b) => a[orderBy] - b[orderBy]);
      }
    } else {
      if (orderBy === "tokenPair" || orderBy === "creator") {
        tempTableData.sort((a, b) =>
          String(b[orderBy]).localeCompare(String(a[orderBy]))
        );
      } else {
        tempTableData.sort((a, b) => b[orderBy] - a[orderBy]);
      }
    }
    setData(tempTableData);
    setOrderBy(orderBy);
  };

  useEffect(() => {
    const tempPoolList = [...data].slice(
      pageIndex * rowCount,
      pageIndex * rowCount + rowCount
    );
    setShowingData(tempPoolList);
  }, [data, pageIndex, orderBy]);

  return (
    <Table
      tableData={tableData}
      showingData={showingData}
      clickOnItem={(tokenPair, account) => clickOnItem(tokenPair, account)}
      orderTable={(k, asc) => orderTable(k as PoolDataFields, asc)}
      setPageIndex={(i) => setPageIndex(i)}
      pageIndex={pageIndex}
      rowCount={rowCount}
      orderBy={orderBy}
      pages={pages}
      tableTitle={"Hive Pools"}
    />
  );
};

export default PoolsTable;
