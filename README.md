# EHR Monorepo

This project is a full-stack demo for a blockchain-based Electronic Health Record (EHR) system built on Aptos using Move smart contracts and a React frontend.

## Features

- **Smart Contracts**: Move module for managing patients, doctors, labs, prescriptions, lab reports, and billing.
- **Frontend**: React app for doctors, patients, and labs to interact with the blockchain.
- **Scripts**: Node.js scripts for key conversion, transaction submission, and testing.
- **Key Management**: Example keys and YAML files for accounts.

## Project Structure

```
ehr-monorepo/
├── .env
├── convertKey.js
├── doctor.key(.pub|.yaml|.yaml.pub)
├── lab.key(.pub|.yaml|.yaml.pub)
├── move_address.key(.pub)
├── patient.key(.pub|.yaml|.yaml.pub)
├── move/
│   ├── Move.toml
│   ├── ehr-abi.json
│   ├── sources/
│   │   └── ehr.move
│   └── build/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── components/
│           ├── DoctorDashboard.jsx
│           ├── PatientDashboard.jsx
│           └── LabDashboard.jsx
├── scripts/
│   ├── submitTransactions.js
│   ├── testTxn.js
│   └── scartch.js
└── package.json
```

## Setup

### Prerequisites

- Node.js (v16+)
- npm
- Aptos CLI (for deploying Move modules)

### 1. Install Dependencies

```sh
npm install
cd ehr-monorepo/frontend
npm install
```

### 2. Configure Environment

Edit `.env` in the root with your Aptos node URL, Move address, and private keys:

```
NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
MOVE_ADDRESS=0xYourMoveAddress
DOCTOR_PRIVATE_KEY="0x..."
PATIENT_PRIVATE_KEY="0x..."
LAB_PRIVATE_KEY="0x..."
DEFAULT_BILL_AMOUNT=500
```

### 3. Deploy Move Module

```sh
cd ehr-monorepo/move
aptos move publish --profile default
```

### 4. Run the Frontend

```sh
cd ehr-monorepo/frontend
npm run dev
```

### 5. Run Demo Scripts

```sh
cd ehr-monorepo
node scripts/submitTransactions.js
```

## Smart Contract Overview

See `move/sources/ehr.move` for the Move module. Key entry functions:

- `register_patient`, `register_doctor`, `register_lab`
- `doctor_upload_prescription`
- `patient_send_to_lab`
- `lab_upload_report`
- `add_bill`
- Getters: `get_prescriptions`, `get_lab_reports`, `get_bills`, `get_lab_requests`

## Frontend Overview

- `App.jsx`: Main app entry.
- `DoctorDashboard.jsx`: Upload prescriptions.
- `PatientDashboard.jsx`: View prescriptions, labs, bills.
- `LabDashboard.jsx`: Upload lab reports.

## Scripts

- `convertKey.js`: Convert hex keys to JSON arrays for `.env`.
- `submitTransactions.js`: Demo for submitting transactions.
- `testTxn.js`: Example transaction script.

## License

Apache-2.0

---

For more details, see the code in each directory and the Move module at `move/sources/ehr.move`.



