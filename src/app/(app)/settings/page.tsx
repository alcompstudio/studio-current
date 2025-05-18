import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    // TODO: Fetch user settings data
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     {/* TODO: Add form fields for profile settings (name, email, password change, profile picture, skills, categories etc.) */}
                     <p className="text-sm text-muted-foreground">Profile settings form goes here.</p>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Manage how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* TODO: Add controls for notification preferences */}
                    <p className="text-sm text-muted-foreground">Notification settings form goes here.</p>
                     <Button>Save Changes</Button>
                </CardContent>
            </Card>
             {/* Add more settings cards as needed (e.g., Security, Payment Methods) */}
        </div>
    );
}
