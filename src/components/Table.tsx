import React, { useEffect, useState } from "react";
import { Pool } from "../interfaces/pools.interface";
import "../styles/pools-table.css";
import { PoolDataFields } from "../types/pool";
import TableHeaderItem from "./Table-Header-Item";

interface Props {
  tableData: Pool[];
}

const Table = ({ tableData }: Props) => {
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
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {tableData && tableData.length
              ? Object.keys(tableData[0]).map((k, i) => {
                  return (
                    <th key={`${k}-table-field-${i}`}>
                      <TableHeaderItem
                        key={`table-header-item-${i}-${k}`}
                        orderBy={k as PoolDataFields}
                        onClick={(k, asc) => orderTable(k, asc)}
                        selected={orderBy as PoolDataFields}
                      />
                    </th>
                  );
                })
              : null}
          </tr>
        </thead>
        <tbody>
          {showingData.map((p) => {
            return (
              <tr key={p._id}>
                {Object.values(p).map((v, i) => {
                  return <td key={`cell-value-${i}-${v}`}>{v}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>Total Pages{pages}</td>
            <td>Page {pageIndex}</td>
          </tr>
        </tfoot>
      </table>
      <div className="table-selectors">
        {" "}
        {Array.from(Array(pages), (_, x) => x).map((p, i) => {
          return (
            <span
              className={`${
                p === i && pageIndex === i ? "selected" : "not-selected"
              }`}
              key={i}
              onClick={() => setPageIndex(p)}
            >
              {p}{" "}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Table;
