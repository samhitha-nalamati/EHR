const handleUpload = async () => {
  const encoded = Array.from(new TextEncoder().encode(report));
  await submitTransaction(labAccount, "lab_upload_report", [patientAddress, encoded]);
  alert("Lab report uploaded!");
};
