import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, child, get } from 'firebase/database';
import { auth, database } from '../Firebase'; // Adjust the path as necessary
import { ClipLoader } from 'react-spinners'; // Import the loader

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const dbRef = ref(database);

            // Check if the user exists in the users node and not in the members node
            const userSnapshot = await get(child(dbRef, `users/${user.uid}`));
            const memberSnapshot = await get(child(dbRef, `members/${user.uid}`));

            if (userSnapshot.exists() && !memberSnapshot.exists()) {
                navigate('/user-dashboard');
            } else {
                setError("You are not authorized to log in as a user.");
                auth.signOut();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">User Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={24} color="#fff" /> : 'Login'}
                    </button>
                </form>
                <div className="text-center">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-500 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
