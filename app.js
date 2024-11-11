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

let deviceId = localStorage.getItem('deviceId');
if (!deviceId) {
    deviceId = 'device-' + Date.now();
    localStorage.setItem('deviceId', deviceId);
}

function toggleRating(type, id, deviceId) {
    const ratingRef = ref(database, 'ratings/' + id);

    get(ratingRef).then((snapshot) => {
        let data = snapshot.val() || { likes: 0, dislikes: 0, devices: {} };

        // إلغاء التقييم إذا كان الجهاز قد قيم الخدمة بنفس النوع
        if (data.devices && data.devices[deviceId] === type) {
            if (type === 'like') {
                data.likes -= 1;
            } else if (type === 'dislike') {
                data.dislikes -= 1;
            }
            delete data.devices[deviceId]; // حذف التقييم القديم
            alert("تم إلغاء التقييم.");
        } else {
            // إزالة التقييم القديم في حال وجوده
            if (data.devices && data.devices[deviceId] === 'like') {
                data.likes -= 1;
            } else if (data.devices && data.devices[deviceId] === 'dislike') {
                data.dislikes -= 1;
            }

            // إضافة التقييم الجديد
            if (type === 'like') {
                data.likes += 1;
            } else if (type === 'dislike') {
                data.dislikes += 1;
            }

            if (!data.devices) {
                data.devices = {};
            }
            data.devices[deviceId] = type; // إضافة التقييم الجديد
            alert("تم إضافة التقييم بنجاح.");
        }

        // تحديث البيانات في Firebase
        set(ratingRef, data).then(() => {
            console.log("تم تحديث التقييم بنجاح.");
            updateUI(id); // تحديث واجهة المستخدم بناءً على التقييم الجديد
        }).catch((error) => {
            console.error("خطأ في الكتابة إلى Firebase: ", error);
        });
    }).catch(error => console.error("خطأ في جلب البيانات:", error));
}

function updateUI(id) {
    const likeButton = document.getElementById(`like-${id}`);
    const dislikeButton = document.getElementById(`dislike-${id}`);
    
    // تحديث واجهة المستخدم بشكل مباشر بعد التقييم
    displayRatings(id);
}

function displayRatings(id) {
    const likeCount = document.getElementById(`like-count-${id}`);
    const dislikeCount = document.getElementById(`dislike-count-${id}`);
    
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
for (let i = 1; i <= 111; i++) {
    ids.push(i.toString());
}

document.addEventListener('DOMContentLoaded', () => {
    ids.forEach(id => {
        displayRatings(id);

        // إضافة التقييم عند الضغط على الأزرار
        document.getElementById(`like-${id}`).addEventListener('click', () => {
            toggleRating('like', id, deviceId);
        });

        document.getElementById(`dislike-${id}`).addEventListener('click', () => {
            toggleRating('dislike', id, deviceId);
        });
    });
});
