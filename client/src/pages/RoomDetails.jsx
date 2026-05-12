import { useState, useEffect } from 'react';
import { FiHome, FiUsers, FiMonitor } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const RoomDetails = () => {
  const { user } = useAuth();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await api.get('/api/rooms/my-room');
        setRoomData(data); // data is either room object or null
      } catch (error) {
        console.error('Error fetching room details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 p-6 rounded-xl">
        <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-400">No Room Allocated</h3>
        <p className="text-yellow-700 dark:text-yellow-300 mt-2">You haven't been allocated a room yet. Please contact the hostel administration.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">Room Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-2xl flex-shrink-0">
              <FiHome className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
            </div>
            <div>
              <div className="inline-block px-3 py-1 bg-green-100 dark:bg-emerald-900/30 text-green-800 dark:text-emerald-400 rounded-full text-xs font-bold mb-2 uppercase tracking-wide">Allocated</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-slate-100">{roomData.roomNumber}</h2>
              <p className="text-base sm:text-lg text-gray-500 dark:text-slate-400 font-medium mt-1">Block {roomData.block} • Floor {roomData.floor}</p>
              <div className="flex items-center space-x-2 mt-4 text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-700/50 py-2 px-4 rounded-lg inline-flex border border-gray-100 dark:border-slate-600">
                <FiUsers className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-sm sm:text-base">{roomData.capacity} Sharing ({roomData.occupiedBeds} Occupied)</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center"><FiMonitor className="mr-2" /> Amenities</h3>
            <ul className="grid grid-cols-2 gap-3">
              {['AC', 'Attached Washroom', 'Balcony', 'Study Table', 'High-Speed Wi-Fi', 'Wardrobe'].map((item, idx) => (
                <li key={idx} className="flex items-center space-x-2 text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg border border-gray-100 dark:border-slate-600">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 h-fit">
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6">Roommate Details</h3>
          {roomData.students && roomData.students.filter(s => s._id !== user._id).length > 0 ? (
            <div className="space-y-4">
              {roomData.students.filter(s => s._id !== user._id).map((mate, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-4 border border-gray-100 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg overflow-hidden">
                    {mate.profileImage ? (
                      <img src={mate.profileImage} alt={mate.name} className="w-full h-full object-cover" />
                    ) : (
                      mate.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-slate-200">{mate.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{mate.course || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-slate-400 text-center py-4">No roommates assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
