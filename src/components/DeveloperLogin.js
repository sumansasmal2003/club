import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeveloperLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        const devUsername = process.env.REACT_APP_DEV_USERNAME;
        const devPassword = process.env.REACT_APP_DEV_PASSWORD;

        console.log(devPassword, devUsername);

        if (username === devUsername && password === devPassword) {
            navigate('/developer-dashboard');
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="w-[20rem] mx-auto mt-8 p-6 bg-white rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Developer Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-semibold shadow-md"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default DeveloperLogin;
