import React, { useState } from "react";
import { auth, db } from "../firbase/Firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
} from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import google from "../assets/Google.png";
import facebook from "../assets/facebook.png";
import backarrow from "../assets/backarrow.png";
// import visible from "../assets/visible.png";
import hide  from"../assets/hide.png"
import visible  from "../assets/visible.png";
  ;

const Signup = () => {
  const navigate = useNavigate();

  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role] = useState("freelancer");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showMsg = (msg) => alert(msg);

  // EMAIL SIGNUP
  const handleSignup = async () => {

    if (!agreed) {
      return showMsg("Please accept Terms & Privacy Policy");
    }

    if (!first_name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      return showMsg("Please fill all fields");
    }

    if (password !== confirmPassword) {
      return showMsg("Passwords do not match");
    }

    try {
      setLoading(true);

      const encodedPassword = btoa(password);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

await setDoc(
  doc(db, "users", user.uid),
  {
    uid: user.uid,
    email,
    first_name: first_name,
    last_name: last_name,
    authProvider: "password",
    role: "freelancer",
    createdAt: new Date(),
  },
  { merge: true } // optional
);

      await axios.post("https://huzzler.onrender.com/api/auth/send-otp", {
        email: email.toLowerCase(),
      });

      localStorage.setItem(
        "freelancerOtpUser",
        JSON.stringify({
          uid: user.uid,
          email,
          first_name,
          last_name,
          password: encodedPassword,
          role: "freelancer",
        })
      );

      navigate("/freelancer-otp", {
        state: {
          uid: user.uid,
          email,
          first_name,
          last_name,
          password: encodedPassword,
          role: "freelancer",
        },
      });

    } catch (err) {
      showMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE SIGNUP
  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setEmail(user.email);
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        showMsg("Account already exists. Please login instead.");
        return navigate("/firelogin");
      }

      const fullName = user.displayName || "";
      const [first_name = "", last_name = ""] = fullName.split(" ");

      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || "",
        first_name,
        last_name,
        provider: "google",
        role: "freelancer",
        profileCompleted: false,
        createdAt: Date.now(),
      });

      navigate("/freelancer-details", { state: { uid: user.uid, email: user.email, first_name, last_name } });

    } catch (err) {
      showMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // GITHUB SIGNUP
  const handleGithubAuth = async () => {
    try {
      setLoading(true);
      const provider = new GithubAuthProvider();
      provider.addScope("user:email");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const fullName = user.displayName || "";
        const [first_name = "", last_name = ""] = fullName.split(" ");

        await setDoc(userRef, {
          uid: user.uid,
          email: user.email || "",
          first_name,
          last_name,
          role: "freelancer",
          provider: "github",
          profileCompleted: false,
          createdAt: Date.now(),
        });

        return navigate("/freelancer-details", {
          state: { uid: user.uid, email: user.email, first_name, last_name },
        });
      }

      const userData = userSnap.data();
      const role = (userData.role || "").toLowerCase();

      if (role === "client") {
        navigate("/client-dashbroad2", { state: { uid: user.uid } });
      } else {
        navigate("/freelance-dashboard", { state: { uid: user.uid } });
      }

    } catch (err) {
      if (err.code === "auth/account-exists-with-different-credential") {
        try {
          const pendingCred = GithubAuthProvider.credentialFromError(err);
          const email = err.customData?.email;
          if (!email) throw new Error("No email found for linking");

          showMsg("Linking your GitHub account... Please confirm your Google login.", false);
          
          const googleProvider = new GoogleAuthProvider();
          googleProvider.setCustomParameters({ login_hint: email });
          const result = await signInWithPopup(auth, googleProvider);
          await linkWithCredential(result.user, pendingCred);

          const userRef = doc(db, "users", result.user.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            const fullName = result.user.displayName || "";
            const [first_name = "", last_name = ""] = fullName.split(" ");

            await setDoc(userRef, {
              uid: result.user.uid,
              email: result.user.email || "",
              first_name,
              last_name,
              role: "freelancer",
              provider: "github",
              profileCompleted: false,
              createdAt: Date.now(),
            });

            return navigate("/freelancer-details", {
              state: { uid: result.user.uid, email: result.user.email, first_name, last_name },
            });
          }

          const userData = userSnap.data();
          const role = (userData.role || "").toLowerCase();

          if (role === "client") {
            navigate("/client-dashbroad2", { state: { uid: result.user.uid } });
          } else {
            navigate("/freelance-dashboard", { state: { uid: result.user.uid } });
          }
        } catch (linkErr) {
          console.error("Linking error: ", linkErr);
          showMsg("Could not link accounts. Please log in with Google directly.");
        }
      } else {
        console.error("GitHub auth error:", err);
        showMsg("GitHub login/signup failed: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at 0% 70%, #fff7c7 0, #fffdef 35%, #f5edff 65%, #f1eaff 100%)",
      fontFamily: "system-ui",
      padding: "10px"
    },
    cardWrapper: { maxWidth: 440, width: "100%", padding: "13px" },
    card: {
      width: "100%",
      borderRadius: 32,
      padding: "32px 40px 28px",
      background: "rgba(255,255,255,0.96)",
      boxShadow: "0 22px 55px rgba(15,23,42,0.18)",
      backdropFilter: "blur(18px)",
      paddingLeft: 22,
      paddingRight: 22
    },
    headerRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 24 },
    headerTitle: { fontSize: 14, fontWeight: 600, color: "#364153", textTransform: "lowercase" },
    subtitle: { fontSize: 15, color: "#000", marginBottom: 22 },
    formGroup: { display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 },
    input: {
      width: "100%",
      borderRadius: 999,
      padding: "12px 18px",
      border: "1px solid #e5e7eb",
      fontSize: 14,
      outline: "none",
      background: "#FFFFFFCC"
    },
    checkboxRow: { display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#6b7280", margin: "4px 0 18px" },
    checkbox: { width: 18, height: 18, borderRadius: 6, border: "2px solid #7C3CFF", cursor: "pointer" },
    link: { color: "#7C3CFF", fontWeight: 500, cursor: "pointer" },
    primaryButton: {
      width: "100%",
      borderRadius: 999,
      border: "none",
      padding: "12px 18px",
      fontSize: 14,
      fontWeight: 600,
      background: "#7C3CFF",
      color: "#fff",
      cursor: "pointer"
    },
    dividerRow: { display: "flex", alignItems: "center", gap: 12, margin: "18px 0 14px", fontSize: 12, color: "#9ca3af" },
    hr: { flex: 1, height: 1, background: "#e5e7eb" },
    socialRow: { display: "flex", justifyContent: "center", gap: 18 },
    socialBtn: {
      width: 52,
      height: 52,
      borderRadius: "999px",
      border: "none",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 12px 28px rgba(15,23,42,0.15)",
      cursor: "pointer"
    },
    socialImg: { width: 24, height: 24 },
    bottomTextWrapper: { textAlign: "center", marginTop: 20, fontSize: 13, color: "#4b5563" },
    loginHighlight: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#000",
      padding: "11px 22px",
      marginLeft: 14,
      borderRadius: 999,
      background: "#FDFD96",
      fontWeight: 670,
      cursor: "pointer",
      marginTop: "10px"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.cardWrapper}>

        <div style={styles.headerRow}>
          <div onClick={() => navigate(-1)}>
            <img src={backarrow} style={{ width: "18px", marginTop: "7px" }} alt="back" />
          </div>
          <span style={styles.headerTitle}>sign up as freelancer</span>
        </div>

        <div style={styles.card}>
          <p style={styles.subtitle}>Let's get to know you. We promise it'll be quick.</p>

          <div style={styles.formGroup}>
            <input style={styles.input} type="text" placeholder="First name" value={first_name} onChange={(e) => setfirst_name(e.target.value)} />
            <input style={styles.input} type="text" placeholder="Last name" value={last_name} onChange={(e) => setlast_name(e.target.value)} />
            <input style={styles.input} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
<div style={{ position: "relative" }}>
  <input
    style={styles.input}
    type={showPassword ? "text" : "password"}
    placeholder="Enter Your Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <img
    src={showPassword ? visible : hide}
    alt="toggle"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "18px",
      top: "37%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      width: "22px",
      height: "22px"
    }}
  />
