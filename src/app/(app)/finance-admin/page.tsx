import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Settings, FileText, PlusCircle } from "lucide-react";

export default function PlatformFinancePage() {
     // TODO: Add role check (Admin only)
    // TODO: Fetch platform financial overview, transactions, currency rates
    return (
        <div className="flex flex-col gap-6">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Platform Finance</h2>
                 <div className="flex gap-2">
                     <Button variant="outline">
                        <Settings className="mr-2 h-4 w-4" /> Currency Rates
                    </Button>
                     <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Manual Transaction
                    </Button>
                 </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Platform Balance (USD)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$15,234.56</div>
                        <p className="text-xs text-muted-foreground">Aggregated balance across user types</p>
                    </CardContent>
                </Card>
                {/* Add more overview cards if needed (e.g., Pending Payouts) */}
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>Manual Transactions Log</CardTitle>
                    <CardDescription>Record of manual balance adjustments by administrators.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-sm text-muted-foreground">No manual transactions recorded yet.</p>
                    {/* TODO: Implement transaction log table */}
                </CardContent>
            </Card>

              <Card>
                <CardHeader>
                    <CardTitle>Platform Fees & Revenue (Conceptual)</CardTitle>
                    <CardDescription>Overview of potential revenue streams.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-sm text-muted-foreground">Fee structure and reporting to be implemented.</p>
                    {/* TODO: Implement fee settings and revenue reports */}
                </CardContent>
            </Card>

        </div>
    );
}
