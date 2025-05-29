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
    <div className="flex flex-col gap-6" data-oid="7ncpfvv">
      <h2 className="text-2xl font-bold tracking-tight" data-oid="_rkz8jm">
        My Tasks
      </h2>
      <Card data-oid="ids65mv">
        <CardHeader data-oid="lvy94mr">
          <CardTitle data-oid="64_8e4x">Assigned Work</CardTitle>
          <CardDescription data-oid="q9u8asy">
            View and manage tasks assigned to you.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="tezb2p9">
          <Tabs defaultValue="in-progress" data-oid="e_zuliu">
            <TabsList className="mb-4" data-oid="reayljl">
              <TabsTrigger value="new" data-oid="lfj8dzh">
                New
              </TabsTrigger>
              <TabsTrigger value="in-progress" data-oid="lqe-d6u">
                In Progress
              </TabsTrigger>
              <TabsTrigger value="in-review" data-oid="ke1955t">
                In Review
              </TabsTrigger>
              <TabsTrigger value="completed" data-oid="dc.l3zk">
                Completed
              </TabsTrigger>
            </TabsList>
            <TabsContent value="new" data-oid="eiuxnf.">
              <p className="text-sm text-muted-foreground" data-oid="qf.:7fr">
                No new tasks assigned.
              </p>
              {/* TODO: List new Work Assignments/Positions */}
            </TabsContent>
            <TabsContent value="in-progress" data-oid="e.g0tj4">
              <p className="text-sm text-muted-foreground" data-oid="fsnc5oh">
                No tasks currently in progress.
              </p>
              {/* TODO: List Work Assignments/Positions in progress */}
            </TabsContent>
            <TabsContent value="in-review" data-oid="6cnxsjn">
              <p className="text-sm text-muted-foreground" data-oid="vqc8n-.">
                No tasks awaiting review.
              </p>
              {/* TODO: List Work Assignments/Positions in review */}
            </TabsContent>
            <TabsContent value="completed" data-oid="yi2u.x9">
              <p className="text-sm text-muted-foreground" data-oid="rhn-fci">
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
