import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCnRLUzLraNE-AR94ZlRGIAFOKks74ZtyQ",
    authDomain: "kenz--project.firebaseapp.com",
    databaseURL: "https://kenz--project-default-rtdb.firebaseio.com", // Ensure this URL is correct
    projectId: "kenz--project",
    storageBucket: "kenz--project.appspot.com",
    messagingSenderId: "435317870255",
    appId: "1:435317870255:web:f521650dcfeb63a7378e5a",
    measurementId: "G-FX6BSCQ8KQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Initialize Database

// Function to write data
function writeTestData() {
    const testRef = ref(database, 'test/');
    const testData = { test: 'This is a test' };
    console.log('Writing test data:', testData);

    set(testRef, testData).then(() => {
        console.log('Test data written successfully');
        // Verify if data is written successfully
        get(testRef).then((snapshot) => {
            console.log('Verified test data:', snapshot.val());
        }).catch((error) => {
            console.error('Error verifying test data:', error);
        });
    }).catch((error) => {
        console.error('Error writing test data:', error);
    });
}

// Call the function to write test data
document.addEventListener('DOMContentLoaded', () => {
    writeTestData();
});
