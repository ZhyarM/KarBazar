export interface privacySettingsProps {
  ProfileVisibility: "public" | "private" | "only Link";
  ActiveSessions: number;
  logoutFromAllDevices: string;
  WhoCanMessageMe: "everyone" | "no one" | "followers";
  DeleteAccount: string;
}

function PrivacySettings() {
  return (
    <>
      <div>
        <p>profile visibility</p>
        <p>active sessions</p>
        <p>logout from all devices</p>
        <p>who can message me</p>
        <p>change password</p>
        <p>who can see my files</p>
        <p>online status</p>
        <p>delete account</p>
      </div>
    </>
  );
}

export default PrivacySettings;
