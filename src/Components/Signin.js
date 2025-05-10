import { React, useState } from "react";
import "./signin.css";
import Logo from "../imgs/logo2.png";
import BG1 from "../imgs/login-BG.png";
import BG2 from "../imgs/login-BG2.png";
import google from "../imgs/google.png";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../Firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import swal from "sweetalert";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [PasswordError, setPasswordError] = useState("");
  const [bgLoaded, setBgLoaded] = useState(false);
  const navigate = useNavigate();

  document.title = "Amazon"

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUsernameBlur = (event) => {
    if (
      event.target.value === "" 
    ) {
      setUsernameError("Please enter a valid username address.");
    } else {
      setUsernameError("");
    }
  };

  const handlePasswordBlur = (event) => {
    if (event.target.value === "") {
      setPasswordError("Please enter your password.");
    } else if (event.target.value.length < 4) {
      setPasswordError("Password is too small.");
    } else {
      setPasswordError("");
    }
  };

  const LogInUser = async () => {

      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        swal({
          title: "Error!",
          text: data.msg,
          icon: "error",
          buttons: "Ok",
        });
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
          window.location.href = "/home";
      }
  };

  const GoogleAuth = async () => {
    swal({
      title: "Error!",
      text: "This feature is not available yet.",
      icon: "error",
      buttons: "Ok",
    });
  };

  const handleBgLoad = () => {
    setBgLoaded(true);
  };

  return (
    <>
      <div className="signin-page">
        <div className="login-navbar">
          <div className="main-logo">
            <img src={Logo} className="amazon-logo" />
          </div>
          <div className="signup">
            <Link to="/signup">
              <button className="signup-btn">Sign up</button>
            </Link>
          </div>
        </div>
        <div className="background">
          <img src={BG1} className="BG1" onLoad={handleBgLoad} />
          <img src={BG2} className="BG2" onLoad={handleBgLoad} />
        </div>
        {bgLoaded && (
          <div className="main-form">
            <div className="login-form">
              <div className="some-text">
                <p className="user">User Login</p>
                <p className="user-desc">
                  Hey, Enter your details to get sign in to your account
                </p>
              </div>
              <div className="user-details">
                <input
                  type="text"
                  placeholder="Enter Username"
                  className="email"
                  value={username}
                  onChange={handleUsernameChange}
                  onBlur={handleUsernameBlur}
                  required
                />
                {usernameError && (
                  <div className="error-message">{usernameError}</div>
                )}
                <input
                  type="password"
                  placeholder="Passcode"
                  className="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  required
                />
                {PasswordError && (
                  <div className="error-message">{PasswordError}</div>
                )}
                <button onClick={LogInUser} className="signin-btn">
                  Sign in
                </button>
                <div className="extra-buttons">
                  <p className="or">&#x2015; Or &#x2015;</p>
                  <button onClick={GoogleAuth} className="google">
                    <p>Sign in with</p>
                    <img src={google} className="google-img" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Signin;
