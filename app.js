import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCnRLUzLraNE-AR94ZlRGIAFOKks74ZtyQ",
    authDomain: "kenz--project.firebaseapp.com",
    databaseURL: "https://kenz--project-default-rtdb.firebaseio.com",
    projectId: "kenz--project",
    storageBucket: "kenz--project.firebasestorage.app",
    messagingSenderId: "435317870255",
    appId: "1:435317870255:web:f521650dcfeb63a7378e5a",
    measurementId: "G-FX6BSCQ8KQ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function updateCount(type, id) {
    const likeIcon = document.getElementById(`like-${id}`);
    const dislikeIcon = document.getElementById(`dislike-${id}`);
    const likeCount = document.getElementById(`like-count-${id}`);
    const dislikeCount = document.getElementById(`dislike-count-${id}`);
    const thankYouMessage = document.getElementById(`thank-you-message-${id}`);

    const ratingRef = ref(database, 'ratings/' + id);

    get(ratingRef).then((snapshot) => {
        let data = snapshot.val() || { likes: 0, dislikes: 0 };

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
            console.log("Rating updated successfully.");
            thankYouMessage.style.display = 'block';

            setTimeout(() => {
                thankYouMessage.style.display = 'none';
            }, 3000);
        }).catch((error) => {
            console.error("Error writing to Firebase: ", error);
        });
    }).catch(error => console.error("Error fetching count:", error));
}

function displayRatings(id) {
    const likeCount = document.getElementById(`like-count-${id}`);
    const dislikeCount = document.getElementById(`dislike-count-${id}`);
    
    const thankYouMessage = document.createElement('div');
    thankYouMessage.id = `thank-you-message-${id}`;
    thankYouMessage.style.display = 'none';
    thankYouMessage.style.color = 'green';
    thankYouMessage.textContent = 'شكراً تم التقييم!';
    document.body.appendChild(thankYouMessage);

    const ratingRef = ref(database, 'ratings/' + id);

    onValue(ratingRef, (snapshot) => {
        let data = snapshot.val() || { likes: 0, dislikes: 0 };
        likeCount.textContent = data.likes;
        dislikeCount.textContent = data.dislikes;
    }, (error) => {
        console.error("Error fetching ratings:", error);
    });
}

const ids = [];
for (let i = 1; i <= 110; i++) {
    ids.push(i.toString());
}

document.addEventListener('DOMContentLoaded', () => {
    ids.forEach(id => displayRatings(id));
});

document.addEventListener('DOMContentLoaded', () => {
    ids.forEach(id => {
        displayRatings(id);

        document.getElementById(`like-${id}`).addEventListener('click', () => updateCount('like', id));
        document.getElementById(`dislike-${id}`).addEventListener('click', () => updateCount('dislike', id));
    });
});
