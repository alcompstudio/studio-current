import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Settings, FileText, PlusCircle } from "lucide-react";

export default function PlatformFinancePage() {
  // TODO: Add role check (Admin only)
  // TODO: Fetch platform financial overview, transactions, currency rates
  return (
    <div className="flex flex-col gap-6" data-oid="ubeyd0y">
      <div className="flex items-center justify-between" data-oid="myr60iq">
        <h2 className="text-2xl font-bold tracking-tight" data-oid="2qcf06p">
          Platform Finance
        </h2>
        <div className="flex gap-2" data-oid="ehnx.q_">
          <Button variant="outline" data-oid="nmmaz_u">
            <Settings className="mr-2 h-4 w-4" data-oid="w:gc3hb" /> Currency
            Rates
          </Button>
          <Button data-oid="hkcovfl">
            <PlusCircle className="mr-2 h-4 w-4" data-oid="881y60i" /> Manual
            Transaction
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2" data-oid="7xrvfv3">
        <Card data-oid="2_e_xr:">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-oid="b4xticf"
          >
            <CardTitle className="text-sm font-medium" data-oid="mrsl4b_">
              Total Platform Balance (USD)
            </CardTitle>
            <DollarSign
              className="h-4 w-4 text-muted-foreground"
              data-oid="w3tuy19"
            />
          </CardHeader>
          <CardContent data-oid="7xp7tqn">
            <div className="text-2xl font-bold" data-oid="hyvpx_q">
              $15,234.56
            </div>
            <p className="text-xs text-muted-foreground" data-oid="_oqoo5e">
              Aggregated balance across user types
            </p>
          </CardContent>
        </Card>
        {/* Add more overview cards if needed (e.g., Pending Payouts) */}
      </div>

      <Card data-oid="a-wum93">
        <CardHeader data-oid="j8ez:2_">
          <CardTitle data-oid="q8035b-">Manual Transactions Log</CardTitle>
          <CardDescription data-oid="xxj2b8d">
            Record of manual balance adjustments by administrators.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="pwkp9ja">
          <p className="text-sm text-muted-foreground" data-oid="o36fm3j">
            No manual transactions recorded yet.
          </p>
          {/* TODO: Implement transaction log table */}
        </CardContent>
      </Card>

      <Card data-oid="namkhx7">
        <CardHeader data-oid=".8ax3q1">
          <CardTitle data-oid="sbfdm5a">
            Platform Fees & Revenue (Conceptual)
          </CardTitle>
          <CardDescription data-oid="64rhm2a">
            Overview of potential revenue streams.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="t258d2f">
          <p className="text-sm text-muted-foreground" data-oid="vp4xsas">
            Fee structure and reporting to be implemented.
          </p>
          {/* TODO: Implement fee settings and revenue reports */}
        </CardContent>
      </Card>
    </div>
  );
}
