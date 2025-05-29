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
    <div className="flex flex-col gap-6" data-oid="746lyp1">
      <div className="flex items-center justify-between" data-oid="lgmb.2u">
        <h2 className="text-2xl font-bold tracking-tight" data-oid="mfvyd86">
          Finance Overview
        </h2>
        <div className="flex gap-2" data-oid="65z2k-0">
          {/* Add role specific actions if needed */}
          <Button variant="outline" data-oid="2gycg.8">
            <Download className="mr-2 h-4 w-4" data-oid="dxjjdl4" /> Export
            Statement
          </Button>
        </div>
      </div>

      <Card data-oid="-ef6.mi">
        <CardHeader
          className="flex flex-row items-center justify-between space-y-0 pb-2"
          data-oid="s.-xh9h"
        >
          <CardTitle className="text-sm font-medium" data-oid="8ewh738">
            Current Balance
          </CardTitle>
          <DollarSign
            className="h-4 w-4 text-muted-foreground"
            data-oid="eukcj8g"
          />
        </CardHeader>
        <CardContent data-oid="jt9brb6">
          <div className="text-2xl font-bold" data-oid="5lzq5:v">
            {currency} {currentBalance.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground" data-oid="tru-1pg">
            Your available internal balance
          </p>
          <div className="flex gap-2 mt-4" data-oid="5hb6t8_">
            <Button size="sm" data-oid="jgarhf2">
              <Upload className="mr-2 h-4 w-4" data-oid="s_yp.ll" /> Request
              Payout
            </Button>
            {/* Add Deposit button for Clients? Or handled by Admin? */}
          </div>
        </CardContent>
      </Card>

      <Card data-oid="lx8w01f">
        <CardHeader data-oid="5jhmhwy">
          <CardTitle data-oid="03e715t">Transaction History</CardTitle>
          <CardDescription data-oid="d_0u8d2">
            Recent financial activities on your account.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="ynj-0f5">
          <p className="text-sm text-muted-foreground" data-oid="9-werbn">
            No transactions yet.
          </p>
          {/* TODO: Implement transaction history table */}
        </CardContent>
      </Card>

      <Card data-oid="mr7_2ku">
        <CardHeader data-oid="j_pmu8-">
          <CardTitle data-oid="-fol70z">Invoices</CardTitle>
          <CardDescription data-oid="n2753bs">
            Manage your incoming and outgoing invoices.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid=".:470qx">
          <p className="text-sm text-muted-foreground" data-oid="o8s9iai">
            No invoices found.
          </p>
          {/* TODO: Implement invoice listing (pending, paid, overdue) */}
        </CardContent>
      </Card>
    </div>
  );
}
