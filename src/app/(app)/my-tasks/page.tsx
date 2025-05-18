import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyTasksPage() {
    // TODO: Fetch assigned Work Assignments / Work Positions for the freelancer
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold tracking-tight">My Tasks</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Assigned Work</CardTitle>
                    <CardDescription>View and manage tasks assigned to you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="in-progress">
                        <TabsList className="mb-4">
                            <TabsTrigger value="new">New</TabsTrigger>
                            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                            <TabsTrigger value="in-review">In Review</TabsTrigger>
                            <TabsTrigger value="completed">Completed</TabsTrigger>
                        </TabsList>
                         <TabsContent value="new">
                            <p className="text-sm text-muted-foreground">No new tasks assigned.</p>
                            {/* TODO: List new Work Assignments/Positions */}
                        </TabsContent>
                        <TabsContent value="in-progress">
                            <p className="text-sm text-muted-foreground">No tasks currently in progress.</p>
                            {/* TODO: List Work Assignments/Positions in progress */}
                        </TabsContent>
                         <TabsContent value="in-review">
                            <p className="text-sm text-muted-foreground">No tasks awaiting review.</p>
                            {/* TODO: List Work Assignments/Positions in review */}
                        </TabsContent>
                        <TabsContent value="completed">
                            <p className="text-sm text-muted-foreground">No completed tasks found.</p>
                            {/* TODO: List completed Work Assignments/Positions */}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
