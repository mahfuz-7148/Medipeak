import { Link } from 'react-router';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-6 py-12">
            <div className="max-w-lg text-center">
                <div className="relative inline-block">
                    <svg
                        className="w-40 h-40 text-red-600 dark:text-red-500 drop-shadow-lg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <div className="absolute -top-3 -right-3 bg-white dark:bg-gray-900 rounded-full p-2 shadow-lg animate-pulse">
                        <svg
                            className="w-7 h-7 text-green-600 dark:text-green-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-5xl font-extrabold mt-8 text-gray-900 dark:text-gray-100 tracking-wide drop-shadow-md">
                    404 - Recipe Not Found!
                </h1>

                <p className="mt-4 text-lg font-medium text-yellow-700 dark:text-yellow-300">
                    Oops! It seems this dish got lost in the kitchen.
                </p>

                <Link
                    to="/"
                    className="mt-8 inline-block px-8 py-3 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-semibold text-lg transition-transform transform hover:scale-105 hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg"
                >
                    Back to Menu
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
