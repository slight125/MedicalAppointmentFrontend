import { useSelector } from 'react-redux';
import { Calendar, FileText, CreditCard, Heart } from 'lucide-react';
import type { RootState } from '../../store';

export default function UserDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-8 shadow text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold mb-2">
              Welcome back, {user?.firstname}!
            </h1>
            <p className="text-white/90 text-lg">
              Manage your health appointments and medical records
            </p>
          </div>
          <Heart className="w-12 h-12 opacity-40" />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Upcoming', value: '3', sub: 'Appointments', icon: <Calendar className="text-blue-600" />, bg: 'bg-blue-100' },
          { label: 'Active', value: '5', sub: 'Prescriptions', icon: <FileText className="text-green-600" />, bg: 'bg-green-100' },
          { label: 'Last Payment', value: '$150', sub: 'Dec 10, 2024', icon: <CreditCard className="text-purple-600" />, bg: 'bg-purple-100' },
          { label: 'Health Score', value: '92%', sub: 'Excellent', icon: <Heart className="text-orange-600" />, bg: 'bg-orange-100' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.sub}</p>
            </div>
            <div className={`${stat.bg} p-3 rounded-full`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Calendar className="text-green-500 w-6 h-6" />
              <div>
                <p className="font-medium text-gray-900">Appointment scheduled</p>
                <p className="text-sm text-gray-500">Checkup with Dr. Sarah Johnson</p>
              </div>
            </div>
            <span className="text-sm text-gray-400">2 hours ago</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex justify-between items-start">
            <div className="flex items-center gap-4">
              <FileText className="text-blue-500 w-6 h-6" />
              <div>
                <p className="font-medium text-gray-900">Prescription updated</p>
                <p className="text-sm text-gray-500">New medication added</p>
              </div>
            </div>
            <span className="text-sm text-gray-400">1 day ago</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex justify-between items-start">
            <div className="flex items-center gap-4">
              <CreditCard className="text-purple-500 w-6 h-6" />
              <div>
                <p className="font-medium text-gray-900">Payment processed</p>
                <p className="text-sm text-gray-500">$150 paid for consultation</p>
              </div>
            </div>
            <span className="text-sm text-gray-400">3 days ago</span>
          </div>
        </div>
      </div>

      {/* Health Tip */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl shadow p-8">
        <div className="flex items-start gap-6">
          <div className="bg-white/20 p-4 rounded-full">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">Stay Hydrated</h3>
            <p className="text-white/90 text-lg">
              Drink at least 8 glasses of water daily to maintain optimal health.
              Proper hydration supports your immune system and keeps your body functioning well.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
