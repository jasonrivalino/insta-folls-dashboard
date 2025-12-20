// NotFoundPage.tsx
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br from-blue-400 via-blue-500 to-blue-700 text-white px-4">      
        <div className="text-center">
            <h1 className="text-8xl font-extrabold mb-4 animate-pulse">404</h1>
            <p className="text-3xl mb-6">Oops! Page Not Found</p>
            <p className="mb-8 text-lg max-w-md mx-auto">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <button
                onClick={() => navigate(-1)}
                className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
            >
                Go Back
            </button>
        </div>
    </div>
  );
}