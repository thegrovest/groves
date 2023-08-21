"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@project-serum/anchor");
const nodewallet_1 = __importDefault(require("@project-serum/anchor/dist/cjs/nodewallet"));
const main = async () => {
    // in order for this to work
    // ANCHOR_WALLET environment variable needs to be set
    // and this method will default to using a local RPC at 127.0.0.1:8899
    // const anchor = getProvider();
    const jsonRpcUrl = "https://rpc.helius.xyz/?api-key=f9238282-de0d-4bb3-888a-8dea5b83a290";
    const connection = new web3_js_1.Connection(jsonRpcUrl);
    const keypair = new web3_js_1.Keypair();
    const wallet = new nodewallet_1.default(keypair);
    const provider = new anchor_1.AnchorProvider(connection, wallet, anchor_1.AnchorProvider.defaultOptions());
    //   const getConfirmedSignaturesOptions = {
    //     /** Start searching backwards from this transaction signature. */
    //     before: "",
    //     /** Search until this transaction signature is reached, if found before `limit`. */
    //     until: "",
    //     /** Maximum transaction signatures to return (between 1 and 1,000, default: 1,000). */
    //     limit: 1000,
    //   };
    // using the type above and using a previous request you would do something like
    // const txs = await provider.connection.getConfirmedSignaturesForAddress2()....
    // const oldestTx = txs[txs.length - 1].signature;
    // const options = {
    //   before: oldestTx
    // };
    // and then perform the same getSignaturesForAddress request
    //   const transactions =
    //     await provider.connection.getConfirmedSignaturesForAddress2(
    //       new PublicKey("D6S6ykGbTk87RBhPurYgnkAxefFmonJutjk5HxoPbxbU"),
    //       getConfirmedSignaturesOptions,
    //       "confirmed"
    //     );
    // this only fetches up to the last 1000 transactions
    // to get even older transactions you will need to loop and fetch transactions
    // before the oldest signature you get on the first request
    const transactions = await provider.connection.getConfirmedSignaturesForAddress2(new web3_js_1.PublicKey("D6S6ykGbTk87RBhPurYgnkAxefFmonJutjk5HxoPbxbU"), null, "confirmed");
    // filter out transactions that errored out
    const successfulTxs = transactions.filter((tx) => !tx.err);
    console.log("Transactions: " + successfulTxs.length);
    for (const tx of successfulTxs) {
        const a = await provider.connection.getTransaction(tx.signature, {
            commitment: "confirmed",
        });
        //console.log("\nSignature: " + tx.signature);
        if (a.meta.logMessages[1].includes("CreateInstall")) {
            console.log("Wallet: " + a.transaction.message.accountKeys[0].toString());
        }
    }
};
exports.main = main;
(0, exports.main)();
//# sourceMappingURL=index.js.map