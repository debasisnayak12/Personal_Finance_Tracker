import React, { useState } from "react";
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import { auth, db, provider } from "../../firebase";
import { toast } from "react-toastify";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SignupSignin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function signupWithEmail() {
    setLoading(true);
    // Authenticate the user, or basically create a new account using email and pass
    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword !== ""
    ) {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            // console.log("User>>>", user);
            toast.success("User Created!");
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            // Create a doc with user id as the following id
            createDoc(user);
            navigate("/Dashboard");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.error("Password and Confirm Password don't match!");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  function loginUsingEmail() {
    setLoading(true);
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User Login Successfull!");
          setLoading(false);
          navigate("/Dashboard");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    // Make sure that the user id doesn't exist
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc created");
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } else {
      // toast.error("Doc already exists");
      setLoading(false);
    }
  }

  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // console.log(user);
        createDoc(user);
        setLoading(false);
        toast.success("User Authenticate!");
        navigate("/Dashboard");
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false);
      });
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
    
  }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <p className="title">
            Login on <span style={{ color: "var(--theme)" }}>Financly.</span>
          </p>
          <Input
            type="email"
            label={"Email"}
            state={email}
            setState={setEmail}
            placeholder={"JohnDoe@gmail.com"}
          />
          <Input
            type="password"
            label={"Password"}
            state={password}
            setState={setPassword}
            placeholder={"Password"}
          />
          <Button
            disabled={loading}
            text={loading ? "Loading..." : "Login Using Email and Password"}
            onClick={loginUsingEmail}
          />
          <p style={{ textAlign: "center" }}>or</p>
          <Button
            onClick={googleAuth}
            disabled={loading}
            text={loading ? "Loading..." : "Login Using Google"}
            blue={true}
          />
          <p className="login-side">
            Don't Have an Account ?{" "}
            <span
              style={{ color: "var(--theme)", cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Click here
            </span>
          </p>
        </div>
      ) : (
        <div className="signup-wrapper">
          <p className="title">
            Sign Up on <span style={{ color: "var(--theme)" }}>Financly.</span>
          </p>
          <Input
            label={"Full Name"}
            state={name}
            setState={setName}
            placeholder={"John Doe"}
          />
          <Input
            type="email"
            label={"Email"}
            state={email}
            setState={setEmail}
            placeholder={"JohnDoe@gmail.com"}
          />
          <Input
            type="password"
            label={"Password"}
            state={password}
            setState={setPassword}
            placeholder={"Password"}
          />
          <Input
            type="password"
            label={"Confirm Password"}
            state={confirmPassword}
            setState={setConfirmPassword}
            placeholder={"Confirm Password"}
          />
          <Button
            disabled={loading}
            text={loading ? "Loading..." : "Signup Using Email and Password"}
            onClick={signupWithEmail}
          />
          <p style={{ textAlign: "center" }}>or</p>
          <Button
            onClick={googleAuth}
            disabled={loading}
            text={loading ? "Loading..." : "Signup Using Google"}
            blue={true}
          />
          <p className="login-side">
            Already have an Account ?{" "}
            <span
              style={{ color: "var(--theme)", cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Click here
            </span>
          </p>
        </div>
      )}
    </>
  );
};

export default SignupSignin;
