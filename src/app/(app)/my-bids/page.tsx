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
    <div className="flex flex-col gap-6" data-oid="vnxql0s">
      <h2 className="text-2xl font-bold tracking-tight" data-oid="v9-dqjc">
        My Bids
      </h2>
      <Card data-oid="5kpof:5">
        <CardHeader data-oid="il_8gbl">
          <CardTitle data-oid="coxv-zd">Bid Management</CardTitle>
          <CardDescription data-oid="qwa.vj1">
            Track the status of your submitted bids.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="ovb2p6d">
          <Tabs defaultValue="active" data-oid="87d:6fd">
            <TabsList className="mb-4" data-oid="-c_sbzj">
              <TabsTrigger value="active" data-oid="pod4sud">
                Active
              </TabsTrigger>
              <TabsTrigger value="approved" data-oid="f.8t.ww">
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" data-oid="p:zuje2">
                Rejected
              </TabsTrigger>
              <TabsTrigger value="withdrawn" data-oid="533t7.j">
                Withdrawn
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active" data-oid="0__:.k7">
              <p className="text-sm text-muted-foreground" data-oid="x7lfuje">
                No active bids found.
              </p>
              {/* TODO: List active bids */}
            </TabsContent>
            <TabsContent value="approved" data-oid="6x9h.nu">
              <p className="text-sm text-muted-foreground" data-oid="--agf3m">
                No approved bids found.
              </p>
              {/* TODO: List approved bids */}
            </TabsContent>
            <TabsContent value="rejected" data-oid="z_0ncsv">
              <p className="text-sm text-muted-foreground" data-oid="to.7p:f">
                No rejected bids found.
              </p>
              {/* TODO: List rejected bids */}
            </TabsContent>
            <TabsContent value="withdrawn" data-oid="cyd9wbi">
              <p className="text-sm text-muted-foreground" data-oid="slxia-9">
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
