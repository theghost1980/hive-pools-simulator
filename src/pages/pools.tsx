import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Table from "../components/Table";
import { Pool } from "../interfaces/pools.interface";
import { SscLibraryUtils } from "../utils/ssc-library-util";

const Pools = () => {
  const [tableData, setTableData] = useState<Pool[]>([]);
  const [clickedTableItem, setClickedTableItem] = useState(0);

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
    console.log({ clickedTableItem });
  }, [clickedTableItem]);
  return (
    <div className="pools-page">
      {tableData && tableData.length && (
        <Table
          tableData={tableData}
          clickOnItem={(_id: number) => setClickedTableItem(_id)}
        />
      )}
      {tableData.length === 0 && <Loader />}
    </div>
  );
};

export default Pools;
