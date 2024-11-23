/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        firebase_apiKey: process.env.firebase_apiKey,
        firebase_authDomain: process.env.firebase_authDomain,
        firebase_databaseURL: process.env.firebase_databaseURL,
        firebase_projectId: process.env.firebase_projectId,
        firebase_storageBucket: process.env.firebase_storageBucket,
        firebase_messagingSenderId: process.env.firebase_messagingSenderId,
        firebase_appId: process.env.firebase_appId,
        firebase_measurementId: process.env.firebase_measurementId,
    }
};

export default nextConfig;
