import React, { useEffect, useState } from "react";
import { BaseApi } from "../api/BaseApi";
import { ENGINEEP } from "../utils/ssc-library-util";

const EngineStatus = () => {
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
  };
  return (
    <div>
      <p className="status-block">
        Last Block Number: {lastBlockInfo.blockNumber}
      </p>
      <p>Timestamp: {lastBlockInfo.timestamp}</p>
      <p>Transactions in Block: {lastBlockInfo.transactions.length}</p>
    </div>
  );
};

export default EngineStatus;
