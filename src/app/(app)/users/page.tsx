import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, PlusCircle, Search } from "lucide-react";

export default function ManageUsersPage() {
    // TODO: Add role check (Admin/Moderator only)
    // TODO: Fetch user list
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Manage Users</h2>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add User (Manual?)
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User List</CardTitle>
                    <CardDescription>View, manage, and moderate platform users.</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                     <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search by email or name..." className="pl-8" />
                        </div>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" /> Filter by Role
                        </Button>
                         <Button>Search</Button>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">No users found.</p>
                         {/* TODO: Implement user table with actions (edit role, suspend, view details) */}
                     </div>
                 </CardContent>
            </Card>
        </div>
    );
}
