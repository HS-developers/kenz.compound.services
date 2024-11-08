import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js"; // Import Analytics

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvRIeZ6k6H876dtug6oRip09X1AX4RWCs",
    authDomain: "kenz-project.firebaseapp.com",
    databaseURL: "https://kenz-project-default-rtdb.firebaseio.com", // Ensure this URL is correct
    projectId: "kenz-project",
    storageBucket: "kenz-project.appspot.com",
    messagingSenderId: "224735676437",
    appId: "1:224735676437:web:9f29c4d74b56080b0aa61c",
    measurementId: "G-2FSGW01R4T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Initialize Analytics
const database = getDatabase(app); // Initialize Database

function updateCount(type, id) {
    const likeIcon = document.getElementById(`like-${id}`);
    const dislikeIcon = document.getElementById(`dislike-${id}`);
    const likeCount = document.getElementById(`like-count-${id}`);
    const dislikeCount = document.getElementById(`dislike-count-${id}`);

    const ratingRef = ref(database, 'ratings/' + id);

    get(ratingRef).then((snapshot) => {
        let data = snapshot.val() || { likes: 0, dislikes: 0 };
        console.log(`Current data for ${id}:`, data);

        if (type === 'like') {
            data.likes += 1;
            likeCount.textContent = data.likes;
            likeIcon.style.color = 'blue';
            dislikeIcon.style.pointerEvents = 'none';
        } else if (type === 'dislike') {
            data.dislikes += 1;
            dislikeCount.textContent = data.dislikes;
            dislikeIcon.style.color = 'red';
            likeIcon.style.pointerEvents = 'none';
        }

        set(ratingRef, data).then(() => {
            console.log(`Updated data for ${id}:`, data);
            // Verify if data is written successfully
            get(ratingRef).then((newSnapshot) => {
                console.log(`Verified data for ${id}:`, newSnapshot.val());
            }).catch((error) => {
                console.error("Error verifying data:", error);
            });
        }).catch((error) => {
            console.error("Error updating data:", error);
        });
    }).catch((error) => {
        console.error("Error fetching data:", error);
    });
}

function displayRatings(id) {
    const likeCount = document.getElementById(`like-count-${id}`);
    const dislikeCount = document.getElementById(`dislike-count-${id}`);

    const ratingRef = ref(database, 'ratings/' + id);

    onValue(ratingRef, (snapshot) => {
        let data = snapshot.val() || { likes: 0, dislikes: 0 };
        console.log(`Displaying data for ${id}:`, data);
        likeCount.textContent = data.likes;
        dislikeCount.textContent = data.dislikes;
    });
}

// Generate IDs based on the specified ranges
const ids = [];
for (let i = 400; i <= 421; i++) {
    ids.push(i.toString());
}
for (let i = 1; i <= 19; i++) {
    ids.push(i.toString());
}
for (let i = 211; i <= 232; i++) {
    ids.push(i.toString());
}
for (let i = 111; i <= 117; i++) {
    ids.push(i.toString());
}
for (let i = 31; i <= 50; i++) {
    ids.push(i.toString());
}
for (let i = 500; i <= 519; i++) {
    ids.push(i.toString());
}

// Call the function to display ratings when the page loads
document.addEventListener('DOMContentLoaded', () => {
    ids.forEach(id => displayRatings(id));
});
