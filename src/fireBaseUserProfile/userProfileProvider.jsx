
import useUserProfile from "./UseUserProfile";

export default function UserProfilePage() {
  const { userProfile, loading, error } = useUserProfile();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>User Profile</h1>
      <img
        src={userProfile.profileImageUrl || "/assets/profile.jpg"}
        alt="Profile"
        width={100}
        height={100}
      />
      <p>Name: {userProfile.name}</p>
      <p>Signup Completed: {userProfile.signupCompleted ? "Yes" : "No"}</p>
      <p>Profile Completed: {userProfile.profileCompleted ? "Yes" : "No"}</p>
      <p>Service Created: {userProfile.serviceCreated ? "Yes" : "No"}</p>
    </div>
  );
}
