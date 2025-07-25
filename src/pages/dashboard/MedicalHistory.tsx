import React from "react";

const mockHistory = [
  {
    id: 1,
    condition: "Hypertension",
    doctor: "Dr. Sarah Wilson",
    date: "15/01/2024",
    diagnosis: "Essential hypertension, stage 1",
    medications: "Lisinopril 10mg daily, Hydrochlorothiazide 25mg daily",
    treatment: "Lifestyle modifications and medication",
    more: "Patient responds well to medication. Blood pressure stable.",
  },
  {
    id: 2,
    condition: "Type 2 Diabetes",
    doctor: "Dr. Michael Chen",
    date: "10/03/2024",
    diagnosis: "Type 2 diabetes mellitus",
    medications: "Metformin 500mg twice daily",
    treatment: "Diet, exercise, and oral medication",
    more: "Blood sugar levels improving.",
  },
];

const MedicalHistory: React.FC = () => {
  const [search, setSearch] = React.useState("");

  const filtered = mockHistory.filter(
    (item) =>
      item.condition.toLowerCase().includes(search.toLowerCase()) ||
      item.doctor.toLowerCase().includes(search.toLowerCase()) ||
      item.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 md:px-10 transition-colors text-base-content">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-base font-extrabold mb-1 flex items-center gap-2 text-primary drop-shadow">
          <span>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="inline-block text-accent">
              <path stroke="currentColor" strokeWidth="2" d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M6 7h12"></path>
              <path stroke="currentColor" strokeWidth="2" d="M9 11h6M9 15h6"></path>
            </svg>
          </span>
          Medical History
        </h1>
        <p className="text-base-content mb-6 font-medium">
          View and manage medical records and history
        </p>

        <input
          className="input input-bordered w-full mb-8 bg-base-100 text-base-content font-semibold"
          placeholder="Search by condition, diagnosis, or doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filtered.length === 0 && (
          <div className="text-center text-base-content font-semibold">No records found.</div>
        )}

        <div className="space-y-12">
          {filtered.map((item) => (
            <div key={item.id} className="py-6 border-b border-base-300 text-base-content">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <span className="text-lg font-bold">{item.condition}</span>
                <span className="text-sm font-semibold flex items-center gap-2">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline-block text-primary">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                    <path stroke="currentColor" strokeWidth="2" d="M12 8v4l3 3"></path>
                  </svg>
                  {item.date}
                </span>
              </div>
              <div className="mb-1">
                <span className="font-semibold text-primary">👨‍⚕️ Doctor:</span> {item.doctor}
              </div>
              <div className="mb-1">
                <span className="font-semibold text-primary">🩺 Diagnosis:</span> {item.diagnosis}
              </div>
              <div className="mb-1">
                <span className="font-semibold text-primary">💊 Medications:</span> {item.medications}
              </div>
              <div className="mb-1">
                <span className="font-semibold text-primary">📝 Treatment:</span> {item.treatment}
              </div>
              <div>
                <span className="font-semibold text-primary">ℹ️ More:</span> {item.more}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;