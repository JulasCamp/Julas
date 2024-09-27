import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// تهيئة Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAgbRxofhjd_788QdE7BUNxR_sO58WpzfY",
    authDomain: "julas-camp.firebaseapp.com",
    databaseURL: "https://julas-camp-default-rtdb.firebaseio.com",
    projectId: "julas-camp",
    storageBucket: "julas-camp.appspot.com",
    messagingSenderId: "398458036302",
    appId: "1:398458036302:web:96c36bba22751a8be2a31f",
    measurementId: "G-EQ9WY4498D"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// وظيفة اختيار الفترة الزمنية
function selectPeriod(period) {
    document.getElementById('time').value = period;
    var periods = document.getElementsByClassName('period');
    for (var i = 0; i < periods.length; i++) {
        periods[i].style.backgroundColor = '#333';
    }
    event.target.style.backgroundColor = '#555';
}

// وظيفة تغيير اللغة
function switchLang(lang) {
    if (lang === 'ar') {
        document.getElementById('site-name').textContent = 'اسم الموقع';
        document.getElementById('form-title').textContent = 'حجز موقع المخيم';
        document.getElementById('name-label').textContent = 'الاسم الكامل';
        document.getElementById('email-label').textContent = 'البريد الإلكتروني';
        document.getElementById('date-label').textContent = 'تاريخ الحجز';
        document.querySelector('button[type="submit"]').textContent = 'إرسال';
    } else if (lang === 'en') {
        document.getElementById('site-name').textContent = 'Site Name';
        document.getElementById('form-title').textContent = 'Camp Booking';
        document.getElementById('name-label').textContent = 'Full Name';
        document.getElementById('email-label').textContent = 'Email Address';
        document.getElementById('date-label').textContent = 'Booking Date';
        document.querySelector('button[type="submit"]').textContent = 'Submit';
    }
}

// معالجة إرسال النموذج
document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var form = event.target;
    var name = form.name.value;
    var email = form.email.value;
    var dateInput = form.date.value;
    var selectedPeriod = form.time.value;

    var selectedDate = new Date(dateInput);
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        alert('لا يمكنك الحجز في تاريخ فائت.');
        return;
    }

    var bookingKey = dateInput + ' ' + selectedPeriod;

    // تحقق من التوقيت المحجوز
    const bookingRef = ref(database, 'bookings/' + bookingKey);
    get(bookingRef).then(function(snapshot) {
        if (snapshot.exists()) {
            alert('التوقيت المحدد في هذا اليوم محجوز بالفعل.');
        } else {
            // تخزين الحجز في Firebase
            set(bookingRef, {
                name: name,
                email: email,
                date: dateInput,
                time: selectedPeriod
            });

            alert('تم إرسال طلب الحجز بنجاح!');

            // أعد التوجيه إلى صفحة الشكر
            window.location.href = 'thank.html';
        }
    });
});
