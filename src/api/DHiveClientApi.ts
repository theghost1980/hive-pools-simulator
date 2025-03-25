import { Client, utils as DhiveUtils } from "@hiveio/dhive";
import { makeBitMaskFilter } from "@hiveio/dhive/lib/utils";

const client = new Client([
  "https://api.hive.blog",
  "https://api.hivekings.com",
  "https://anyx.io",
  "https://api.openhive.network",
]);

const getClient = () => client;

const getAccountHistoryLPRelated = (account: string) => {
  const op = DhiveUtils.operationOrders;
  const opBitMask = makeBitMaskFilter([
    op.custom_json,
    op.liquidity_reward,
  ]) as [number, number];

  return getClient().database.getAccountHistory(account, -1, 1000, opBitMask);
};

export const DHiveApi = {
  getClient,
  getAccountHistoryLPRelated,
};
