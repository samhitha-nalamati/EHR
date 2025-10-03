// convertKey.js
// Converts Aptos private keys (hex) into Uint8Array JSON for .env

function hexToArray(hexKey) {
    return Buffer.from(hexKey.replace(/^0x/, ""), "hex").toJSON().data;
}

// 👉 Replace these with your real private keys
const doctorKey = "0x0afff36a688e06301e8b316a0ed3b7e1137ba4592019e8a22d9b7977d7151ad9";
const patientKey = "0x231b18871887de7830a94a1e9b0beda91cd7b013815fa55e737c8c2e8dc51ae3";
const labKey = "0x3b36de4e3ece39451a6a4cdfe910cd9d2fc7920370dfeb4782efc475da9228d5";

console.log("DOCTOR_PRIVATE_KEY=", JSON.stringify(hexToArray(doctorKey)));
console.log("PATIENT_PRIVATE_KEY=", JSON.stringify(hexToArray(patientKey)));
console.log("LAB_PRIVATE_KEY=", JSON.stringify(hexToArray(labKey)));
    