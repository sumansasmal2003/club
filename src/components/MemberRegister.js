import React, { useState } from 'react';
import { auth, storage, database } from '../Firebase'; // Adjust the path as necessary
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as databaseRef, set } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ThreeDots } from 'react-loader-spinner'; // Correctly import the ThreeDots loader

const MemberRegister = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [department, setDepartment] = useState('');
    const [secretCode, setSecretCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        console.log('Secret Code:', process.env.REACT_APP_SECRET_CODE); // Debugging line

        if (secretCode !== process.env.REACT_APP_SECRET_CODE) {
            setLoading(false);
            setError('Invalid secret code.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let photoUrl = '';
            if (profilePhoto) {
                const photoRef = storageRef(storage, `members/${user.uid}/profile.jpg`);
                await uploadBytes(photoRef, profilePhoto);
                photoUrl = await getDownloadURL(photoRef);
            }

            const userRef = databaseRef(database, `members/${user.uid}`);
            await set(userRef, {
                email: user.email,
                name: name,
                phone: phone,
                department: department,
                photoUrl: photoUrl
            });

            setLoading(false);
            setSuccess('Member registered successfully!');
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    return (
        <div className="w-full mx-auto mt-8 p-6 bg-white rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Register as Member</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <form onSubmit={handleRegister}>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600">Phone:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600">Department:</label>
                    <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    >
                        <option value="">Select a department</option>
                        <option value="secretary">Secretary</option>
                        <option value="member">Member</option>
                        <option value="treasurer">Treasurer</option>
                        {/* Add other departments as needed */}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600">Profile Photo:</label>
                    <input
                        type="file"
                        onChange={(e) => setProfilePhoto(e.target.files[0])}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600">Secret Code:</label>
                    <input
                        type="text"
                        value={secretCode}
                        onChange={(e) => setSecretCode(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-semibold shadow-md"
                >
                    Register
                </button>
            </form>
            {loading && (
                <div className="flex justify-center mt-4">
                    <ThreeDots color="#00BFFF" height={80} width={80} />
                </div>
            )}
        </div>
    );
};

export default MemberRegister;
