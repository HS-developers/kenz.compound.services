// تأكد من تحميل مكتبات Firebase بشكل صحيح
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, set, onValue, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// يجب أن تكون جميع الأكواد الخاصة بالتطبيق داخل هذه الوظيفة
document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------------------
    // بداية كود الخلفية المتحركة بالفقاعات
    // ----------------------------------------------------------------------------------
    const bubbleCanvas = document.getElementById('bubbleCanvas');
    if (!bubbleCanvas) {
        console.error("Canvas element with ID 'bubbleCanvas' not found.");
        return;
    }
    const ctx = bubbleCanvas.getContext('2d');
    let width = bubbleCanvas.width = window.innerWidth;
    let height = bubbleCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
    width = bubbleCanvas.width = window.innerWidth;
    height = bubbleCanvas.height = window.innerHeight;
    generateBubbles();
});

    const bubbles = [];
    const numberOfBubbles = 100;

    function createBubble() {
        const radius = Math.random() * 20 + 5;
        const x = Math.random() * width;
        const y = height + radius;
        const speed = Math.random() * 0.5 + 0.2;
        const opacity = Math.random() * 0.5 + 0.1;
        const color = `rgba(255, 255, 255, ${opacity})`;
        const directionX = (Math.random() - 0.5) * 0.2;

        return { x, y, radius, speed, color, directionX };
    }

    function generateBubbles() {
        bubbles.length = 0;
        for (let i = 0; i < numberOfBubbles; i++) {
            bubbles.push(createBubble());
        }
    }

    function drawBubbles() {
        ctx.clearRect(0, 0, width, height);
        bubbles.forEach(bubble => {
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            ctx.fillStyle = bubble.color;
            ctx.fill();
            bubble.y -= bubble.speed;
            bubble.x += bubble.directionX;

            if (bubble.y + bubble.radius < 0) {
                bubble.y = height + bubble.radius;
                bubble.x = Math.random() * width;
            }
        });
    }

    function animate() {
        drawBubbles();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        width = bubbleCanvas.width = window.innerWidth;
        height = bubbleCanvas.height = window.innerHeight;
        generateBubbles();
    });


    generateBubbles();
    animate();
    // ----------------------------------------------------------------------------------
    // نهاية كود الخلفية المتحركة بالفقاعات
    // ----------------------------------------------------------------------------------

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

    // جميع المجموعات والآيدي الخاصة بالعناصر (الصيغة الأصلية)
    const groups = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34'],
        ['76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91'],
        ['126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136'],
        ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228',
        '229', '230', '231', '232', '233', '234', '235'],
        ['276', '277', '278', '279', '280', '281', '282', '283'],
        ['351', '352', '353', '354', '355', '356', '357', '358'],
        ['426', '427', '428', '429', '430', '431', '432', '433'],
        ['501', '502', '503', '504'],
        ['576', '577', '578', '579', '580', '581'],
        ['651', '652', '653', '654', '655', '656', '657', '658', '659', '660', '661', '662', '663', '664', '665', '666', '667', '668', '669', '670', '671', '672', '673', '674', '675', '676', '677', '678'],
        ['726', '727', '728', '729', '730', '731', '732', '733', '734', '735', '736']
    ];

    // دالة لعرض عداد الاعجاب وعدم الاعجاب لكل العناصر في نفس الوقت
    function displayAllOldRatings() {
        const allRatingsRef = ref(database, 'ratings');
        onValue(allRatingsRef, (snapshot) => {
            const allRatings = snapshot.val() || {};
            groups.forEach(group => {
                group.forEach(id => {
                    const oldLikesDiv = document.getElementById(`old-likes-${id}`);
                    if (!oldLikesDiv) return;
                    const likeSpan = oldLikesDiv.querySelector('.like-count');
                    const dislikeSpan = oldLikesDiv.querySelector('.dislike-count');
                    const data = allRatings[id] || { likes: 0, dislikes: 0 };
                    if (likeSpan) likeSpan.textContent = data.likes || 0;
                    if (dislikeSpan) dislikeSpan.textContent = data.dislikes || 0;
                });
            });
        });
    }

    // عرض احصائيات الاعجاب وعدم الاعجاب القديمة لكل العناصر
    displayAllOldRatings();

    // نظام التقييم بالنجوم + تعليق (مع السماح بإضافة أو تعديل التقييم)
    document.querySelectorAll('#clinics .star-rating-comment, #pharmacies .star-rating-comment, #supermarket .star-rating-comment, #restaurants .star-rating-comment, #vegetables .star-rating-comment, #meat .star-rating-comment, #Cleaning .star-rating-comment, #Milk .star-rating-comment, #Grocery .star-rating-comment, #other_services .star-rating-comment, #General_services .star-rating-comment').forEach(block => {
        const serviceId = block.getAttribute('data-service-id');
        const stars = block.querySelectorAll('.star');
        const textarea = block.querySelector('.comment-text');
        const submitBtn = block.querySelector('.submit-rating');
        const commentsDiv = block.querySelector('.all-comments');
        let selectedRating = 0;
        let userRatingKey = null; // مفتاح تقييم هذا المستخدم لهذا المطعم

        // عنصر لإظهار متوسط التقييم
        let avgDiv = block.querySelector('.average-rating');
        if (!avgDiv) {
            avgDiv = document.createElement('div');
            avgDiv.className = 'average-rating';
            avgDiv.style.cssText = "margin: 5px 0 10px 0; font-weight: bold; color: #ff9800;";
            block.insertBefore(avgDiv, commentsDiv);
        }

        // تظليل النجوم عند المرور أو الاختيار
        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const val = parseInt(star.getAttribute('data-value'));
                stars.forEach(s => {
                    if (parseInt(s.getAttribute('data-value')) <= val) {
                        s.classList.add('hovered');
                    } else {
                        s.classList.remove('hovered');
                    }
                });
            });
            star.addEventListener('mouseleave', () => {
                stars.forEach(s => s.classList.remove('hovered'));
            });
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.getAttribute('data-value'));
                stars.forEach(s => {
                    if (parseInt(s.getAttribute('data-value')) <= selectedRating) {
                        s.classList.add('selected');
                    } else {
                        s.classList.remove('selected');
                    }
                });
            });
        });

        // جلب تقييم المستخدم الحالي (إن وجد) ووضعه في الفورم
        function fetchUserRating() {
            const ratingsRef = ref(database, `starRatings/${serviceId}`);
            userRatingKey = null;
            get(ratingsRef).then(snapshot => {
                if (snapshot.exists()) {
                    snapshot.forEach(child => {
                        const data = child.val();
                        if (data.deviceId === deviceId) {
                            userRatingKey = child.key;
                            // عرّض التقييم القديم في الفورم
                            selectedRating = data.rating;
                            textarea.value = data.comment;
                            stars.forEach(s => {
                                if (parseInt(s.getAttribute('data-value')) <= selectedRating) {
                                    s.classList.add('selected');
                                } else {
                                    s.classList.remove('selected');
                                }
                            });
                        }
                    });
                } else {
                    selectedRating = 0;
                    textarea.value = "";
                    stars.forEach(s => s.classList.remove('selected'));
                }
            });
        }
        fetchUserRating();

        // عند الإرسال: إذا له تقييم سابق عدل عليه، إذا ليس له تقييم سابق أضف واحد
        submitBtn.addEventListener('click', () => {
            if (selectedRating === 0) {
                alert("يرجى اختيار عدد النجوم أولاً");
                return;
            }
            const commentText = textarea.value.trim();
            if (commentText.length < 2) {
                alert("يرجى كتابة تعليق مناسب");
                return;
            }
            const ratingsRef = ref(database, `starRatings/${serviceId}`);
            const newRatingData = {
                deviceId,
                rating: selectedRating,
                comment: commentText,
                time: Date.now()
            };

            if (userRatingKey) {
                // إذا كان لدى المستخدم تقييم سابق، يتم تعديله
                const userRatingRef = ref(database, `starRatings/${serviceId}/${userRatingKey}`);
                set(userRatingRef, newRatingData).then(() => {
                    alert("تم تعديل تقييمك بنجاح");
                }).catch(error => {
                    console.error("خطأ في تعديل التقييم:", error);
                    alert("حدث خطأ أثناء تعديل تقييمك. يرجى المحاولة مرة أخرى.");
                });
            } else {
                // إذا لم يكن لديه تقييم، يتم إضافة تقييم جديد
                const newRatingRef = push(ratingsRef);
                set(newRatingRef, newRatingData).then(() => {
                    alert("تم إضافة تقييمك بنجاح");
                    fetchUserRating(); // استدعاء لجلب المفتاح الجديد
                }).catch(error => {
                    console.error("خطأ في إضافة التقييم:", error);
                    alert("حدث خطأ أثناء إضافة تقييمك. يرجى المحاولة مرة أخرى.");
                });
            }
        });

        // نافذة منبثقة لعرض كل التعليقات
        let modal = document.getElementById('comments-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'comments-modal';
            modal.style.display = 'none';
            modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <span class="close-modal" title="إغلاق">×</span>
                    <h3 style="margin-top:0;">كل التعليقات</h3>
                    <div class="modal-comments-list"></div>
                </div>
            `;
            document.body.appendChild(modal);
            // إغلاق النافذة
            modal.querySelector('.close-modal').onclick = () => { modal.style.display = 'none'; };
            modal.querySelector('.modal-backdrop').onclick = () => { modal.style.display = 'none'; };
        }
        const modalCommentsList = modal.querySelector('.modal-comments-list');

        // عرض زر "عرض كل التعليقات" فقط بدون إظهار أي تعليقات في القائمة الرئيسية
        const ratingsRef = ref(database, `starRatings/${serviceId}`);
        onValue(ratingsRef, (snapshot) => {
            commentsDiv.innerHTML = "";
            let ratingsArr = [];
            if (snapshot.exists()) {
                snapshot.forEach(child => {
                    ratingsArr.push(child.val());
                });
                ratingsArr.reverse();

                // زر عرض كل التعليقات (فقط)
                if (ratingsArr.length > 0) {
                    const btn = document.createElement('button');
                    btn.className = 'show-comments-btn';
                    btn.textContent = `عرض كل التعليقات (${ratingsArr.length})`;
                    btn.onclick = () => {
                        // تفريغ القائمة المنبثقة ثم ملأها بكل التعليقات
                        modalCommentsList.innerHTML = "";
                        ratingsArr.forEach(data => {
                            const commentDiv = document.createElement('div');
                            commentDiv.className = 'user-comment';
                            commentDiv.innerHTML = `
                                <span style="color:#ffc107;">${'★'.repeat(data.rating)}</span>
                                <span style="color:#bbb;">${'★'.repeat(5 - data.rating)}</span>
                                <span style="margin-right:8px;">${data.comment}</span>
                                <span style="font-size:10px; color:#888; float:left;">${new Date(data.time).toLocaleDateString('ar-EG')}</span>
                            `;
                            modalCommentsList.appendChild(commentDiv);
                        });
                        modal.style.display = 'block';
                    };
                    commentsDiv.appendChild(btn);
                }
                // حساب المتوسط
                const sum = ratingsArr.reduce((a, b) => a + b.rating, 0);
                const avg = ratingsArr.length > 0 ? (sum / ratingsArr.length).toFixed(2) : "0.00";
                avgDiv.innerHTML = `
                    متوسط التقييم: <span style="color:#ffc107;">${avg}</span> / 5
                    <span style="font-size:18px;">
                        ${'★'.repeat(Math.round(avg))}
                        <span style="color:#bbb;">${'★'.repeat(5 - Math.round(avg))}</span>
                    </span>
                    <span style="font-size:12px; color:#666; margin-right:5px;">(${ratingsArr.length} تقييم)</span>
                `;
            } else {
                avgDiv.innerHTML = `
                    متوسط التقييم: <span style="color:#ffc107;">0.00</span> / 5
                    <span style="font-size:18px;">
                        <span style="color:#bbb;">★★★★★</span>
                    </span>
                    <span style="font-size:12px; color:#666; margin-right:5px;">(0 تقييم)</span>
                `;
            }
        });
    });

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const serviceItems = document.querySelectorAll('.buttons li');
    const weatherButton = document.getElementById('weather-button');
    const trafficButton = document.getElementById('traffic-button');
    const newsButton = document.getElementById('news-button');
    const emergencyButton = document.getElementById('emergency-button');

    // دالة لتنقية النص العربي وتجاهل الهمزات وحالة الحروف
    function normalizeArabic(text) {
        if (!text) return '';
        let normalizedText = text.replace(/[أإآ]/g, 'ا');
        normalizedText = normalizedText.replace(/ى/g, 'ي');
        normalizedText = normalizedText.replace(/ة/g, 'ه'); // إضافة هذا السطر الجديد
        normalizedText = normalizedText.replace(/َ|ً|ُ|ٌ|ِ|ٍ|ْ|ّ/g, '');
        return normalizedText.trim().toLowerCase();
    }

    function resetServicesDisplay() {
        serviceItems.forEach(item => {
            item.style.display = 'block';
            const mainButton = item.querySelector('button');
            const serviceId = mainButton.getAttribute('onclick').match(/'(.*?)'/)[1];
            const subContent = document.getElementById(serviceId);
            if (subContent) {
                subContent.style.display = 'none';
            }
        });
    }

    function performSearch() {
        const searchTerm = normalizeArabic(searchInput.value);
        let serviceFound = false;

        // إعادة ضبط العرض في البداية
        resetServicesDisplay();

        if (searchTerm === '') {
            return;
        }

        // حلقة البحث
        for (let i = 0; i < serviceItems.length; i++) {
            const item = serviceItems[i];
            const mainButton = item.querySelector('button');
            const serviceId = mainButton.getAttribute('onclick').match(/'(.*?)'/)[1];
            const subContent = document.getElementById(serviceId);
            const combinedText = normalizeArabic(mainButton.textContent + ' ' + (subContent ? subContent.textContent : ''));

            // تعديل: نستخدم تعبيراً منتظماً للعثور على الكلمة وتحديدها
            const searchRegex = new RegExp(searchTerm, 'gi'); // 'g' للبحث في كل النص, 'i' لتجاهل حالة الحروف

            if (combinedText.includes(searchTerm)) {
                // تم العثور على الخدمة، نقوم بإظهارها وإخفاء الباقي
                toggleInfo(serviceId); // نفتح المحتوى الخاص بها
                item.style.display = 'block';
                serviceFound = true;

                // إخفاء جميع العناصر الأخرى
                serviceItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.style.display = 'none';
                    }
                });

                break; // نوقف عملية البحث
            }
        }

        if (!serviceFound) {
            alert('لم يتم العثور على الخدمة المطلوبة.');
            // في حالة عدم العثور، نعيد عرض كل الخدمات مرة أخرى
            resetServicesDisplay();
        }
    }

    // الاستماع لحدث الضغط على زر البحث
    searchButton.addEventListener('click', performSearch);

    // الاستماع لحدث تغيير المحتوى في حقل البحث
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') {
            resetServicesDisplay();
        }
    });


    // ----------------------------------------------------------------------------------
    // بداية كود النافذة المنبثقة المخصص
    // ----------------------------------------------------------------------------------

    // إنشاء النافذة المنبثقة مرة واحدة
    const modal = document.createElement('div');
    modal.id = 'infoModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">×</span>
        <div id="modal-body-content"></div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeButton = modal.querySelector(".close-button");
    const modalBodyContent = document.getElementById("modal-body-content");

    // دالة لإظهار النافذة المنبثقة مع محتوى مخصص
    function showModal(content) {
        modalBodyContent.innerHTML = content;
        modal.style.display = "block";
    }

    // إغلاق النافذة عند الضغط على زر الإغلاق
    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    // إغلاق النافذة عند الضغط خارجها
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // ----------------------------------------------------------------------------------
    // نهاية كود النافذة المنبثقة المخصص
    // ----------------------------------------------------------------------------------




    trafficButton.addEventListener('click', () => {
        const compoundLocation = "كنز كمبوند، السادس من أكتوبر، الجيزة، مصر";
        const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(compoundLocation)}&travelmode=driving`;
        window.open(googleMapsLink, '_blank');
    });

    newsButton.addEventListener('click', () => {
        const newsInfo = `
            <h3>أخبار الكمبوند</h3>
            <p>جاري اطلاق الخدمة قريبا....</p>
        `;
        showModal(newsInfo);
    });

    emergencyButton.addEventListener('click', () => {
        const emergencyInfo = `
            <h3>أرقام الطوارئ</h3>
            <ul>
                <li>مشرف الأمن الصباحي: 01281099253</li>
                <li>مشرف الأمن المسائي: 01281099273</li>
            </ul>
        `;
        showModal(emergencyInfo);
    });
});

