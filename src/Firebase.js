// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCBdRmwaeqmHiwdJT-pLRHLm3wcBuWxnY0",
    authDomain: "database-48dad.firebaseapp.com",
    projectId: "database-48dad",
    storageBucket: "database-48dad.appspot.com",
    databaseURL: "https://database-48dad-default-rtdb.firebaseio.com",
    appId: "1:681119637520:android:14b378c8f89fb070316a95"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage };