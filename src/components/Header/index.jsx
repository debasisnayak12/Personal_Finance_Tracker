import React, { useEffect } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/Dashboard");
    }
  }, [user, loading]);

  function logoutFunc() {
    try {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          toast.success("Logged Out Successfully!");
          navigate("/");
        })
        .catch((error) => {
          // An error happened.
          toast.error(error.message);
        });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="navbar">
      <p className="logo">Financly.</p>
      {user && (
        <div className="log-section">
          {user.photoURL ? (
            <img src={user.photoURL} className="logo-img" />
          ) : (
            <span class="material-icons default-acc">account_circle</span>
          )}
          <p className="logo link" onClick={logoutFunc}>
            Logout
          </p>
          <span className="material-icons icon" onClick={logoutFunc}>logout</span>
        </div>
      )}
    </div>
  );
}

export default Header;
