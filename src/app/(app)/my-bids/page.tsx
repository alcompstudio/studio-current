import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyBidsPage() {
    // TODO: Fetch freelancer's bids
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold tracking-tight">My Bids</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Bid Management</CardTitle>
                    <CardDescription>Track the status of your submitted bids.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="active">
                        <TabsList className="mb-4">
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="approved">Approved</TabsTrigger>
                            <TabsTrigger value="rejected">Rejected</TabsTrigger>
                            <TabsTrigger value="withdrawn">Withdrawn</TabsTrigger>
                        </TabsList>
                        <TabsContent value="active">
                            <p className="text-sm text-muted-foreground">No active bids found.</p>
                            {/* TODO: List active bids */}
                        </TabsContent>
                         <TabsContent value="approved">
                            <p className="text-sm text-muted-foreground">No approved bids found.</p>
                            {/* TODO: List approved bids */}
                        </TabsContent>
                         <TabsContent value="rejected">
                            <p className="text-sm text-muted-foreground">No rejected bids found.</p>
                            {/* TODO: List rejected bids */}
                        </TabsContent>
                        <TabsContent value="withdrawn">
                            <p className="text-sm text-muted-foreground">No withdrawn bids found.</p>
                            {/* TODO: List withdrawn bids */}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
