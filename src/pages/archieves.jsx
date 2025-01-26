import React, { useEffect, useState } from 'react';
import supabase from "@/utils/supabase";
import '../components/ui/loader.css';

export default function ArchievesPage() {
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch archived users
  useEffect(() => {
    const fetchArchivedUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('is_archived', true);
        
        if (error) {
          setError(error.message);
        } else {
          setArchivedUsers(data);
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };
    fetchArchivedUsers();
  }, []);

  //Loading Spinner
  if (loading) {
    return (
      <div className="dot-spinner">
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
      </div>
    );
  }

  return (
<div className="flex flex-col mx-4 sm:mx-6 md:mx-20 mt-6 gap-8 text-[#102b53]">
<h1 className="text-2xl font-bold">Archive</h1>
      {/*Table*/}
      <div className="relative border-2  text-e7eae5  font-nunito p-[1.5em] 
      flex justify-center items-start flex-col gap-[1em]
       rounded-[20px] bg-gradient-to-br from-white to-[#f8f8ff]">


        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : archivedUsers.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {archivedUsers.map((user, index) => (
                <tr key={user.id} className={index < archivedUsers.length - 1 ? "border-b" : ""}>
                  <td className="px-4 py-2 text-gray-500">{user.user_name}</td>
                  <td className="px-4 py-2 text-gray-500">{user.user_email}</td>
                  <td className="px-4 py-2 text-gray-500">{user.user_role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center' }}>No archived users found.</p>
        )}
      </div>
    </div>
  );
}
