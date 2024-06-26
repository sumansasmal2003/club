import React, { useState } from 'react';
import { auth, storage, database } from '../Firebase'; // Adjust the path as necessary
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as databaseRef, set } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const UserRegister = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let photoUrl = '';
            if (profilePhoto) {
                const photoRef = storageRef(storage, `users/${user.uid}/profile.jpg`);
                await uploadBytes(photoRef, profilePhoto);
                photoUrl = await getDownloadURL(photoRef);
            }

            const userRef = databaseRef(database, `users/${user.uid}`);
            await set(userRef, {
                email: user.email,
                name: name,
                phone: phone,
                photoUrl: photoUrl
            });

            setSuccess('User registered successfully!');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="w-full mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h2>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
            <form onSubmit={handleRegister}>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600">Phone:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="Enter your phone number"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600">Profile Photo:</label>
                    <input
                        type="file"
                        onChange={(e) => setProfilePhoto(e.target.files[0])}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md font-semibold shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default UserRegister;
