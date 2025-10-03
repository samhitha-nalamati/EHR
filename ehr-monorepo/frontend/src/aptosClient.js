import { AptosClient, AptosAccount, TxnBuilderTypes, BCS } from "aptos";
const NODE_URL = import.meta.env.VITE_APTOS_NODE;
const MOVE_ADDRESS = import.meta.env.VITE_MOVE_ADDRESS;

export const client = new AptosClient(NODE_URL);

export const moveAddress = MOVE_ADDRESS;

// Helper to submit transaction
export async function submitTransaction(account, funcName, args = []) {
  const payload = {
    type: "entry_function_payload",
    function: `${MOVE_ADDRESS}::ehr::${funcName}`,
    type_arguments: [],
    arguments: args
  };
  const tx = await client.generateTransaction(account.address(), payload);
  const signed = await client.signTransaction(account, tx);
  const res = await client.submitTransaction(signed);
  await client.waitForTransaction(res.hash);
  console.log(`Transaction ${funcName} completed:`, res.hash);
}
