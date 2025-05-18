import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Download, Upload } from "lucide-react";

export default function FinancePage() {
  // TODO: Fetch financial data (balance, transactions, invoices)
  const currentBalance = 1250.75;
  const currency = "USD";

  return (
    <div className="flex flex-col gap-6" data-oid="p68mhsl">
      <div className="flex items-center justify-between" data-oid="ipz6_nq">
        <h2 className="text-2xl font-bold tracking-tight" data-oid="gan13nr">
          Finance Overview
        </h2>
        <div className="flex gap-2" data-oid="c8tt4bx">
          {/* Add role specific actions if needed */}
          <Button variant="outline" data-oid="_a5r2gg">
            <Download className="mr-2 h-4 w-4" data-oid="_g:x0l1" /> Export
            Statement
          </Button>
        </div>
      </div>

      <Card data-oid="s6i76f7">
        <CardHeader
          className="flex flex-row items-center justify-between space-y-0 pb-2"
          data-oid="kbvr_2q"
        >
          <CardTitle className="text-sm font-medium" data-oid="ysx5_8k">
            Current Balance
          </CardTitle>
          <DollarSign
            className="h-4 w-4 text-muted-foreground"
            data-oid="jv2gy4m"
          />
        </CardHeader>
        <CardContent data-oid="66eeqi5">
          <div className="text-2xl font-bold" data-oid="6:8.-mt">
            {currency} {currentBalance.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground" data-oid="iej2:w4">
            Your available internal balance
          </p>
          <div className="flex gap-2 mt-4" data-oid="qz0cnse">
            <Button size="sm" data-oid="zzp0tx5">
              <Upload className="mr-2 h-4 w-4" data-oid="qtoi1:t" /> Request
              Payout
            </Button>
            {/* Add Deposit button for Clients? Or handled by Admin? */}
          </div>
        </CardContent>
      </Card>

      <Card data-oid="i4_0ycq">
        <CardHeader data-oid="bpaut09">
          <CardTitle data-oid="y7qr0s3">Transaction History</CardTitle>
          <CardDescription data-oid="1015-0m">
            Recent financial activities on your account.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="6nm7d..">
          <p className="text-sm text-muted-foreground" data-oid="2h8-tdv">
            No transactions yet.
          </p>
          {/* TODO: Implement transaction history table */}
        </CardContent>
      </Card>

      <Card data-oid="8yz8:s5">
        <CardHeader data-oid="aaj3.gy">
          <CardTitle data-oid="0u2widx">Invoices</CardTitle>
          <CardDescription data-oid="o.de5fq">
            Manage your incoming and outgoing invoices.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="34s_:66">
          <p className="text-sm text-muted-foreground" data-oid="b8brho.">
            No invoices found.
          </p>
          {/* TODO: Implement invoice listing (pending, paid, overdue) */}
        </CardContent>
      </Card>
    </div>
  );
}
