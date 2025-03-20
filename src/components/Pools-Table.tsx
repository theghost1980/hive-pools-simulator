import React, { useEffect, useState } from "react";
import "../styles/pools-table.css";
import { SscLibraryUtils } from "../utils/ssc-library-util";
import Icon from "./Icon";

type TableDataFields =
  | "tokenPair"
  | "basePrice"
  | "baseQuantity"
  | "baseVolume"
  | "creator"
  | "precision"
  | "quotePrice"
  | "quoteQuantity"
  | "quoteVolume"
  | "totalShares"
  | "none";

const PoolsTable = () => {
  const [poolList, setPoolList] = useState([]);
  const [showingPoolList, setShowingPoolList] = useState([]);
  const [rowCount, setRowCount] = useState(10);
  const [pages, setPages] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [orderBy, setOrderBy] = useState<TableDataFields>("none");

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    SscLibraryUtils.ssc.find(
      "marketpools",
      "pools",
      {},
      1000,
      0,
      [],
      (err: any, result: any) => {
        console.log("find", { err, result });
        if (result && result.length) {
          setPoolList(result);
          setShowingPoolList(
            result.slice(pageIndex * rowCount, pageIndex * rowCount + rowCount)
          );
          setPages(Math.floor(result.length / 10));
        }
      }
    );
  };

  const orderTable = (orderBy: TableDataFields, asc?: boolean) => {
    const tempTableData = [...poolList];
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
    setPoolList(tempTableData);
    setOrderBy(orderBy);
  };

  useEffect(() => {
    const tempPoolList = [...poolList].slice(
      pageIndex * rowCount,
      pageIndex * rowCount + rowCount
    );
    setShowingPoolList(tempPoolList);
  }, [poolList, pageIndex, orderBy]);

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>
              <div
                className={`table-head-container ${
                  orderBy === "tokenPair" ? "table-ordered-by" : ""
                }`}
              >
                tokenPair{" "}
                <div className="table-filter-container">
                  <Icon
                    title="Order Asc"
                    onClick={() => orderTable("tokenPair", true)}
                  />
                  <Icon
                    title="Order Des"
                    onClick={() => orderTable("tokenPair")}
                  />
                </div>
              </div>
            </th>
            <th>
              <div
                className={`table-head-container ${
                  orderBy === "basePrice" ? "table-ordered-by" : ""
                }`}
              >
                basePrice{" "}
                <div className="table-filter-container">
                  <Icon
                    title="Order Asc"
                    onClick={() => orderTable("basePrice", true)}
                  />
                  <Icon
                    title="Order Des"
                    onClick={() => orderTable("basePrice")}
                  />
                </div>
              </div>
            </th>
            <th>
              <div
                className={`table-head-container ${
                  orderBy === "baseQuantity" ? "table-ordered-by" : ""
                }`}
              >
                baseQuantity{" "}
                <div className="table-filter-container">
                  <Icon
                    title="Order Asc"
                    onClick={() => orderTable("baseQuantity", true)}
                  />
                  <Icon
                    title="Order Des"
                    onClick={() => orderTable("baseQuantity")}
                  />
                </div>
              </div>
            </th>
            <th>
              <div
                className={`table-head-container ${
                  orderBy === "baseVolume" ? "table-ordered-by" : ""
                }`}
              >
                baseVolume{" "}
                <div className="table-filter-container">
                  <Icon
                    title="Order Asc"
                    onClick={() => orderTable("baseVolume", true)}
                  />
                  <Icon
                    title="Order Des"
                    onClick={() => orderTable("baseVolume")}
                  />
                </div>
              </div>
            </th>
            <th>
              <div
                className={`table-head-container ${
                  orderBy === "creator" ? "table-ordered-by" : ""
                }`}
              >
                creator{" "}
                <div className="table-filter-container">
                  <Icon
                    title="Order Asc"
                    onClick={() => orderTable("creator", true)}
                  />
                  <Icon
                    title="Order Des"
                    onClick={() => orderTable("creator")}
                  />
                </div>
              </div>
            </th>
            <th>
              <div
                className={`table-head-container ${
                  orderBy === "precision" ? "table-ordered-by" : ""
                }`}
              >
                precision{" "}
                <div className="table-filter-container">
                  <Icon
                    title="Order Asc"
                    onClick={() => orderTable("precision", true)}
                  />
                  <Icon
                    title="Order Des"
                    onClick={() => orderTable("precision")}
                  />
                </div>
              </div>
            </th>
            <th>
              <div
                className={`table-head-container ${
                  orderBy === "quotePrice" ? "table-ordered-by" : ""
                }`}
              >
                quotePrice
                <div className="table-filter-container">
                  <Icon
                    title="Order Asc"
                    onClick={() => orderTable("quotePrice", true)}
                  />
                  <Icon
                    title="Order Des"
                    onClick={() => orderTable("quotePrice")}
                  />
                </div>
              </div>
            </th>
            <th>
              <div
                className={`table-head-container ${
                  orderBy === "quoteQuantity" ? "table-ordered-by" : ""
                }`}
              >
                quoteQuantity
                <div className="table-filter-container">
                  <Icon
                    title="Order Asc"
                    onClick={() => orderTable("quoteQuantity", true)}
                  />
                  <Icon
                    title="Order Des"
                    onClick={() => orderTable("quoteQuantity")}
                  />
                </div>
              </div>
            </th>
            <th>
              <div
                className={`table-head-container ${
                  orderBy === "quoteVolume" ? "table-ordered-by" : ""
                }`}
              >
                quoteVolume
                <div className="table-filter-container">
                  <Icon
                    title="Order Asc"
                    onClick={() => orderTable("quoteVolume", true)}
                  />
                  <Icon
                    title="Order Des"
                    onClick={() => orderTable("quoteVolume")}
                  />
                </div>
              </div>
            </th>
            <th>
              <div
                className={`table-head-container ${
                  orderBy === "totalShares" ? "table-ordered-by" : ""
                }`}
              >
                totalShares
                <div className="table-filter-container">
                  <Icon
                    title="Order Asc"
                    onClick={() => orderTable("totalShares", true)}
                  />
                  <Icon
                    title="Order Des"
                    onClick={() => orderTable("totalShares")}
                  />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {showingPoolList.map((p) => {
            return (
              <tr key={p._id}>
                <td>{p.tokenPair}</td>
                <td>{p.basePrice}</td>
                <td>{p.baseQuantity}</td>
                <td>{p.baseVolume}</td>
                <td>{p.creator}</td>
                <td>{p.precision}</td>
                <td>{p.quotePrice}</td>
                <td>{p.quoteQuantity}</td>
                <td>{p.quoteVolume}</td>
                <td>{p.totalShares}</td>
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

export default PoolsTable;
