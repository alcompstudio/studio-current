import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Download, Upload } from "lucide-react";

export default function FinancePage() {
    // TODO: Fetch financial data (balance, transactions, invoices)
    const currentBalance = 1250.75;
    const currency = "USD";

    return (
        <div className="flex flex-col gap-6">
             <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-bold tracking-tight">Finance Overview</h2>
                 <div className="flex gap-2">
                    {/* Add role specific actions if needed */}
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Export Statement
                    </Button>
                 </div>
             </div>

             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{currency} {currentBalance.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Your available internal balance</p>
                    <div className="flex gap-2 mt-4">
                       <Button size="sm">
                            <Upload className="mr-2 h-4 w-4"/> Request Payout
                       </Button>
                        {/* Add Deposit button for Clients? Or handled by Admin? */}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Recent financial activities on your account.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-sm text-muted-foreground">No transactions yet.</p>
                     {/* TODO: Implement transaction history table */}
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>Manage your incoming and outgoing invoices.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-sm text-muted-foreground">No invoices found.</p>
                    {/* TODO: Implement invoice listing (pending, paid, overdue) */}
                </CardContent>
            </Card>
        </div>
    );
}
