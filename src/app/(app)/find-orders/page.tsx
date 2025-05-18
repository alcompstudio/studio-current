import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";

export default function FindOrdersPage() {
    // TODO: Fetch available orders based on filters/search
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold tracking-tight">Find Orders</h2>

             <Card>
                <CardHeader>
                    <CardTitle>Search & Filter</CardTitle>
                    <CardDescription>Find orders matching your skills and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                     <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by keywords..." className="pl-8" />
                    </div>
                    {/* TODO: Add filter components (category, budget range, etc.) */}
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> More Filters
                    </Button>
                     <Button>Search</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Available Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No matching orders found.</p>
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
