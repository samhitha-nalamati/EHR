import DoctorDashboard from "./components/DoctorDashboard";
import PatientDashboard from "./components/PatientDashboard";
import LabDashboard from "./components/LabDashboard";

function App() {
  return (
    <div>
      <DoctorDashboard doctorAccount={doctorAccount} patientAddress={patientAddress} />
      <PatientDashboard patientAddress={patientAddress} />
      <LabDashboard labAccount={labAccount} patientAddress={patientAddress} />
    </div>
  );
}

export default App;
