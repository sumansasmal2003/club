import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../Firebase';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const dbRef = ref(database, 'members');
                const snapshot = await get(dbRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const membersArray = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    setMembers(membersArray);
                } else {
                    setError('No members found');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    if (loading) {
        return <LoadingMessage />;
    }

    if (error) {
        return <ErrorMessage error={error} />;
    }

    return (
        <div className="container flex-col mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">Our Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {members.map(member => (
                    <MemberCard key={member.id} member={member} />
                ))}
            </div>
        </div>
    );
};

const LoadingMessage = () => (
    <p className="text-center text-gray-500">Loading...</p>
);

const ErrorMessage = ({ error }) => (
    <p className="text-center text-red-500">Error: {error}</p>
);

const MemberCard = ({ member }) => (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full sm:w-[18rem]">
        <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full h-56 object-cover"
        />
        <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{member.name}</h3>
            <p className="text-gray-700 mb-2">{member.department}</p>
            <p className="text-gray-700 mb-2">{member.email}</p>
            <p className="text-gray-700">{member.phone}</p>
        </div>
    </div>
);

export default Members;
