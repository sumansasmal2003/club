import React, { useEffect, useState } from 'react';
import { ref, child, get } from 'firebase/database';
import { auth, database } from '../Firebase'; // Adjust the path as necessary

const UserRecord = () => {
    const [userParticipants, setUserParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserParticipants = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userId = user.uid;
                    const dbRef = ref(database);
                    const participantsRef = child(dbRef, `participation`);

                    const snapshot = await get(participantsRef);
                    if (snapshot.exists()) {
                        const participants = [];
                        snapshot.forEach(eventSnapshot => {
                            eventSnapshot.forEach(participantSnapshot => {
                                const participantData = participantSnapshot.val();
                                if (participantData.userId === userId) {
                                    participants.push(participantData);
                                }
                            });
                        });

                        setUserParticipants(participants);
                    } else {
                        setError('No participants found.');
                    }
                } else {
                    setError('User not authenticated. Please log in.');
                }
            } catch (error) {
                console.error('Error fetching user participants:', error);
                setError('Error fetching user participants');
            } finally {
                setLoading(false);
            }
        };

        fetchUserParticipants();
    }, []);

    return (
        <div className="max-w-full mx-auto mt-8 p-6 bg-white rounded shadow-lg overflow-x-auto">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Your Participants</h2>
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-red-600 text-center">{error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto whitespace-no-wrap">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Phone</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Event Name</th>
                                <th className="px-4 py-2">Event Date</th>
                                <th className="px-4 py-2">Event Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userParticipants.map((participant, index) => (
                                <tr key={index} className="bg-white border-b">
                                    <td className="px-4 py-2">{participant.name}</td>
                                    <td className="px-4 py-2">{participant.phone}</td>
                                    <td className="px-4 py-2">{participant.email}</td>
                                    <td className="px-4 py-2">{participant.eventName}</td>
                                    <td className="px-4 py-2">{participant.eventDate}</td>
                                    <td className="px-4 py-2">{participant.eventTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserRecord;
