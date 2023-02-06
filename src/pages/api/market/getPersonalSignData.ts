import BiconomyForwarder from "../../../lib/abis/BiconomyForwarder.json";
import { Interface } from "@ethersproject/abi";

export function getPersonalSignData(tx: any) {
  const iface = new Interface(BiconomyForwarder.abi);
  const result = iface.decodeFunctionData('executePersonalSign', tx.data);

  const { from, to } = result.req;
  const nonce = result.req.batchNonce.toNumber();

  return { from, to, nonce };
}
