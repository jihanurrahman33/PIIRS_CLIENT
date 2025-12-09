import { Link } from "react-router";
import { FaLock } from "react-icons/fa";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4">
      <div className="text-center">
        <FaLock className="text-6xl text-error mx-auto mb-4" />

        <h1 className="text-5xl font-bold text-error">403</h1>
        <h2 className="text-2xl font-semibold mt-2">Access Forbidden</h2>

        <p className="mt-4 text-base-content/70 max-w-md mx-auto">
          You don't have permission to access this page. Please contact an
          administrator if you think this is a mistake.
        </p>

        <Link to="/" className="btn btn-primary mt-6">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