</div>

<div style={{ position: "relative" }}>
  <input
    style={styles.input}
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
  />

  <img
    src={showConfirmPassword ?  visible : hide }
    alt="toggle"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
style={{
      position: "absolute",
      right: "18px",
      top: "37%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      width: "22px",
      height: "22px"
    }}
  />
</div>
          </div>

          <div style={styles.checkboxRow}>
            <input type="checkbox" style={styles.checkbox} checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>
              By signing up, you agree to our{" "}
              <span onClick={() => window.open("/termsofservice", "_blank")} style={styles.link}>Terms of service</span>
              {" "} & acknowledge our{" "}
              <span onClick={() => window.open("/privacypolicy", "_blank")} style={styles.link}>Privacy Policy</span>

            </span>
          </div>

          <button style={styles.primaryButton} onClick={handleSignup} disabled={loading || !agreed}>
            {loading ? "Creating..." : "CONTINUE"}
          </button>

          <div style={styles.dividerRow}>
            <div style={styles.hr} />
            <span>or Sign up with</span>
            <div style={styles.hr} />
          </div>

          <div style={styles.socialRow}>
            <button type="button" style={styles.socialBtn} onClick={handleGoogleRegister}>
              <img src={google} alt="google" style={styles.socialImg} />
            </button>

            <button type="button" style={styles.socialBtn} onClick={handleGithubAuth}>
              <img src={facebook} alt="github" style={styles.socialImg} />
            </button>
          </div>

        </div>

        <div style={styles.bottomTextWrapper}>
          Have an Account?
          <span style={styles.loginHighlight} onClick={() => navigate("/firelogin")}>
            log in :
          </span>
        </div>

      </div>
    </div>
  );
};

export default Signup;