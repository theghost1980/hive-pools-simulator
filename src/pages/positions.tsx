import React, { useEffect, useState } from "react";
import { BaseApi } from "../api/BaseApi";
import { LiquidityPosition } from "../interfaces/liquidity-positions.interface";
import { Pool } from "../interfaces/pools.interface";
import "../styles/positions.css";
import { SscLibraryUtils } from "../utils/ssc-library-util";

const Position = () => {
  const [searchValue, setSearchValue] = useState("");
  const [liquidityPositions, setLiquidityPositions] = useState<
    LiquidityPosition[]
  >([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
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
    //search for pool
    SscLibraryUtils.ssc.findOne(
      "marketpools",
      "pools",
      { tokenPair: lp.tokenPair },
      (err: any, result: Pool) => {
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
          `Partic: ${participation} - HIVE: ${lp_HIVE} ${tokens[1]} : ${lp_token}`
        );
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
    </div>
  );
};

export default Position;
