import React, { useEffect, useState } from 'react';
import { ref, child, get } from 'firebase/database';
import { database } from '../Firebase'; // Adjust the path as necessary
import { FaEnvelope, FaPaperPlane, FaUserFriends } from 'react-icons/fa';

const DeveloperDashboard = () => {
    const [membersEmails, setMembersEmails] = useState([]);
    const [usersEmails, setUsersEmails] = useState([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [view, setView] = useState('membersEmails');
    const [recipientType, setRecipientType] = useState('');

    useEffect(() => {
        const fetchEmails = async (node, setEmails) => {
            try {
                const dbRef = ref(database);
                const usersRef = child(dbRef, node);

                const snapshot = await get(usersRef);
                if (snapshot.exists()) {
                    const fetchedEmails = [];
                    snapshot.forEach((userSnapshot) => {
                        const userData = userSnapshot.val();
                        if (userData.email) {
                            fetchedEmails.push(userData.email);
                        }
                    });
                    setEmails(fetchedEmails);
                }
            } catch (error) {
                console.error(`Error fetching emails from ${node}:`, error);
                setStatus(`Error fetching emails from ${node}.`);
            }
        };

        fetchEmails('members', setMembersEmails);
        fetchEmails('users', setUsersEmails);
    }, []);

    const sendEmails = async () => {
        try {
            const emails = recipientType === 'members' ? membersEmails : usersEmails;
            const response = await fetch('https://dev-server-8ynn.onrender.com/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emails, subject, message }),
            });

            if (response.ok) {
                setStatus('Emails sent successfully!');
            } else {
                throw new Error('Failed to send emails');
            }
        } catch (error) {
            console.error('Error sending emails:', error);
            setStatus('Error sending emails.');
        }
    };

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-100">
            <aside className="w-full lg:w-64 bg-gray-800 text-white p-4">
                <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
                <ul>
                    <li
                        className={`mb-4 cursor-pointer ${view === 'membersEmails' ? 'text-blue-300' : ''}`}
                        onClick={() => setView('membersEmails')}
                    >
                        <FaEnvelope className="inline-block mr-2" />
                        Members' Emails
                    </li>
                    <li
                        className={`mb-4 cursor-pointer ${view === 'usersEmails' ? 'text-blue-300' : ''}`}
                        onClick={() => setView('usersEmails')}
                    >
                        <FaUserFriends className="inline-block mr-2" />
                        Users' Emails
                    </li>
                    <li
                        className={`cursor-pointer ${view === 'send' ? 'text-blue-300' : ''}`}
                        onClick={() => setView('send')}
                    >
                        <FaPaperPlane className="inline-block mr-2" />
                        Send Emails
                    </li>
                </ul>
            </aside>
            <main className="flex-1 p-6">
                {view === 'membersEmails' && (
                    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-lg">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">Members' Emails</h2>
                        <ul className="mb-4">
                            {membersEmails.map((email, index) => (
                                <li key={index} className="text-blue-900 font-bold">{email}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {view === 'usersEmails' && (
                    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-lg">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">Users' Emails</h2>
                        <ul className="mb-4">
                            {usersEmails.map((email, index) => (
                                <li key={index} className="text-blue-900 font-bold">{email}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {view === 'send' && (
                    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-lg">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">Send Emails</h2>
                        <div className="mb-4">
                            <label className="block text-sm mb-3 font-semibold text-gray-600">Recipient Type:</label>
                            <div className="flex">
                                <button
                                    onClick={() => setRecipientType('members')}
                                    className={`w-full py-2 px-4 rounded-md font-semibold shadow-md ${recipientType === 'members' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    Members
                                </button>
                                <button
                                    onClick={() => setRecipientType('users')}
                                    className={`w-full py-2 px-4 rounded-md font-semibold shadow-md ml-2 ${recipientType === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    Users
                                </button>
                            </div>
                        </div>
                        {recipientType && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-600">Subject:</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-600">Message:</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                    />
                                </div>
                                <button
                                    onClick={sendEmails}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-semibold shadow-md"
                                >
                                    Send Email
                                </button>
                                {status && <p className="mt-4 text-gray-700">{status}</p>}
                            </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default DeveloperDashboard;
