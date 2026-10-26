importScripts('https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.8.1/firebase-messaging.js');

// You MUST include your Firebase config here again
const firebaseConfig = {
    apiKey: "AIzaSyD-f_Hpa3pNoi1BYLOStxEH3ucaDgDmNKY",
    authDomain: "chakanjob-244cd.firebaseapp.com",
    projectId: "chakanjob-244cd",
    storageBucket: "chakanjob-244cd.firebasestorage.app",
    messagingSenderId: "277378493078",
    appId: "1:277378493078:web:a3b3de2a8949055ad4f0b7",
    measurementId: "G-KHLGRL2437"
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon || '/static/img2/logo3.jpeg' // Use a default icon
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});