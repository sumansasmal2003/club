import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#f0f0f0',
        padding: 20,
        fontFamily: 'Courier',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: 10,
    },
    clubName: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        color: 'blue',
        fontWeight: 600
    },
    infoSection: {
        marginBottom: 10,
    },
    infoLabel: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    infoText: {
        marginLeft: 5,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    infoBox: {
        backgroundColor: '#ffffff',
        padding: 8,
        borderRadius: 5,
        marginBottom: 10,
    },
});

const Receipt = ({ participantData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Title */}
            <Text style={styles.title}>Participant Information</Text>

            {/* Club Name */}
            <Text style={styles.clubName}>SIJGERIA UMESH CHANDRA SMRITI SANGHA</Text>

            {/* Participant Information */}
            <View style={styles.infoBox}>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text style={styles.infoText}>{participantData.name}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Phone:</Text>
                    <Text style={styles.infoText}>{participantData.phone}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoText}>{participantData.email}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Event Name:</Text>
                    <Text style={styles.infoText}>{participantData.eventName}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Event Date:</Text>
                    <Text style={styles.infoText}>{participantData.eventDate}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Event Time:</Text>
                    <Text style={styles.infoText}>{participantData.eventTime}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Participant ID:</Text>
                    <Text style={styles.infoText}>{participantData.participantId}</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default Receipt;
