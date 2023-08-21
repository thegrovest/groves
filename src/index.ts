import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getProvider, AnchorProvider } from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

export const main = async () => {
  // in order for this to work
  // ANCHOR_WALLET environment variable needs to be set
  // and this method will default to using a local RPC at 127.0.0.1:8899
  // const anchor = getProvider();

  const jsonRpcUrl = "https://rpc.helius.xyz/?api-key=f9238282-de0d-4bb3-888a-8dea5b83a290";
  const connection = new Connection(jsonRpcUrl);
  const keypair = new Keypair();
  const wallet = new NodeWallet(keypair);
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );

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
  const transactions =
    await provider.connection.getConfirmedSignaturesForAddress2(
      new PublicKey("D6S6ykGbTk87RBhPurYgnkAxefFmonJutjk5HxoPbxbU"),
      null,
      "confirmed"
    );
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

main();
