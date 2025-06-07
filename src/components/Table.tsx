import React, { useState } from "react";
import "../styles/table.css";
import { formatUtils } from "../utils/format-util";
import Icon from "./Icon";

interface Props {
  tableData: any[];
  showingData: any[];
  clickOnItem?: (tokenPair: string, account?: string) => void;
  orderTable: (k: string, asc?: boolean) => void;
  setPageIndex: (i: number) => void;
  pageIndex: number;
  rowCount: number;
  orderBy: string;
  pages: number;
  tableTitle: string;
}

const Table = ({
  tableData,
  clickOnItem,
  orderTable,
  showingData,
  orderBy,
  pageIndex,
  pages,
  setPageIndex,
  tableTitle,
}: Props) => {
  const [rowIdMouseEnter, setRowIdMouseEnter] = useState(0);

  return (
    <div className="table-container">
      <h3 className="table-title">{tableTitle}</h3>
      <table>
        <thead>
          <tr>
            {tableData && tableData.length
              ? Object.keys(tableData[0]).map((k, i) => {
                  return (
                    <th key={`${k}-table-field-${i}`}>
                      <div
                        className={`table-head-container ${
                          orderBy === k ? "table-ordered-by" : ""
                        }`}
                      >
                        {k}
                        <div className="table-filter-container">
                          <Icon
                            title="Order Asc"
                            onClick={() => orderTable(k, true)}
                          />
                          <Icon
                            title="Order Des"
                            onClick={() => orderTable(k)}
                          />
                        </div>
                      </div>
                    </th>
                  );
                })
              : null}
          </tr>
        </thead>
        <tbody>
          {showingData.map((p) => {
            return (
              <tr
                onMouseEnter={() => setRowIdMouseEnter(p._id)}
                key={p._id}
                onClick={() => clickOnItem(p.tokenPair, p.account)}
                className={`${p._id === rowIdMouseEnter ? "highligth" : null}`}
              >
                {Object.values(p).map((v, i) => {
                  return (
                    <td key={`cell-value-${i}-${v}`}>
                      {formatUtils.formatCurrency(v as any)}
                    </td>
                  );
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
