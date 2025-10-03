import { Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

try {
    const pk = new Ed25519PrivateKey(process.env.DOCTOR_PRIVATE_KEY);
    console.log("✅ Key is valid");
} catch (err) {
    console.error("❌ Invalid key:", err.message);
}