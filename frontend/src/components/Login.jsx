import React, { useState } from "react";

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const loginTime = new Date(); // capture current time
        onLogin({ username, email, loginTime, date }); // pass loginTime
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-200 p-4">
            {/* Small dialog box */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm space-y-6"
            >
                <h1 className="text-2xl font-bold text-center text-purple-700">
                    ASL Teacher
                </h1>
                <h2 className="text-xl font-semibold text-center text-gray-800">
                    Login
                </h2>

                {/* Username */}
                <div className="flex flex-col">
                    <label className="mb-1 text-gray-700 font-medium">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        required
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="mb-1 text-gray-700 font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        required
                    />
                </div>

                {/* Date Picker */}
                <div className="flex flex-col">
                    <label className="mb-1 text-gray-700 font-medium">Select Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        required
                    />
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
