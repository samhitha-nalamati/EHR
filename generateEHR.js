import AdmZip from "adm-zip";

// Initialize ZIP
const zip = new AdmZip();

// Folder structure and files
const files = [
    // Frontend package.json
    {
        path: "frontend/package.json", content: `{
  "name": "ehr-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.1",
    "@aptos-labs/ts-sdk": "^1.0.0"
  },
  "devDependencies": {
    "vite": "^5.2.0",
    "tailwindcss": "^3.3.3",
    "postcss": "^8.4.21",
    "autoprefixer": "^10.4.14"
  }
}` },

    // Frontend .env
    { path: "frontend/.env", content: "VITE_MOVE_ADDRESS=0xYourMoveAddress\nVITE_APTOS_NODE=https://fullnode.testnet.aptoslabs.com/v1" },

    // Vite config
    {
        path: "frontend/vite.config.js", content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});` },

    // Main entry
    {
        path: "frontend/src/main.jsx", content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);` },

    // App.jsx
    {
        path: "frontend/src/App.jsx", content: `import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import LabDashboard from './components/LabDashboard';

export default function App() {
  return (
    <div>
      <h1>EHR Blockchain Demo</h1>
      <DoctorDashboard />
      <PatientDashboard />
      <LabDashboard />
    </div>
  );
}` },

    // Dashboards
    {
        path: "frontend/src/components/DoctorDashboard.jsx", content: `export default function DoctorDashboard() {
  return <div>Doctor Dashboard - upload prescriptions here</div>;
}` },
    {
        path: "frontend/src/components/PatientDashboard.jsx", content: `export default function PatientDashboard() {
  return <div>Patient Dashboard - view prescriptions and labs</div>;
}` },
    {
        path: "frontend/src/components/LabDashboard.jsx", content: `export default function LabDashboard() {
  return <div>Lab Dashboard - upload lab reports</div>;
}` },

    // Move module
    {
        path: "move/ehr.move", content: `
module 0xYourMoveAddress::ehr {

  struct Patient has key {
    id: u64,
    prescriptions: vector<vector<u8>>,
    lab_reports: vector<vector<u8>>,
    bills: vector<u64>,
  }

  struct Doctor has key {
    id: u64,
  }

  struct Lab has key {
    id: u64,
  }

  public fun register_patient(account: &signer, patient_id: u64) {
    move_to(account, Patient { id: patient_id, prescriptions: vector[], lab_reports: vector[], bills: vector[] });
  }

  public fun doctor_upload_prescription(doctor: &signer, patient_addr: address, prescription: vector<u8>) {
    let patient = borrow_global_mut<Patient>(patient_addr);
    vector::push_back(&mut patient.prescriptions, prescription);
  }

  public fun patient_send_to_lab(patient: &signer, lab_addr: address, report: vector<u8>) {
    let lab = borrow_global_mut<Lab>(lab_addr);
    // example: store report in lab (could be more complex)
    vector::push_back(&mut lab.id, 0); // placeholder
  }

  public fun lab_upload_report(lab: &signer, patient_addr: address, report: vector<u8>) {
    let patient = borrow_global_mut<Patient>(patient_addr);
    vector::push_back(&mut patient.lab_reports, report);
  }

  public fun add_bill(patient: &signer, amount: u64) {
    let patient_struct = borrow_global_mut<Patient>(signer::address_of(patient));
    vector::push_back(&mut patient_struct.bills, amount);
  }
}` },

    {
        path: "move/Move.toml", content: `[package]
name = "ehr"
version = "0.1.0"
authors = ["YourName"]` },

    // Node scripts
    {
        path: "scripts/submitTransactions.js", content: `import { AptosClient, TxnBuilderTypes, BCS, FaucetClient } from "@aptos-labs/ts-sdk";

const NODE_URL = process.env.VITE_APTOS_NODE || "https://fullnode.testnet.aptoslabs.com/v1";
const MOVE_ADDRESS = process.env.VITE_MOVE_ADDRESS || "0xYourMoveAddress";

console.log("This script will submit transactions to", MOVE_ADDRESS);

// Example function to submit prescription
export async function doctorUploadPrescription(signer, patientAddr, content) {
  const client = new AptosClient(NODE_URL);
  const payload = {
    type: "entry_function_payload",
    function: \`\${MOVE_ADDRESS}::ehr::doctor_upload_prescription\`,
    type_arguments: [],
    arguments: [patientAddr, Array.from(new TextEncoder().encode(content))]
  };
  const tx = await signer.signAndSubmitTransaction(payload);
  await client.waitForTransaction(tx.hash);
  console.log("Prescription uploaded:", tx.hash);
}` },
];

// Add files to ZIP
files.forEach(f => zip.addFile(f.path, Buffer.from(f.content, "utf8")));

// Write ZIP
zip.writeZip("ehr-monorepo.zip");

console.log("Full EHR ZIP generated: ehr-monorepo.zip");
