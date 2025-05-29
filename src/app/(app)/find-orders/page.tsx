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
    <div className="flex flex-col gap-6" data-oid="hg7.r4y">
      <h2 className="text-2xl font-bold tracking-tight" data-oid="y4hag:1">
        Find Orders
      </h2>

      <Card data-oid="c2qstse">
        <CardHeader data-oid="ayygdte">
          <CardTitle data-oid="dujkxrn">Search & Filter</CardTitle>
          <CardDescription data-oid="z9:_f.2">
            Find orders matching your skills and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent
          className="flex flex-col md:flex-row gap-4"
          data-oid="_ztqnyv"
        >
          <div className="relative flex-1" data-oid="8v3udc0">
            <Search
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
              data-oid="uwg6g6c"
            />

            <Input
              placeholder="Search by keywords..."
              className="pl-8"
              data-oid=":5frsm0"
            />
          </div>
          {/* TODO: Add filter components (category, budget range, etc.) */}
          <Button variant="outline" data-oid="qqvs52t">
            <Filter className="mr-2 h-4 w-4" data-oid="u4t8eqz" /> More Filters
          </Button>
          <Button data-oid="m_kr3e2">Search</Button>
        </CardContent>
      </Card>

      <Card data-oid="ex1t6lo">
        <CardHeader data-oid="5sxb8v3">
          <CardTitle data-oid="90g6vz0">Available Orders</CardTitle>
        </CardHeader>
        <CardContent data-oid="i-n0z38">
          <p className="text-sm text-muted-foreground" data-oid="e54uc:b">
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
