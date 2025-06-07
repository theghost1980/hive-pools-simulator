import moment from "moment";
import React, { useEffect, useState } from "react";
import { BaseApi } from "../api/BaseApi";
import { DHiveApi } from "../api/DHiveClientApi";
import { LiquidityPosition } from "../interfaces/liquidity-positions.interface";
import { Pool } from "../interfaces/pools.interface";
import "../styles/positions.css";
import { SscLibraryUtils } from "../utils/ssc-library-util";

const Position = () => {
  const [searchValue, setSearchValue] = useState("");
  const [liquidityPositions, setLiquidityPositions] = useState<
    LiquidityPosition[]
  >([]);
  const [marketPoolsOps, setMarketPoolsOps] = useState<any[]>([]);
  const [currentPpositionDetails, setCurrentPpositionDetails] = useState<{
    tokenPair: string;
    participation_percentage: string;
    token_one_amount: string;
    token_one_symbol: string;
    token_two_amount: string;
    token_two_symbol: string;
  }>({
    tokenPair: "",
    participation_percentage: "",
    token_one_amount: "",
    token_one_symbol: "",
    token_two_amount: "",
    token_two_symbol: "",
  });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    //TODO remove
    SscLibraryUtils.ssc.getContractInfo("marketpools", (err: any, res: any) => {
      console.log("marketpools info", { res });
    });

    // SscLibraryUtils.ssc.find(
    //   "market",
    //   "metrics",
    //   {
    //     // symbol: { $in: ["PAL", "BEE"] },
    //     // timestamp: { $gte: oneDayAgo },
    //     symbol: "PAL",
    //   },
    //   1000,
    //   0,
    //   [],
    //   (err: any, result: any) => {
    //     if (result.length) {
    //       console.log("market metrics", { result });
    //     }
    //   }
    // );
    ////
    const oneDayAgo = Math.floor(Date.now() / 1000) - 7 * 86400;
    //symbol: "PAL" one only
    //symbol: { $in: ["PAL", "BEE"] }, two symbol at once
    SscLibraryUtils.ssc.find(
      "market",
      "tradesHistory",
      {
        symbol: "PAL",
        timestamp: { $gte: oneDayAgo },
      },
      1000,
      0,
      [],
      (err: any, result: any) => {
        if (result.length) {
          const totalUSD = result.reduce(
            (acc: number, curr: any) =>
              acc + parseFloat(curr.price) * parseFloat(curr.quantity),
            0
          );
          console.log("market tradesHistory", { result, totalUSD });
        }
      }
    );
    //TODO rem until here

    //in case we may need them //TODO this will go for state app
    const tribaldex_settings = await BaseApi.get(
      "https://api.tribaldex.com/settings"
    );
    console.log({ tribaldex_settings });
    //prices
    const prices_from_splinterlands = await BaseApi.get(
      "https://prices.splinterlands.com/prices"
    );
    console.log({ prices_from_splinterlands });

    SscLibraryUtils.ssc.find(
      "mining",
      "pools",
      {},
      1000,
      0,
      [],
      (err: any, result: any) => {
        console.log("mining pools", { result });
      }
    );
    SscLibraryUtils.ssc.find(
      "mining",
      "tokenPools",
      {},
      1000,
      0,
      [],
      (err: any, result: any) => {
        console.log("mining tokenPools", { result });
      }
    );
  };

  const searchUserPositions = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim().length && searchValue.trim().length > 3) {
      setLiquidityPositions([]);
      SscLibraryUtils.ssc.find(
        "marketpools",
        "liquidityPositions",
        { account: searchValue },
        1000,
        0,
        [],
        (err: any, result: any) => {
          if (result && result.length) {
            setLiquidityPositions(result);
          }
        }
      );
    }
  };

  const getDetailsPosition = async (lp: LiquidityPosition) => {
    //TODO to use https://history.hive-engine.com/accountHistory?account=theghost1980&limit=250&offset=0&type=user
    const limits = [
      { from: 0, to: 500 },
      { from: 500, to: 1000 },
    ];
    const historyAccount: any = [];
    const requests = limits.map(({ from, to }) =>
      BaseApi.get(
        `https://history.hive-engine.com/accountHistory?account=${lp.account}&limit=${to}&offset=${from}&type=user`
      )
    );
    const results = await Promise.all(requests);

    // Flatten and merge results into historyAccount
    historyAccount.push(...results.flat());
    console.log({ historyAccount, l: historyAccount.length }); //TODO REM

    const filteredAccountHistoryTemp = historyAccount.filter(
      (t: any) =>
        t.operation === "mining_lottery" && t.poolId === "PAL:EXT-SWAP.HIVEPAL"
    );
    const lastOne =
      filteredAccountHistoryTemp[filteredAccountHistoryTemp.length - 1];
    const lastOneDate = Number(lastOne.timestamp);
    console.log({
      filteredAccountHistoryTemp,
      l: filteredAccountHistoryTemp.length,
      lastDate: moment.unix(lastOneDate).format("MMMM Do YYYY, h:mm:ss a"),
    }); //TODO REM

    const filteredFromAddLiquidity: any[] = filteredAccountHistoryTemp.filter(
      (f: any) => moment.unix(f.timestamp).isSameOrAfter("2025-03-14T14:52:54")
    );
    console.log({
      filteredFromAddLiquidity,
      pal: filteredFromAddLiquidity.reduce(
        (accumulator, currentValue) =>
          accumulator + Number(currentValue.quantity),
        0
      ),
    });

    // const hiveEngineHistoryAccount = await BaseApi.get(
    //   "https://history.hive-engine.com/accountHistory?account=theghost1980&limit=250&offset=250&type=user"
    // );
    // const operationFound = hiveEngineHistoryAccount.map(
    //   (h: any) => h.operation
    // );
    // console.log({ hiveEngineHistoryAccount, operationFound });

    //search mining
    // SscLibraryUtils.ssc.find(
    //   "mining",
    //   "pools",
    //   {},
    //   1000,
    //   0,
    //   [],
    //   (err: any, res: any) => {
    //     console.log("find mining pools", { res }); //TODO REM
    //   }
    // );

    //search for pool
    SscLibraryUtils.ssc.findOne(
      "marketpools",
      "pools",
      { tokenPair: lp.tokenPair },
      (err: any, result: Pool) => {
        console.log("marketpools pools", { result }); //TODO REM
        const participation = Number(
          (lp.shares * 100) / result.totalShares
        ).toFixed(3);
        //to calculate
        // totalShares "207999.77163598847438823326" shares for  baseQuantity "1506.34327959 HIVE"
        //  myshares 14159.230                          =>       basaeQuantity ?
        const lp_HIVE = (result.baseQuantity * lp.shares) / result.totalShares;
        const lp_token =
          (result.quoteQuantity * lp.shares) / result.totalShares;
        console.log(
          `Partic: ${participation}% - HIVE: ${lp_HIVE} ${tokens[1]} : ${lp_token}`
        );
        setCurrentPpositionDetails({
          tokenPair: lp.tokenPair,
          token_one_amount: lp_HIVE.toFixed(4),
          token_one_symbol: "HIVE",
          token_two_amount: lp_token.toFixed(4),
          token_two_symbol: tokens[1],
          participation_percentage: participation,
        });
      }
    );
    //get both tokens info
    const tokens = lp.tokenPair.split(":");
    console.log({ tokens });
    if (tokens[0] === "SWAP.HIVE") {
      //no need to lookup but only 1 market metric for the second token
      SscLibraryUtils.ssc.findOne(
        "market",
        "metrics",
        { symbol: tokens[1] },
        (err: any, result: any) => {
          console.log(`MM for ${tokens[1]}`, { err, result });
          if (result) {
            const tokenValueInHive = 1 / result.lowestAsk;
            console.log(`1 HIVE = ${tokenValueInHive}`);
          }
        }
      );
    } else {
      SscLibraryUtils.ssc.find(
        "market",
        "metrics",
        { symbol: { $in: [`${tokens[0]}`, `${tokens[1]}`] } },
        1000,
        0,
        [],
        (err: any, result: any) => {
          console.log(`find m m 2 tokens`, { err, result, tokens });
        }
      );
    }

    ////////
    //get LP account history related
    const lpAccountHistory = await DHiveApi.getAccountHistoryLPRelated(
      searchValue
    );
    console.log({
      lpAccountHistory,
      1: lpAccountHistory[0],
      2: lpAccountHistory[0][1],
    });
    // const opIdRemoved = ["sm_find_match","sm_submit_team","sm_claim_reward","sm_start_quest"];
    const filteredAccountHistory = lpAccountHistory.filter(
      (t) => !String(t[1].op[1].id).includes("sm_")
    );
    console.log({ filteredAccountHistory });
    const marketPoolOperations: any = [];
    const marketPoolsHistory = filteredAccountHistory.filter((t) => {
      const json = JSON.parse(String(t[1].op[1].json));
      if (
        json.contractName &&
        json.contractName === "marketpools" &&
        json.contractPayload.tokenPair === lp.tokenPair
      ) {
        marketPoolOperations.push({
          json,
          timestamp: t[1].timestamp,
          trx_id: t[1].trx_id,
        });
        return true;
      } else return false;
    });
    setMarketPoolsOps(marketPoolOperations);
    console.log({ marketPoolsHistory });
    //////

    //TODO next steps?
    //  1. see what you really need, so no askign extra data.
    //  2. somehow get rewards and fees from that pool
    //    - try looking into account history
    //  3. get the day the position was bought:
    //    - try looking into account hsitory as well, look for custom_json.
    //  4. work in the simulator.
  };

  return (
    <div className="positions-page">
      <form onSubmit={(e) => searchUserPositions(e)}>
        <div className="search-box-container">
          <label
            htmlFor="search-input"
            title="Account"
            className="search-box-lbl"
          >
            @
          </label>
          <input
            name="search-input"
            title="hive account"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button type={"submit"} className="search-btn">
            search
          </button>
        </div>
      </form>
      <div className="positions-container">
        {liquidityPositions && liquidityPositions.length > 0 && (
          <ul>
            {liquidityPositions.map((l, i) => {
              return (
                <li
                  key={`positions-${l.account}-${l.tokenPair}-${i}`}
                  onClick={() => getDetailsPosition(l)}
                >
                  <div className="position-item">
                    <p>@{l.account}</p>
                    <p>Shares: {Number(l.shares).toFixed(3)}</p>
                    <p>TimeFactor: {l.timeFactor}</p>
                    <p>TokenPair: {l.tokenPair}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {currentPpositionDetails.tokenPair !== "" && (
        <div className="position-details">
          <p>Pair: {currentPpositionDetails.tokenPair}</p>
          <p>
            {currentPpositionDetails.token_one_symbol}{" "}
            {currentPpositionDetails.token_one_amount}
          </p>
          <p>
            {currentPpositionDetails.token_two_symbol}{" "}
            {currentPpositionDetails.token_two_amount}
          </p>
          <p>
            Participation: {currentPpositionDetails.participation_percentage} %
          </p>
        </div>
      )}
      {marketPoolsOps && marketPoolsOps.length > 0 && (
        <ul className="position-history">
          {marketPoolsOps.map((m, i) => {
            return (
              <li
                className="position-history-item"
                key={`position-history-${m.trx_id}-${i}`}
              >
                <p>
                  Date: {moment(m.timestamp).format("MMMM Do YYYY, h:mm:ss a")}{" "}
                  {m.timestamp}
                </p>
                <p>Contract Action: {m.json.contractAction}</p>
                <p>Base Quantity: {m.json.contractPayload.baseQuantity}</p>
                <p>Quote Quantity: {m.json.contractPayload.quoteQuantity}</p>
                <p>TrId: {m.trx_id}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Position;
