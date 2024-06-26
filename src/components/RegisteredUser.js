// RegisteredUser.js

import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../Firebase'; // Adjust the path as necessary

const RegisteredUser = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const usersRef = ref(database, 'users'); // Reference to 'users' node in Firebase
        onValue(usersRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                // Convert userData object to an array of users
                const usersArray = Object.keys(userData).map((key) => ({
                    id: key,
                    ...userData[key]
                }));
                setUsers(usersArray);
            } else {
                setUsers([]);
            }
        });
    }, []);

    return (
        <div className="container flex-col mx-auto p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Registered Users</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4">
                            {/* Display user profile picture */}
                            <div className="flex items-center justify-center">
                                {user.photoUrl ? (
                                    <img src={user.photoUrl} alt={`${user.name}`} className="h-24 w-24 rounded-full" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 2a2.5 2.5 0 0 1 2.5 2.5c0 .795-.38 1.474-.894 2.016A7.993 7.993 0 0 0 15 10v1.5h1a1 1 0 0 1 1 1v3.16a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V15a1 1 0 0 1 1-1h1V10c0-1.086-.22-2.125-.606-3.084A3.023 3.023 0 0 1 7.5 4.5 2.5 2.5 0 0 1 10 2zm0 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                                        <path fillRule="evenodd" d="M4 5a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm12 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0zM3 13.5a1.5 1.5 0 0 1 3 0 1.5 1.5 0 0 1-3 0zM15 13.5a1.5 1.5 0 0 1 3 0 1.5 1.5 0 0 1-3 0z" />
                                    </svg>
                                )}
                            </div>
                            <div className="mt-4 text-center">
                                <h3 className="text-lg font-semibold text-gray-800">Name: {user.name}</h3>
                                <p className="text-gray-600">Email: {user.email}</p>
                                <p className="text-gray-600">Phone: {user.phone}</p>
                                {/* Additional user details can be added here */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RegisteredUser;
