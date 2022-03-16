import { useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/authContext";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const enteredNewPasswordRef = useRef();

  const submitHandler = async (event) => {
    event.preventDefault();

    const newPassword = enteredNewPasswordRef.current.value;

    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAjtgVvO_gOZFZMVaTXOair9P_IZdTAohU",
        {
          method: "POST",
          body: JSON.stringify({
            idToken: authCtx.token,
            password: newPassword,
            returnSecureToken: false
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
  
      if (response.ok) {
        console.log("Change password request was successful!");
        history.replace("/");
      } else {
        throw new Error("Change password request unsuccessful!");
      }
      
    } catch (error) {
      alert(error.message);
    }

  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={enteredNewPasswordRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
