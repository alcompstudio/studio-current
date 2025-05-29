import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyBidsPage() {
  // TODO: Fetch freelancer's bids
  return (
    <div className="flex flex-col gap-6" data-oid="t.xg5r1">
      <h2 className="text-2xl font-bold tracking-tight" data-oid="7cyck2y">
        My Bids
      </h2>
      <Card data-oid="1w34e-m">
        <CardHeader data-oid="4k599-:">
          <CardTitle data-oid="br6kbhj">Bid Management</CardTitle>
          <CardDescription data-oid="15i6vx:">
            Track the status of your submitted bids.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="1co29:5">
          <Tabs defaultValue="active" data-oid="_7lt8xd">
            <TabsList className="mb-4" data-oid="a4zn8re">
              <TabsTrigger value="active" data-oid="r2cxns5">
                Active
              </TabsTrigger>
              <TabsTrigger value="approved" data-oid="wtk19yg">
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" data-oid="xxplc3s">
                Rejected
              </TabsTrigger>
              <TabsTrigger value="withdrawn" data-oid="p.z-931">
                Withdrawn
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active" data-oid="3z8vrwj">
              <p className="text-sm text-muted-foreground" data-oid="xv9ocpt">
                No active bids found.
              </p>
              {/* TODO: List active bids */}
            </TabsContent>
            <TabsContent value="approved" data-oid="zv9n14y">
              <p className="text-sm text-muted-foreground" data-oid="expd47e">
                No approved bids found.
              </p>
              {/* TODO: List approved bids */}
            </TabsContent>
            <TabsContent value="rejected" data-oid="k:k22t4">
              <p className="text-sm text-muted-foreground" data-oid="-qtx9kk">
                No rejected bids found.
              </p>
              {/* TODO: List rejected bids */}
            </TabsContent>
            <TabsContent value="withdrawn" data-oid="wm8_p6e">
              <p className="text-sm text-muted-foreground" data-oid="wrhfthl">
                No withdrawn bids found.
              </p>
              {/* TODO: List withdrawn bids */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
