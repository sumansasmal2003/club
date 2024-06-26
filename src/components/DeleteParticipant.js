import React, { useState } from 'react';
import { ref, child, get, remove } from 'firebase/database';
import { database } from '../Firebase'; // Adjust the path as necessary
import { ClipLoader } from 'react-spinners'; // Import the loader

const DeleteParticipant = () => {
    const [name, setName] = useState('');
    const [participantEvents, setParticipantEvents] = useState([]);
    const [otp, setOTP] = useState('');
    const [otpSent, setOTPSent] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [fetchingDetails, setFetchingDetails] = useState(false); // State for fetching participant details
    const [sendingOTP, setSendingOTP] = useState(false); // State for sending OTP
    const [deletingParticipant, setDeletingParticipant] = useState(false); // State for deleting participant

    const fetchParticipantDetails = async () => {
        setFetchingDetails(true); // Show loader
        try {
            const dbRef = ref(database);
            const participantsRef = child(dbRef, 'participation');

            const snapshot = await get(participantsRef);
            if (snapshot.exists()) {
                let foundEvents = [];
                snapshot.forEach((eventSnapshot) => {
                    eventSnapshot.forEach((participantSnapshot) => {
                        const participantData = participantSnapshot.val();
                        if (participantData.name.toLowerCase() === name.toLowerCase()) {
                            foundEvents.push({ ...participantData, eventKey: eventSnapshot.key, participantKey: participantSnapshot.key });
                        }
                    });
                });
                if (foundEvents.length > 0) {
                    setParticipantEvents(foundEvents);
                } else {
                    alert('Participant not found');
                    setParticipantEvents([]);
                }
            } else {
                alert('No participants found');
            }
        } catch (error) {
            console.error('Error fetching participant details:', error);
            alert('Error fetching participant details');
        } finally {
            setFetchingDetails(false); // Hide loader
        }
    };

    const sendOTP = async () => {
        setSendingOTP(true); // Show loader
        try {
            if (!selectedEvent) {
                alert('Please select an event first');
                return;
            }

            const { email, name, eventName, eventDate, eventTime } = selectedEvent;

            const response = await fetch('https://otp-server-wtkw.onrender.com/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    recipientEmail: email,
                    participantName: name,
                    eventName: eventName,
                    eventDate: eventDate,
                    eventTime: eventTime
                })
            });

            if (response.ok) {
                alert('OTP sent successfully!');
                setOTPSent(true);
            } else {
                throw new Error('Failed to send OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Error sending OTP. Please try again.');
        } finally {
            setSendingOTP(false); // Hide loader
        }
    };

    const verifyOTP = async () => {
        try {
            if (!selectedEvent) {
                alert('No event selected');
                return;
            }

            const { email } = selectedEvent;

            const response = await fetch('https://otp-server-wtkw.onrender.com/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ recipientEmail: email, enteredOTP: otp })
            });

            if (response.ok) {
                return true;
            } else {
                throw new Error('Failed to verify OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Error verifying OTP. Please try again.');
            return false;
        }
    };

    const handleDeleteParticipant = async () => {
        setDeletingParticipant(true); // Show loader
        try {
            if (!otpSent) {
                alert('Please send OTP first');
                return;
            }

            const otpVerified = await verifyOTP();
            if (!otpVerified) {
                alert('Invalid OTP. Please try again.');
                return;
            }

            const { eventKey, participantKey } = selectedEvent;

            const dbRef = ref(database);
            await remove(child(dbRef, `participation/${eventKey}/${participantKey}`));

            alert('Participant deleted successfully!');
            setName('');
            setParticipantEvents([]);
            setOTP('');
            setOTPSent(false);
            setSelectedEvent(null);
        } catch (error) {
            console.error('Error deleting participant:', error);
            alert('Failed to delete participant. Please try again.');
        } finally {
            setDeletingParticipant(false); // Hide loader
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Delete Participant</h2>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">Participant Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    required
                />
                <button
                    type="button"
                    onClick={fetchParticipantDetails}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-semibold shadow-md mr-2"
                    disabled={fetchingDetails}
                >
                    {fetchingDetails ? <ClipLoader size={24} color="#fff" /> : 'Fetch Details'}
                </button>
            </div>
            {participantEvents.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold mb-2">Participant Details</h3>
                    <ul className="mb-4">
                        {participantEvents.map((event, index) => (
                            <li key={index} className="bg-gray-100 p-4 rounded-md mb-2">
                                <input
                                    type="radio"
                                    name="selectedEvent"
                                    value={event.participantKey}
                                    onChange={() => setSelectedEvent(event)}
                                    className="mr-2"
                                />
                                <strong>Name:</strong> {event.name}<br />
                                <strong>Email:</strong> {event.email}<br />
                                <strong>Event Name:</strong> {event.eventName}<br />
                                <strong>Event Date:</strong> {event.eventDate}<br />
                                <strong>Event Time:</strong> {event.eventTime}<br />
                            </li>
                        ))}
                    </ul>
                    <div className="mb-4">
                        {!otpSent ? (
                            <button
                                type="button"
                                onClick={sendOTP}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-semibold shadow-md mr-2"
                                disabled={!selectedEvent || sendingOTP}
                            >
                                {sendingOTP ? <ClipLoader size={24} color="#fff" /> : 'Send OTP'}
                            </button>
                        ) : (
                            <>
                                <label className="block text-sm font-semibold text-gray-600">Enter OTP:</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOTP(e.target.value)}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleDeleteParticipant}
                                    className="mt-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-semibold shadow-md"
                                    disabled={!otpSent || deletingParticipant}
                                >
                                    {deletingParticipant ? <ClipLoader size={24} color="#fff" /> : 'Delete Participant'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteParticipant;
