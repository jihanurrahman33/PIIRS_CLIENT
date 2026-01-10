import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAxios from "../../hooks/useAxios";
import { FcGoogle } from "react-icons/fc";

const GoogleLogin = () => {
  const { signInGoogle } = useAuth();
  const {
    formState: { isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosInstance = useAxios();
  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignIn = async () => {
    try {
      const res = await signInGoogle();
      const firebaseUser = res.user;

      if (!firebaseUser) throw new Error("No firebase user returned");

      const idToken = await firebaseUser.getIdToken(true);

      const payload = {
        name: firebaseUser.displayName || "",
        email: firebaseUser.email || "",
        photoURL: firebaseUser.photoURL || "",
      };

      await axiosInstance.post("/users", payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      navigate(from, { replace: true });
    } catch (err) {
      console.error("Google sign-in / sync error:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isSubmitting}
      className="btn btn-outline border-slate-200 text-gray-700 hover:bg-slate-50 hover:border-slate-300 w-full h-12 normal-case font-medium text-base shadow-sm bg-white"
    >
      <FcGoogle className="text-xl mr-2" />
      Continue with Google
    </button>
  );
};

export default GoogleLogin;
