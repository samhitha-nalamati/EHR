import React, { useEffect, useState } from "react";
import { client, moveAddress } from "./aptosClient";

export default function PatientDashboard({ patientAddress }) {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Example: fetch prescriptions from Move resource
      const resource = await client.getAccountResource(patientAddress, `${moveAddress}::ehr::Patient`);
      setPrescriptions(resource.data.prescriptions || []);
    }
    fetchData();
  }, [patientAddress]);

  return (
    <div>
      <h2>Patient Dashboard</h2>
      <ul>
        {prescriptions.map((p, idx) => (
          <li key={idx}>{new TextDecoder().decode(new Uint8Array(p))}</li>
        ))}
      </ul>
    </div>
  );
}
