import React, { useEffect, useState } from "react";
import LiquidityPositionsTable from "../components/Liquidity-Positions-Table";
import Loader from "../components/Loader";
import PoolsTable from "../components/Pools-Table";
import { LiquidityPosition } from "../interfaces/liquidity-positions.interface";
import { Pool } from "../interfaces/pools.interface";
import { SscLibraryUtils } from "../utils/ssc-library-util";

const Pools = () => {
  const [tableData, setTableData] = useState<Pool[]>([]);
  const [clickedTableItem, setClickedTableItem] = useState("");
  const [liquidityPositions, setLiquidityPositions] = useState<
    LiquidityPosition[]
  >([]);

  useEffect(() => {
    init();
  }, []);

  //TODO important:
  //  possibly the only way to get the current:
  //  - tokens amount of each, from the tokenPair is to calculate "on the go" using:
  //    - baseVolumen and other params.
  //  - fee should be looking into distribution? or mining?

  const init = async () => {
    // using getContractInfo works with:
    //  - distribution
    //  - tokens
    //  - market
    //  - marketpools
    //  - mining
    //    - pools
    //    - tokenPools
    //    - nftTokenPools
    //  - comment-contract = "comments"
    //    - rewardPools

    //using ssc lib
    SscLibraryUtils.ssc.getContractInfo("lp", (err: any, result: any) => {
      console.log("getContractInfo lp", { err, result });
    });

    //
    SscLibraryUtils.ssc.find(
      "marketpools",
      "tokens",
      {},
      1000,
      0,
      [],
      (err: any, result: any) => {
        console.log("find marketpools tokens", { err, result });
      }
    );
    //

    SscLibraryUtils.ssc.find(
      "distribution",
      "batches",
      {},
      1000,
      0,
      [],
      (err: any, result: any) => {
        console.log("distribution batches", { err, result });
      }
    );

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
          setTableData(result);
        }
      }
    );
  };

  useEffect(() => {
    console.log({ clickedTableItem }); //TODO REM
    findPoolPositions(clickedTableItem);
  }, [clickedTableItem]);

  const findPoolPositions = async (tokenPair: string, account?: string) => {
    if (!tokenPair.trim().length) return;

    setLiquidityPositions([]);

    SscLibraryUtils.ssc.find(
      "marketpools",
      "liquidityPositions",
      { tokenPair },
      1000,
      0,
      [],
      (err: any, result: any) => {
        console.log("find liquidity Positions", { err, result });
        if (result && result.length) {
          setLiquidityPositions(result);
        }
      }
    );
  };

  const findUserPositionDetails = async (
    tokenPair: string,
    account?: string
  ) => {
    if (!account && !tokenPair) return;

    console.log({ account, tokenPair }); //TODO REM

    // SscLibraryUtils.ssc.findOne(
    //   "tokens",
    //   "contractsBalances",
    //   {
    //     account,
    //     tokenPair,
    //   },
    //   (err: any, result: any) => {
    //     console.log("findOne pools", { err, result });
    //     //TODO set data
    //   }
    // );
    // SscLibraryUtils.ssc.find(
    //   "mining",
    //   "pools",
    //   {},
    //   1000,
    //   0,
    //   [],
    //   (err: any, result: any) => {
    //     console.log("find mining pools", { err, result });
    //   }
    // );
  };

  return (
    <div className="pools-page">
      {tableData && tableData.length && (
        <PoolsTable
          tableData={tableData}
          clickOnItem={(tokenPair: string) => setClickedTableItem(tokenPair)}
        />
      )}
      {tableData.length === 0 && <Loader />}
      {liquidityPositions && liquidityPositions.length && (
        <LiquidityPositionsTable
          liquidityPositions={liquidityPositions}
          clickOnItem={(tokenPair, account) =>
            findUserPositionDetails(tokenPair, account)
          }
        />
      )}
    </div>
  );
};

export default Pools;
