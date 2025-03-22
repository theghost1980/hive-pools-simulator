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

  const init = async () => {
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
        console.log("find Positions", { err, result });
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

    //testing for mining contracts
    SscLibraryUtils.ssc.find(
      "mining",
      "pools",
      {},
      1000,
      0,
      [],
      (err: any, result: any) => {
        console.log("find Mining", { err, result });
        //TODO set data
      }
    );
    SscLibraryUtils.ssc.find(
      "mining",
      "power",
      {},
      1000,
      0,
      [],
      (err: any, result: any) => {
        console.log("find Mining power", { err, result });
        //TODO set data
      }
    );
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
