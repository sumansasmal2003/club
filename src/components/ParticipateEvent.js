import React, { useEffect, useState } from 'react';
import { ref, child, get, push, update } from 'firebase/database';
import { auth, database } from '../Firebase'; // Adjust the path as necessary
import { PDFDownloadLink } from '@react-pdf/renderer';
import Receipt from './Receipt';
import axios from 'axios'; // Import axios for HTTP requests

const ParticipateEvent = () => {
    const [userData, setUserData] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [participantData, setParticipantData] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false); // State to toggle OTP input field

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const dbRef = ref(database);
                    const userSnapshot = await get(child(dbRef, `users/${user.uid}`));
                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.val();
                        setName(userData.name);
                        setPhone(userData.phone);
                        setEmail(userData.email);
                        setUserData(userData);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchEvents = async () => {
            try {
                const dbRef = ref(database);
                const eventsSnapshot = await get(child(dbRef, 'events'));

                if (eventsSnapshot.exists()) {
                    const eventsData = [];
                    eventsSnapshot.forEach((event) => {
                        eventsData.push({
                            id: event.key,
                            ...event.val()
                        });
                    });
                    setEvents(eventsData);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchUserData();
        fetchEvents();
    }, []);

    const handleSendOTP = async () => {
        try {
            // Validate input fields
            if (!selectedEvent) {
                setErrorMessage('Please select an event to participate.');
                return;
            }
            if (!name || !phone || !email) {
                setErrorMessage('Please fill in all participant details.');
                return;
            }

            // Send participant data to server to request OTP
            const response = await axios.post('https://otp-participation.onrender.com/send-otp', {
                name,
                phone,
                email,
                eventName: selectedEvent.eventName // Assuming selectedEvent is an object with eventName
            });

            if (response.status === 200) {
                setSuccessMessage('OTP sent to your email. Please check and enter below.');
                setShowOtpInput(true); // Display OTP input field
                setErrorMessage(''); // Clear any previous error messages
            } else {
                setErrorMessage('Failed to send OTP. Please try again.');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            setErrorMessage('Failed to send OTP. Please try again.');
            setSuccessMessage('');
        }
    };

    const handleVerifyOTP = async () => {
        try {
            // Validate OTP
            if (!otp) {
                setErrorMessage('Please enter the OTP sent to your email.');
                return;
            }

            // Verify OTP with server
            const response = await axios.post('https://otp-participation.onrender.com/verify-otp', {
                email,
                otp
            });

            if (response.status === 200) {
                // OTP verified successfully, proceed with participation
                await participateEvent();
            } else {
                setErrorMessage('Invalid OTP. Please enter the correct OTP.');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setErrorMessage('Failed to verify OTP. Please try again.');
            setSuccessMessage('');
        }
    };

    const participateEvent = async () => {
        try {
            // Proceed with event participation logic (similar to handleSubmit)

            // Check if participant already exists in the event by name
            const dbRef = ref(database);
            const eventRef = child(dbRef, `participation/${selectedEvent.id}`);
            const participantsSnapshot = await get(eventRef);

            if (participantsSnapshot.exists()) {
                let participantExists = false;
                participantsSnapshot.forEach((participantSnapshot) => {
                    const participant = participantSnapshot.val();
                    if (participant.name === name) {
                        participantExists = true;
                        return true; // Exit the loop
                    }
                });

                if (participantExists) {
                    setErrorMessage('You have already participated in this event.');
                    // Send failure email to participant with specific reason
                    await axios.post('https://otp-participation.onrender.com/unsuccess-mail', {
                        name: name,
                        email: email,
                        eventName: selectedEvent.eventName,
                        reason: `${name} have already participated in the ${selectedEvent.eventName} event`
                    });
                    return;
                }
            }

            // Proceed with participation
            const participantRef = push(eventRef);
            const participationData = {
                email: email || '',
                eventDate: selectedEvent.eventDate || '',
                eventName: selectedEvent.eventName || '',
                eventTime: selectedEvent.eventTime || '',
                name: name || '',
                participantId: participantRef.key,
                phone: phone || '',
                userId: auth.currentUser.uid
            };

            await update(participantRef, participationData);

            setParticipantData(participationData); // Set participantData for receipt generation
            setSuccessMessage('You have successfully participated in the event!');
            setErrorMessage(''); // Clear any previous error messages

            // Send confirmation email upon successful participation
            const confirmationEmailResponse = await axios.post('https://otp-participation.onrender.com/confirmation-mail', {
                name: name,
                phone: phone,
                email: email,
                eventName: selectedEvent.eventName,
                eventDate: selectedEvent.eventDate,
                eventTime: selectedEvent.eventTime
            });

            if (confirmationEmailResponse.status === 200) {
                console.log('Confirmation email sent successfully.');
            } else {
                console.error('Failed to send confirmation email.');
                // Send failure email to participant
                await axios.post('https://otp-participation.onrender.com/unsuccess-mail', {
                    name: name,
                    email: email,
                    reason: 'Failed to send confirmation email.'
                });
            }

        } catch (error) {
            console.error('Error participating in event:', error);
            setErrorMessage('Failed to participate in the event. Please try again.');
            setSuccessMessage('');
            // Send failure email to participant with specific reason
            await axios.post('https://otp-participation.onrender.com/unsuccess-mail', {
                name: name,
                email: email,
                reason: 'Failed to participate in the event. Please try again.'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (showOtpInput) {
            // Verify OTP first if OTP input is visible
            handleVerifyOTP();
        } else {
            // Otherwise, request OTP
            handleSendOTP();
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Participate in an Event</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600">Select Event:</label>
                    <select
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        value={selectedEvent ? JSON.stringify(selectedEvent) : ''}
                        onChange={(e) => setSelectedEvent(JSON.parse(e.target.value))}
                        required
                    >
                        <option value="" disabled>Select an event...</option>
                        {events.map((event) => (
                            <option key={event.id} value={JSON.stringify(event)}>
                                {event.eventName} - {event.eventDate} {event.eventTime}
                            </option>
                        ))}
                    </select>
                </div>
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
                {showOtpInput && (
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-600">Enter OTP:</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-semibold shadow-md"
                >
                    {showOtpInput ? 'Verify OTP' : 'Request OTP'}
                </button>
            </form>
            {successMessage && (
                <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-2 text-green-600">{successMessage}</h3>
                </div>
            )}
            {errorMessage && (
                <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-2 text-red-600">{errorMessage}</h3>
                </div>
            )}
            {participantData && (
                <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-2">Download Receipt</h3>
                    <PDFDownloadLink document={<Receipt participantData={participantData} />} fileName="receipt.pdf">
                        {({ loading }) =>
                            loading ? 'Loading document...' : 'Download Receipt'
                        }
                    </PDFDownloadLink>
                </div>
            )}
        </div>
    );
};

export default ParticipateEvent;
