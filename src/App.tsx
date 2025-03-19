import React, { useEffect, useState } from "react";
import { BaseApi } from "./api/BaseApi";
import PoolsTable from "./components/Pools-Table";
import "./styles/app.css";
import { ENGINEEP } from "./utils/ssc-library-util";

export const App = () => {
  const [lastBlockInfo, setLastBlockInfo] = useState({
    blockNumber: 0,
    timestamp: "",
    transactions: [],
  });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const lastBlockInfo = await BaseApi.post(ENGINEEP + "blockchain", {
      id: 1,
      jsonrpc: "2.0",
      method: "getLatestBlockInfo",
    });
    console.log({ lastBlockInfo });
    if (lastBlockInfo && lastBlockInfo.result) {
      const { blockNumber, timestamp, transactions } = lastBlockInfo.result;
      setLastBlockInfo({
        blockNumber: blockNumber,
        timestamp: timestamp,
        transactions: transactions,
      });
    }

    // using getContractInfo works with:
    //  - distribution
    //  - tokens
    //  - market
    //  - marketpools
    //  - mining
    //using ssc lib
    // ssc.getContractInfo('marketpools', (err: any, result: any) => {
    //   console.log(err, result);
    // });
    // ssc.findOne(
    //   'distribution',
    //   'batches',
    //   {
    //     tokenPair:  'SWAP.HIVE:PAL'
    //   }, (err: any, result: any) => {
    //   console.log('findOne',{err, result});
    // });

    // ssc.find('liquidity', 'pools', { }, 1000, 0, [], (err: any, result: any) => {
    //   console.log({err, result});
    // })
  };

  return (
    <div>
      <p className="status-block">
        Last Block Number: {lastBlockInfo.blockNumber}
      </p>
      <p>Timestamp: {lastBlockInfo.timestamp}</p>
      <p>Transactions in Block: {lastBlockInfo.transactions.length}</p>

      <PoolsTable />
    </div>
  );
};
