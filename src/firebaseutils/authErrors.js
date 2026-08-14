// authErrors.js - Firebase Auth friendly error message helper

export function getAuthErrorMessage(error) {
  if (!error) return "An unknown error occurred. Please try again.";

  const code = error.code || "";
  const currentDomain = typeof window !== "undefined" ? window.location.hostname : "your domain";

  switch (code) {
    case "auth/unauthorized-domain":
      return `Domain "${currentDomain}" is not authorized in Firebase. Please add "${currentDomain}" in Firebase Console -> Authentication -> Settings -> Authorized domains.`;
    case "auth/popup-blocked":
      return "The login popup was blocked by your browser. Please allow popups for this website and try again.";
    case "auth/popup-closed-by-user":
      return "Login popup was closed before completing sign in. Please try again.";
    case "auth/cancelled-popup-request":
      return "Previous login request was cancelled. Please try again.";
    case "auth/operation-not-allowed":
      return "Google Sign-In is not enabled in Firebase. Please enable Google provider under Firebase Authentication -> Sign-in method.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection and try again.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using a different sign-in method.";
    case "auth/user-disabled":
      return "This user account has been disabled.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    default:
      return error.message || "Authentication failed. Please try again.";
  }
}
