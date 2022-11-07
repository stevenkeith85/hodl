import { fromUnixTime } from "date-fns";

import { BaseProvider } from '@ethersproject/providers'
import { TransactionResponse, TransactionReceipt} from '@ethersproject/abstract-provider'
import { formatEther } from '@ethersproject/units'


export const transactionDetails = async (hash,
    provider: BaseProvider,
    txReceipt: TransactionReceipt,
    tx: TransactionResponse) => {
    console.log('hash', hash);
    console.log('status', txReceipt.byzantium && txReceipt.status === 1 ? 'success' : 'reverted');
    console.log('block', txReceipt.blockNumber);
    console.log('confirmations', txReceipt.confirmations);

    console.log('from', txReceipt.from);
    console.log('to', txReceipt.to);

    console.log('value', formatEther(tx.value));
    console.log('total gas fee', formatEther(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice)));

    console.log('total cost to sender', formatEther(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice).add(tx.value)));

    console.log('transaction nonce', tx.nonce);

    const block = await provider.getBlock(tx.blockHash);
    console.log('timestamp', fromUnixTime(block.timestamp));
}