import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js"; // Added onValue import

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

        console.log(`Data to be written for ${id}:`, data); // Log data before writing

        set(ratingRef, data).then(() => {
            console.log(`Data successfully written for ${id}:`, data); // Log after writing

            // Verify if data is written successfully
            get(ratingRef).then((newSnapshot) => {
                console.log(`Verified data for ${id}:`, newSnapshot.val()); // Log verified data
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

const initializeDataForId = async (id) => {
    const idRef = ref(database, `ratings/${id}`);
    const snapshot = await get(idRef);
    if (!snapshot.exists()) {
        await set(idRef, { likes: 0, dislikes: 0 });
        console.log(`Initialized data for ID ${id}`);
    }
};

// Use the previously defined `ids` array for initialization
ids.forEach(id => initializeDataForId(id));

const testRef = ref(database, 'ratings/test');
set(testRef, { likes: 1, dislikes: 1 })
  .then(() => {
      console.log("Test data written successfully.");
      return get(testRef);
  })
  .then(snapshot => {
      console.log("Test data read successfully:", snapshot.val());
  })
  .catch(error => console.error("Error in test write/read:", error));
