// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js"; // Import Analytics

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Initialize Analytics
const database = getDatabase(app); // Initialize Database

function updateCount(type, id) {
    const likeIcon = document.getElementById(`like-${id}`);
    const dislikeIcon = document.getElementById(`dislike-${id}`);
    const likeCount = document.getElementById(`like-count-${id}`);
    const dislikeCount = document.getElementById(`dislike-count-${id}`);
    const thankYouMessage = document.getElementById(`thank-you-message-${id}`); // الرسالة التي ستظهر

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

        // إرسال البيانات إلى Firebase
        set(ratingRef, data).then(() => {
            // عرض رسالة الشكر بعد إرسال التقييم بنجاح
            thankYouMessage.style.display = 'block'; // إظهار الرسالة

            // إخفاء الرسالة بعد 3 ثواني
            setTimeout(() => {
                thankYouMessage.style.display = 'none'; // إخفاء الرسالة بعد مرور 3 ثواني
            }, 3000);
        }).catch((error) => {
            console.error("Error writing to Firebase: ", error);
        });
    }).catch(error => console.error("Error fetching count:", error));
}

function displayRatings(id) {
    const likeCount = document.getElementById(`like-count-${id}`);
    const dislikeCount = document.getElementById(`dislike-count-${id}`);
    
    // إضافة رسالة الشكر إلى الصفحة
    const thankYouMessage = document.createElement('div');
    thankYouMessage.id = `thank-you-message-${id}`;
    thankYouMessage.style.display = 'none'; // في البداية لا تظهر الرسالة
    thankYouMessage.style.color = 'green';
    thankYouMessage.textContent = 'شكراً تم التقييم!'; // نص الرسالة
    document.body.appendChild(thankYouMessage); // يمكنك تغيير مكان الرسالة حسب التصميم الخاص بك

    const ratingRef = ref(database, 'ratings/' + id);

    onValue(ratingRef, (snapshot) => {
        let data = snapshot.val() || { likes: 0, dislikes: 0 };
        likeCount.textContent = data.likes;
        dislikeCount.textContent = data.dislikes;
    }, (error) => {
        console.error("Error fetching ratings:", error);
    });
}

// Generate IDs from 1 to 110
const ids = [];
for (let i = 1; i <= 110; i++) {
    ids.push(i.toString()); // Add each number as a string
}

// Call the function to display ratings when the page loads
document.addEventListener('DOMContentLoaded', () => {
    ids.forEach(id => displayRatings(id));
});
