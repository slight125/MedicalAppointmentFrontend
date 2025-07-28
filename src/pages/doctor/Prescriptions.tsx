import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import prescriptionAPI from '../../utils/api/prescriptionAPI';
import { FileText, Download, Pill, Clock } from 'lucide-react';

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    prescriptionAPI.getDoctorPrescriptions?.().then(res => {
      setPrescriptions(res.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1 text-primary flex items-center gap-2">
            <FileText className="h-7 w-7 text-fuchsia-500" />
            Issued Prescriptions
          </h2>
          <p className="text-gray-500 text-lg">All prescriptions you have issued to patients</p>
        </div>
        <button className="btn btn-primary px-6 py-3 text-lg" onClick={() => navigate('/dashboard/doctor/write-prescription')}>
          Write Prescription
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center text-gray-500">No prescriptions found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prescriptions.map((presc, idx) => (
            <div key={presc.prescription_id || idx} className="rounded-2xl shadow-lg bg-white border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-2xl transition-transform hover:scale-[1.015] relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-fuchsia-700 font-semibold text-lg">
                  <Pill className="h-5 w-5" />
                  Prescription #{presc.prescription_id}
                </div>
                <button className="btn btn-ghost btn-sm" title="Download PDF">
                  <Download className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Clock className="h-4 w-4" />
                <span>Date Issued</span>
                <span className="font-medium text-gray-800">{presc.issued_at ? new Date(presc.issued_at).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Medicines:</span>
                <div className="flex flex-col gap-2 mt-1">
                  {Array.isArray(presc.medicines)
                    ? presc.medicines.map((m: any, i: number) => (
                        <div key={i} className="bg-fuchsia-50 text-fuchsia-800 rounded-lg px-3 py-1 font-semibold flex items-center gap-2 w-fit">
                          {m.name} <span className="text-xs font-normal text-fuchsia-600">Dosage: {m.dosage}</span>
                        </div>
                      ))
                    : <span className="italic text-gray-400">No medicines listed</span>}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Notes:</span>
                <div className="text-gray-600 mt-1">{presc.notes || <span className="italic text-gray-400">N/A</span>}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPrescriptions; 