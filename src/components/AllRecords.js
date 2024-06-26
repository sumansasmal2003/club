import React, { useEffect, useState } from 'react';
import { ref, child, get } from 'firebase/database';
import { database } from '../Firebase'; // Adjust the path to your Firebase configuration

const AllRecords = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const dbRef = ref(database);
                const usersSnapshot = await get(child(dbRef, 'users'));

                if (usersSnapshot.exists()) {
                    const fetchedUsers = [];
                    usersSnapshot.forEach((user) => {
                        const userData = user.val();
                        fetchedUsers.push({
                            userId: user.key,
                            ...userData
                        });
                    });
                    setUsers(fetchedUsers);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container flex-col mx-auto py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                    <div key={user.userId} className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="flex items-center p-4">
                            <img src={user.photoUrl} alt={user.name} className="h-12 w-12 rounded-full mr-4" />
                            <div>
                                <h2 className="text-lg font-semibold">{user.name}</h2>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                        </div>
                        <ParticipantList userId={user.userId} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const ParticipantList = ({ userId }) => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const dbRef = ref(database);
                const participantsSnapshot = await get(child(dbRef, 'participation'));

                if (participantsSnapshot.exists()) {
                    const fetchedParticipants = [];
                    participantsSnapshot.forEach((event) => {
                        Object.keys(event.val()).forEach((participantKey) => {
                            const participantData = event.val()[participantKey];
                            if (participantData.userId === userId) {
                                fetchedParticipants.push({
                                    eventId: event.key,
                                    participantId: participantKey,
                                    ...participantData
                                });
                            }
                        });
                    });
                    setParticipants(fetchedParticipants);
                }
            } catch (error) {
                console.error(`Error fetching participants for user ${userId}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, [userId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="px-4 py-2">
            <h3 className="text-lg font-semibold mb-2">Records:</h3>
            <ul>
                {participants.map((participant) => (
                    <li key={participant.participantId} className="bg-gray-100 rounded-md p-2 mb-2">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="font-semibold">Name: {participant.name}</p>
                                <p className="text-gray-600">Email: {participant.email}</p>
                                <p className="text-gray-600">Phone:  {participant.phone}</p>
                                <p className="text-gray-600">{participant.eventName} - {participant.eventDate} {participant.eventTime}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllRecords;
