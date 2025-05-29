import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  // TODO: Fetch user settings data
  return (
    <div className="flex flex-col gap-6" data-oid="0zs1-c9">
      <h2 className="text-2xl font-bold tracking-tight" data-oid="5t9h787">
        Settings
      </h2>
      <Card data-oid="j6b8484">
        <CardHeader data-oid="4o4yzhg">
          <CardTitle data-oid="b7k.xk0">Profile Information</CardTitle>
          <CardDescription data-oid="voy4-ut">
            Update your personal details and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="gy9twjs">
          {/* TODO: Add form fields for profile settings (name, email, password change, profile picture, skills, categories etc.) */}
          <p className="text-sm text-muted-foreground" data-oid="3.60ndp">
            Profile settings form goes here.
          </p>
          <Button data-oid="c4ztt3w">Save Changes</Button>
        </CardContent>
      </Card>
      <Card data-oid="zbnzjlg">
        <CardHeader data-oid="fdjki9:">
          <CardTitle data-oid="f0r1whh">Notification Settings</CardTitle>
          <CardDescription data-oid="t1nk708">
            Manage how you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="9-9gxhx">
          {/* TODO: Add controls for notification preferences */}
          <p className="text-sm text-muted-foreground" data-oid="w_:93av">
            Notification settings form goes here.
          </p>
          <Button data-oid="qdc6gf.">Save Changes</Button>
        </CardContent>
      </Card>
      {/* Add more settings cards as needed (e.g., Security, Payment Methods) */}
    </div>
  );
}
