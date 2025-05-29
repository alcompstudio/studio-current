import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, PlusCircle, Search } from "lucide-react";

export default function ManageUsersPage() {
  // TODO: Add role check (Admin/Moderator only)
  // TODO: Fetch user list
  return (
    <div className="flex flex-col gap-6" data-oid="ze-e4on">
      <div className="flex items-center justify-between" data-oid="fq2mht1">
        <h2 className="text-2xl font-bold tracking-tight" data-oid="6.t3i:6">
          Manage Users
        </h2>
        <Button data-oid="_v.u8oc">
          <PlusCircle className="mr-2 h-4 w-4" data-oid="76l_pqd" /> Add User
          (Manual?)
        </Button>
      </div>

      <Card data-oid="64lzgnl">
        <CardHeader data-oid="d:42:h8">
          <CardTitle data-oid=":0uzezm">User List</CardTitle>
          <CardDescription data-oid="_0xm3by">
            View, manage, and moderate platform users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="uv.j8mz">
          <div className="flex flex-col md:flex-row gap-4" data-oid="yy0s9-b">
            <div className="relative flex-1" data-oid="9argu6r">
              <Search
                className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                data-oid="p_vr40n"
              />

              <Input
                placeholder="Search by email or name..."
                className="pl-8"
                data-oid="pumojl9"
              />
            </div>
            <Button variant="outline" data-oid="_ab.z.4">
              <Filter className="mr-2 h-4 w-4" data-oid="vkuk4br" /> Filter by
              Role
            </Button>
            <Button data-oid="u9bocwd">Search</Button>
          </div>
          <div data-oid="93loseq">
            <p className="text-sm text-muted-foreground" data-oid="hg0rty3">
              No users found.
            </p>
            {/* TODO: Implement user table with actions (edit role, suspend, view details) */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
