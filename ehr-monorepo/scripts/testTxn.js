import { Aptos, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import dotenv from "dotenv";
dotenv.config();

const NODE_URL = process.env.NODE_URL;
const MOVE_ADDRESS = process.env.MOVE_ADDRESS;

const aptos = new Aptos({ nodeUrl: NODE_URL });

// just load one account
const doctor = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(process.env.DOCTOR_PRIVATE_KEY),
});

console.log("Doctor address:", doctor.accountAddress.toString());

async function main() {
    try {
        const txn = await aptos.transaction.build.simple({
            sender: doctor.accountAddress,
            data: {
                function: `${MOVE_ADDRESS}::ehr::register_doctor`,
                functionArguments: [1234], // dummy doctor ID
            },
        });

        const signedTxn = await aptos.transaction.sign({
            signer: doctor,
            transaction: txn,
        });

        const pendingTxn = await aptos.transaction.submit({
            transaction: signedTxn,
        });

        console.log("Submitted txn hash:", pendingTxn.hash);

        await aptos.waitForTransaction({ transactionHash: pendingTxn.hash });

        console.log("✅ register_doctor executed successfully!");
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

main();