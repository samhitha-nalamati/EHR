import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import promptSync from "prompt-sync";
import {
  Aptos,
  Account,
  Ed25519PrivateKey,
} from "@aptos-labs/ts-sdk";

// ========== Setup ==========
const prompt = promptSync({ sigint: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const NODE_URL = process.env.NODE_URL;
const MOVE_ADDRESS = process.env.MOVE_ADDRESS;

if (!NODE_URL || !MOVE_ADDRESS) {
  throw new Error("NODE_URL or MOVE_ADDRESS missing in .env");
}

// Init Aptos client (new SDK)
const aptos = new Aptos({ nodeUrl: NODE_URL });

// Helper to get account from env
function getAccount(envVar) {
  const key = process.env[envVar];
  if (!key) throw new Error(`${envVar} missing in .env`);
  return Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(key),
  });
}

const doctor = getAccount("DOCTOR_PRIVATE_KEY");
const patient = getAccount("PATIENT_PRIVATE_KEY");
const lab = getAccount("LAB_PRIVATE_KEY");

console.log("Doctor:", doctor.accountAddress.toString());
console.log("Patient:", patient.accountAddress.toString());
console.log("Lab:", lab.accountAddress.toString());

// ========== Transaction helper ==========
async function submitTransaction(signer, funcName, args = []) {
  try {
    const txn = await aptos.transaction.build.simple({
      sender: signer.accountAddress,
      data: {
        function: `${MOVE_ADDRESS}::ehr::${funcName}`,
        functionArguments: args,
      },
    });

    const signedTxn = await aptos.transaction.sign({
      signer,
      transaction: txn,
    });

    const pendingTxn = await aptos.transaction.submit({
      transaction: signedTxn,
    });

    await aptos.waitForTransaction({ transactionHash: pendingTxn.hash });
    console.log(`✅ Transaction '${funcName}' success: ${pendingTxn.hash}`);
  } catch (err) {
    console.error(`❌ Error calling '${funcName}':`, err.message);
  }
}

// ========== Main demo ==========
async function runDemo() {
  const prescriptionText = prompt("Enter prescription for patient: ");
  const prescription = Array.from(new TextEncoder().encode(prescriptionText));
  await submitTransaction(doctor, "doctor_upload_prescription", [
    patient.accountAddress,
    prescription,
  ]);

  const labRequestText = prompt("Enter lab request: ");
  const labRequest = Array.from(new TextEncoder().encode(labRequestText));
  await submitTransaction(patient, "patient_send_to_lab", [
    lab.accountAddress,
    labRequest,
  ]);

  const labReportText = prompt("Enter lab report for patient: ");
  const labReport = Array.from(new TextEncoder().encode(labReportText));
  await submitTransaction(lab, "lab_upload_report", [
    patient.accountAddress,
    labReport,
  ]);

  const billAmount = parseInt(
    prompt("Enter bill amount: ") ||
      process.env.DEFAULT_BILL_AMOUNT ||
      "500"
  );
  await submitTransaction(patient, "add_bill", [billAmount]);

  console.log("🎉 All blockchain transactions completed!");
}

runDemo().catch(console.error);