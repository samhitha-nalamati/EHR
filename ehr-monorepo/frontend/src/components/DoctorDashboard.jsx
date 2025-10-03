import React, { useState } from "react";
import { submitTransaction } from "./aptosClient";

export default function DoctorDashboard({ doctorAccount, patientAddress }) {
  const [prescription, setPrescription] = useState("");

  const handleUpload = async () => {
    const encoded = Array.from(new TextEncoder().encode(prescription));
    await submitTransaction(doctorAccount, "doctor_upload_prescription", [patientAddress, encoded]);
    alert("Prescription uploaded to blockchain!");
  };

  return (
    <div>
      <h2>Doctor Dashboard</h2>
      <textarea value={prescription} onChange={e => setPrescription(e.target.value)} />
      <button onClick={handleUpload}>Upload Prescription</button>
    </div>
  );
}
