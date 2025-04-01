import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

/**
 * VerifyEmail screen:
 * Extracts the token from the URL, calls the backend to verify the email,
 * and navigates to the login screen.
 */
const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/verify-email?token=${token}`
      )
        .then((response) => {
          if (response.ok) {
            navigate("/login");
          } else {
            console.error("Email verification failed.");
          }
        })
        .catch((err) => {
          console.error("Verification error:", err);
        });
    }
  }, [token, navigate]);

  return (
    <div className="screen-container centered">
      <h2>Verifying your email...</h2>
      <p>Please wait while we verify your email address.</p>
    </div>
  );
};

export default VerifyEmail;
