import React, { useEffect, useState } from "react";
import "../styles/pools-table.css";
import { SscLibraryUtils } from "../utils/ssc-library-util";

const PoolsTable = () => {
  const [poolList, setPoolList] = useState([]);
  const [rowCount, setRowCount] = useState(10);
  const [pages, setPages] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState(0);

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
          setPages(Math.floor(result.length / 10));
        }
      }
    );
  };

  return (
    <div>
      <table className="pools-table">
        <thead>
          <tr>
            <th>tokenPair</th>
            <th>basePrice</th>
            <th>baseQuantity</th>
            <th>baseVolume</th>
            <th>creator</th>
            <th>precision</th>
            <th>quotePrice</th>
            <th>quoteQuantity</th>
            <th>quoteVolume</th>
            <th>totalShares</th>
          </tr>
        </thead>
        <tbody>
          {poolList
            .slice(pageIndex * rowCount, pageIndex * rowCount + rowCount)
            .map((p) => {
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
      <div>
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
