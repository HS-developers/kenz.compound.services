// تأكد من تحميل مكتبات Firebase بشكل صحيح
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// تكوين Firebase
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

function updateCount(type, id) {
    const likeIcon = document.getElementById(`like-${id}`);
    const dislikeIcon = document.getElementById(`dislike-${id}`);
    const likeCount = document.getElementById(`like-count-${id}`);
    const dislikeCount = document.getElementById(`dislike-count-${id}`);
    const thankYouMessage = document.getElementById(`thank-you-message-${id}`);

    const ratingRef = ref(database, 'ratings/' + id);

    get(ratingRef).then((snapshot) => {
        let data = snapshot.val() || { likes: 0, dislikes: 0, devices: {} };

        if (!data.devices) {
            data.devices = {};
        }

        if (data.devices[deviceId] === type) {
            // إلغاء التقييم
            if (type === 'like') {
                data.likes -= 1;
                likeIcon.style.color = '';
                dislikeIcon.style.pointerEvents = 'auto';
            } else if (type === 'dislike') {
                data.dislikes -= 1;
                dislikeIcon.style.color = '';
                likeIcon.style.pointerEvents = 'auto';
            }
            delete data.devices[deviceId];
        } else {
            // إضافة التقييم
            if (type === 'like') {
                data.likes += 1;
                likeIcon.style.color = 'blue';
                dislikeIcon.style.pointerEvents = 'none';
            } else if (type === 'dislike') {
                data.dislikes += 1;
                dislikeIcon.style.color = 'red';
                likeIcon.style.pointerEvents = 'none';
            }
            data.devices[deviceId] = type;
        }

        set(ratingRef, data).then(() => {
            console.log("Rating updated successfully.");
            likeCount.textContent = data.likes;
            dislikeCount.textContent = data.dislikes;
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
    const likeIcon = document.getElementById(`like-${id}`);
    const dislikeIcon = document.getElementById(`dislike-${id}`);

    const thankYouMessage = document.createElement('div');
    thankYouMessage.id = `thank-you-message-${id}`;
    thankYouMessage.style.display = 'none';
    thankYouMessage.style.color = 'green';
    thankYouMessage.textContent = 'شكراً تم التقييم!';
    document.body.appendChild(thankYouMessage);

    const ratingRef = ref(database, 'ratings/' + id);

    onValue(ratingRef, (snapshot) => {
        let data = snapshot.val() || { likes: 0, dislikes: 0, devices: {} };
        likeCount.textContent = data.likes;
        dislikeCount.textContent = data.dislikes;

        // تحقق من التقييم السابق للجهاز
        if (data.devices && data.devices[deviceId] === 'like') {
            likeIcon.style.color = 'blue';
            dislikeIcon.style.pointerEvents = 'none';
        } else if (data.devices && data.devices[deviceId] === 'dislike') {
            dislikeIcon.style.color = 'red';
            likeIcon.style.pointerEvents = 'none';
        }
    }, (error) => {
        console.error("Error fetching ratings:", error);
    });
}

const groups = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'], // المجموعة 1 خدمات طبية
    ['76', '77', '78', '79', '80', '81', '82', '83', '84'], //  المجموعة 2 صيدليات
    ['126', '127', '128', '129', '130', '131', '132', '133', '134', '135'],  //  المجموعة 3 سوبر ماركت
    ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224'], //  المجموعة 4 مطاعم و حلويات
    ['276', '277', '278', '279', '280', '281', '282'], //  المجموعة 5 خضروات و فواكه
    ['351', '352', '353', '354', '355', '356', '357', '358'], //  المجموعة 6 دواجن و لحوم
    ['426', '427', '428', '429', '430', '431', '432'], //  المجموعة 7 تنظيف ملابس و سجاد
    ['501', '502', '503', '504'], //  المجموعة 8 منتجات ألبان
    ['576', '577', '578', '579', '580'], //  المجموعة 9 عطارة و تسالي
    ['651', '652', '653', '654', '655', '656', '657', '658', '659', '660', '661', '662', '663', '664', '665', '666', '667', '668', '669', '670', '671', '672', '673', '674', '675', '676', '677', '678', '679', '680', '681', '682'], //  المجموعة 10 متنوعات
    ['726', '727', '728', '729', '730', '731', '732', '733', '734'] //  المجموعة 11 خدمات عامه
];

document.addEventListener('DOMContentLoaded', () => {
    groups.forEach(group => {
        group.forEach(id => {
            displayRatings(id);

            document.getElementById(`like-${id}`).addEventListener('click', () => updateCount('like', id));
            document.getElementById(`dislike-${id}`).addEventListener('click', () => updateCount('dislike', id));
        });
    });
});
