import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";

export default function FindOrdersPage() {
  // TODO: Fetch available orders based on filters/search
  return (
    <div className="flex flex-col gap-6" data-oid="typoxih">
      <h2 className="text-2xl font-bold tracking-tight" data-oid="z3aevpn">
        Find Orders
      </h2>

      <Card data-oid="8kjbov9">
        <CardHeader data-oid="wm_l78-">
          <CardTitle data-oid="ua4w4wo">Search & Filter</CardTitle>
          <CardDescription data-oid=".s2vuf7">
            Find orders matching your skills and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent
          className="flex flex-col md:flex-row gap-4"
          data-oid="tdnj1nx"
        >
          <div className="relative flex-1" data-oid="tio96o-">
            <Search
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
              data-oid="n9e9zts"
            />

            <Input
              placeholder="Search by keywords..."
              className="pl-8"
              data-oid="4x6fr_b"
            />
          </div>
          {/* TODO: Add filter components (category, budget range, etc.) */}
          <Button variant="outline" data-oid="nnuio79">
            <Filter className="mr-2 h-4 w-4" data-oid="lm1d8cf" /> More Filters
          </Button>
          <Button data-oid=".360oi:">Search</Button>
        </CardContent>
      </Card>

      <Card data-oid="-kfdsmz">
        <CardHeader data-oid="secsacn">
          <CardTitle data-oid="vugg7em">Available Orders</CardTitle>
        </CardHeader>
        <CardContent data-oid="l6axx3a">
          <p className="text-sm text-muted-foreground" data-oid="shq.k4u">
            No matching orders found.
          </p>
          {/* TODO: Implement order listing for freelancers to bid on */}
          {/* Example Order Card Structure:
              <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Website Redesign</CardTitle>
                    <CardDescription>Posted by Client Inc. - Budget: $500 - $1000</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm mb-4">Looking for a modern redesign of our company website...</p>
                     <div className="flex justify-between items-center">
                         <span className="text-xs text-muted-foreground">Posted 2 days ago</span>
                         <Button size="sm">View Details & Bid</Button>
                     </div>
                </CardContent>
              </Card>
              */}
        </CardContent>
      </Card>
    </div>
  );
}
