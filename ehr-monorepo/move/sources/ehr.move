module MOVE_ADDRESS::ehr {

    use std::vector;
    use std::signer;

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
        requests: vector<vector<u8>>, // store lab requests from patients
    }

    /************* REGISTRATION *************/

    /// Register a patient account
    public fun register_patient(account: &signer, patient_id: u64) {
        move_to(account, Patient {
            id: patient_id,
            prescriptions: vector::empty(),
            lab_reports: vector::empty(),
            bills: vector::empty(),
        });
    }

    /// Register a doctor account
    public fun register_doctor(account: &signer, doctor_id: u64) {
        move_to(account, Doctor { id: doctor_id });
    }

    /// Register a lab account
    public fun register_lab(account: &signer, lab_id: u64) {
        move_to(account, Lab { id: lab_id, requests: vector::empty() });
    }

    /************* ACTIONS *************/

    /// Doctor uploads prescription to a patient
    public entry fun doctor_upload_prescription(
        doctor: &signer,
        patient_addr: address,
        prescription: vector<u8>
    ) acquires Patient {
        let patient = borrow_global_mut<Patient>(patient_addr);
        vector::push_back(&mut patient.prescriptions, prescription);
    }

    /// Patient sends lab request to a lab
    public entry fun patient_send_to_lab(
        patient: &signer,
        lab_addr: address,
        request: vector<u8>
    ) acquires Lab {
        let lab = borrow_global_mut<Lab>(lab_addr);
        vector::push_back(&mut lab.requests, request);
    }

    /// Lab uploads report back to patient
    public entry fun lab_upload_report(
        lab: &signer,
        patient_addr: address,
        report: vector<u8>
    ) acquires Patient {
        let patient = borrow_global_mut<Patient>(patient_addr);
        vector::push_back(&mut patient.lab_reports, report);
    }

    /// Patient adds a bill
    public entry fun add_bill(
        patient: &signer,
        amount: u64
    ) acquires Patient {
        let patient_struct = borrow_global_mut<Patient>(signer::address_of(patient));
        vector::push_back(&mut patient_struct.bills, amount);
    }

       /************* GETTERS (for frontend queries) *************/

    public fun get_prescriptions(patient_addr: address): vector<vector<u8>> acquires Patient {
        let patient = borrow_global<Patient>(patient_addr);
        patient.prescriptions
    }

    public fun get_lab_reports(patient_addr: address): vector<vector<u8>> acquires Patient {
        let patient = borrow_global<Patient>(patient_addr);
        patient.lab_reports
    }

    public fun get_bills(patient_addr: address): vector<u64> acquires Patient {
        let patient = borrow_global<Patient>(patient_addr);
        patient.bills
    }

    public fun get_lab_requests(lab_addr: address): vector<vector<u8>> acquires Lab {
        let lab = borrow_global<Lab>(lab_addr);
        lab.requests
    }
}