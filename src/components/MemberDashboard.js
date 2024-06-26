import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { ref, child, get } from 'firebase/database';
import { auth, database } from '../Firebase'; // Adjust the path as necessary

const MemberDashboard = () => {
    const [memberData, setMemberData] = useState(null);
    const navigate = useNavigate(); // useNavigate hook for navigation

    useEffect(() => {
        const fetchMemberData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const dbRef = ref(database);
                    const memberSnapshot = await get(child(dbRef, `members/${user.uid}`));
                    if (memberSnapshot.exists()) {
                        setMemberData(memberSnapshot.val());
                    }
                }
            } catch (error) {
                console.error('Error fetching member data:', error);
            }
        };

        fetchMemberData();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/'); // Redirect to home page after logout using navigate
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="flex flex-col w-full">
            {/* Navbar */}
            <nav className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-around items-center max-w-full">
                    {/* Left side */}
                    <div className="flex items-center space-x-4">
                        {/* Member profile picture */}
                        <img
                            src={memberData?.photoUrl || '/default-profile-pic.png'}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        {/* Member name and designation */}
                        <div className="text-white">
                            <p className="text-sm font-semibold">{memberData?.name}</p>
                            <p className="text-xs font-semibold">{memberData?.department}</p>
                        </div>
                    </div>
                    {/* Right side */}
                    <div>
                        <Link
                            to="/logout"
                            className="text-white text-sm hover:text-gray-300 font-semibold transition duration-300"
                            onClick={handleLogout}
                        >
                            Logout
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Buttons and sections */}
                    {/* Example buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold shadow-md">
                            <Link
                                to="/photo-upload"
                            >
                                Photo Upload
                            </Link>
                        </button>
                        <button className="bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg font-semibold shadow-md">
                            <Link
                                to="/upload-participating-event"
                            >
                                Upload Participating Event
                            </Link>
                        </button>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-4 px-6 rounded-lg font-semibold shadow-md">
                            <Link
                                to="/upload-simple-event"
                            >
                                Upload Event
                            </Link>
                        </button>
                        <button className="bg-purple-500 hover:bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold shadow-md">
                            <Link
                                to="/manage-simple-event"
                            >
                                Manage Events
                            </Link>
                        </button>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold shadow-md">
                            <Link
                                to="/manage-participating-event"
                            >
                                Manage participating Events
                            </Link>
                        </button>
                        <button className="bg-cyan-500 hover:bg-cyan-600 text-white py-4 px-6 rounded-lg font-semibold shadow-md">
                            <Link
                                to="/registered-users"
                            >
                                Registered Users
                            </Link>
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold shadow-md">
                            <Link
                                to="/profile-change"
                            >
                                Change Profile
                            </Link>
                        </button>
                        <button className="bg-pink-500 hover:bg-pink-600 text-white py-4 px-6 rounded-lg font-semibold shadow-md">
                            <Link
                                to="/all-records"
                            >
                                User Records
                            </Link>
                        </button>
                        {/* Add more buttons as needed */}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MemberDashboard;
