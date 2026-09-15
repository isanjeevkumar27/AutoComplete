import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">

            <h1 className="text-5xl font-bold text-blue-600 mb-6">
                Autocomplete Search Engine
            </h1>

            <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
                Search faster with intelligent autocomplete,
                personalized suggestions, and "Did You Mean?" corrections.
            </p>

            <div className="flex gap-4">

                <Link to="/login">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                        Login
                    </button>
                </Link>

                <Link to="/register">
                    <button className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900">
                        Register
                    </button>
                </Link>

            </div>

        </div>
    );
}

export default Home;