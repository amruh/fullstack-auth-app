import { fetchUserInfo } from "@/data/user";
import UserProfileCard from "./user-profile-card";

export default async function ProfilePage() {
  const userInfo = await fetchUserInfo();

  return (
    <div className="space-y-3">
      <h1 className="font-bold">Profile</h1>
      <UserProfileCard userInfo={userInfo} />
    </div>
  );
}
