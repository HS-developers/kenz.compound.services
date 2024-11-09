<script>
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  const analytics = getAnalytics(app);
</script>

    function updateCount(type, id) {
        const likeIcon = document.getElementById(`like-${id}`);
        const dislikeIcon = document.getElementById(`dislike-${id}`);
        const likeCount = document.getElementById(`like-count-${id}`);
        const dislikeCount = document.getElementById(`dislike-count-${id}`);

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

            set(ratingRef, data);
        }).catch(error => console.error("Error updating count:", error));
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

    document.addEventListener('DOMContentLoaded', () => {
        ids.forEach(id => displayRatings(id));
    });

} catch (error) {
    console.error("Firebase initialization failed:", error);
}
