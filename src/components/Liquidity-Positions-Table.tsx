import React, { useEffect, useState } from "react";
import { LiquidityPosition } from "../interfaces/liquidity-positions.interface";
import { LiquidityPositionFields } from "../types/liquidity-position";
import Table from "./Table";

interface Props {
  liquidityPositions: LiquidityPosition[];
  clickOnItem?: (tokenPair: string, account?: string) => void;
}

const LiquidityPositionsTable = ({
  liquidityPositions,
  clickOnItem,
}: Props) => {
  const [data, setData] = useState<LiquidityPosition[]>(liquidityPositions);
  const [showingData, setShowingData] = useState<LiquidityPosition[]>([]);
  const [rowCount, setRowCount] = useState(10);
  const [pages, setPages] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [orderBy, setOrderBy] = useState<LiquidityPositionFields>("_id");

  useEffect(() => {
    if (liquidityPositions && liquidityPositions.length) {
      const tempData = [...liquidityPositions];
      tempData.slice(pageIndex * rowCount, pageIndex * rowCount + rowCount);
      setShowingData(tempData);
      setPages(Math.floor(liquidityPositions.length / 10));
    }
  }, []);

  const orderTable = (orderBy: LiquidityPositionFields, asc?: boolean) => {
    const tempTableData = [...data];
    if (asc) {
      if (orderBy === "tokenPair" || orderBy === "account") {
        tempTableData.sort((a, b) =>
          String(a[orderBy]).localeCompare(String(b[orderBy]))
        );
      } else {
        tempTableData.sort((a, b) => a[orderBy] - b[orderBy]);
      }
    } else {
      if (orderBy === "tokenPair" || orderBy === "account") {
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
      tableData={liquidityPositions}
      showingData={showingData}
      clickOnItem={(tokenPair, account) => clickOnItem(tokenPair, account)}
      orderTable={(k, asc) => orderTable(k as LiquidityPositionFields, asc)}
      setPageIndex={(i) => setPageIndex(i)}
      pageIndex={pageIndex}
      rowCount={rowCount}
      orderBy={orderBy}
      pages={pages}
      tableTitle={`Liquidity Positions for ${liquidityPositions[0].tokenPair}`}
    />
  );
};

export default LiquidityPositionsTable;
