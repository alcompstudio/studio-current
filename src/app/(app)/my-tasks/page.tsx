import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyTasksPage() {
  // TODO: Fetch assigned Work Assignments / Work Positions for the freelancer
  return (
    <div className="flex flex-col gap-6" data-oid=".knpksn">
      <h2 className="text-2xl font-bold tracking-tight" data-oid="y8s-gom">
        My Tasks
      </h2>
      <Card data-oid="o7laxt2">
        <CardHeader data-oid="toe.5l2">
          <CardTitle data-oid="9psx28y">Assigned Work</CardTitle>
          <CardDescription data-oid="v:nv2se">
            View and manage tasks assigned to you.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="0ue7_80">
          <Tabs defaultValue="in-progress" data-oid="u3.ha4p">
            <TabsList className="mb-4" data-oid="c:q2pj_">
              <TabsTrigger value="new" data-oid="ebjaihn">
                New
              </TabsTrigger>
              <TabsTrigger value="in-progress" data-oid="4r33d5p">
                In Progress
              </TabsTrigger>
              <TabsTrigger value="in-review" data-oid="zoinuu3">
                In Review
              </TabsTrigger>
              <TabsTrigger value="completed" data-oid="ctt2d94">
                Completed
              </TabsTrigger>
            </TabsList>
            <TabsContent value="new" data-oid="r:lcnci">
              <p className="text-sm text-muted-foreground" data-oid="u7:t.36">
                No new tasks assigned.
              </p>
              {/* TODO: List new Work Assignments/Positions */}
            </TabsContent>
            <TabsContent value="in-progress" data-oid="oohr0-y">
              <p className="text-sm text-muted-foreground" data-oid="f0x8egv">
                No tasks currently in progress.
              </p>
              {/* TODO: List Work Assignments/Positions in progress */}
            </TabsContent>
            <TabsContent value="in-review" data-oid="johymgv">
              <p className="text-sm text-muted-foreground" data-oid="el40f1y">
                No tasks awaiting review.
              </p>
              {/* TODO: List Work Assignments/Positions in review */}
            </TabsContent>
            <TabsContent value="completed" data-oid="k2bn-gg">
              <p className="text-sm text-muted-foreground" data-oid="vw6:qpf">
                No completed tasks found.
              </p>
              {/* TODO: List completed Work Assignments/Positions */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
