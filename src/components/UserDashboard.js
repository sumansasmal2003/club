import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ref, child, get } from 'firebase/database';
import { auth, database } from '../Firebase';

const UserDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const dbRef = ref(database);
                    const userSnapshot = await get(child(dbRef, `users/${user.uid}`));
                    if (userSnapshot.exists()) {
                        setUserData(userSnapshot.val());
                    } else {
                        setError('User data not found.');
                    }
                } else {
                    setError('User not authenticated.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Error fetching user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/'); // Redirect to home page after logout using navigate
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="flex flex-col w-full">
            {/* Navbar */}
            <nav className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-around items-center max-w-full">
                    {/* Left side */}
                    <div className="flex items-center space-x-4">
                        {/* Member profile picture */}
                        <img
                            src={userData?.photoUrl || '/default-profile-pic.png'}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        {/* Member name */}
                        <div className="text-white">
                            <p className="text-sm font-semibold">{userData?.name}</p>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Example buttons */}
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold shadow-md">
                            <Link to="/participate-events">Participate Events</Link>
                        </button>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold shadow-md">
                            <Link to="/delete-participant">Delete Participant</Link>
                        </button>
                        <button className="bg-purple-500 hover:bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold shadow-md">
                            <Link to="/chnge-prfle">Change Profile</Link>
                        </button>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-4 px-6 rounded-lg font-semibold shadow-md">
                            <Link to="/user-records">Your Records</Link>
                        </button>
                        {/* Add more buttons as needed */}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
