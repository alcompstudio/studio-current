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
    <div className="flex flex-col gap-6" data-oid="4p9.mhs">
      <div className="flex items-center justify-between" data-oid="f0dxx:2">
        <h2 className="text-2xl font-bold tracking-tight" data-oid="mik-gs:">
          Platform Finance
        </h2>
        <div className="flex gap-2" data-oid="cq4cg9l">
          <Button variant="outline" data-oid="wee60vd">
            <Settings className="mr-2 h-4 w-4" data-oid="0qr7w3f" /> Currency
            Rates
          </Button>
          <Button data-oid="41cwpib">
            <PlusCircle className="mr-2 h-4 w-4" data-oid="d3xmfop" /> Manual
            Transaction
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2" data-oid="1_5meol">
        <Card data-oid="csmehwe">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-oid="sg0a5in"
          >
            <CardTitle className="text-sm font-medium" data-oid="crwi29e">
              Total Platform Balance (USD)
            </CardTitle>
            <DollarSign
              className="h-4 w-4 text-muted-foreground"
              data-oid="13tuc_w"
            />
          </CardHeader>
          <CardContent data-oid="oo_qt2d">
            <div className="text-2xl font-bold" data-oid="ytqbyn7">
              $15,234.56
            </div>
            <p className="text-xs text-muted-foreground" data-oid="vyx3454">
              Aggregated balance across user types
            </p>
          </CardContent>
        </Card>
        {/* Add more overview cards if needed (e.g., Pending Payouts) */}
      </div>

      <Card data-oid="ztttgi4">
        <CardHeader data-oid="-5fgw2s">
          <CardTitle data-oid="9p_vlp6">Manual Transactions Log</CardTitle>
          <CardDescription data-oid="183gxsy">
            Record of manual balance adjustments by administrators.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="74ywpf5">
          <p className="text-sm text-muted-foreground" data-oid="ztt.klv">
            No manual transactions recorded yet.
          </p>
          {/* TODO: Implement transaction log table */}
        </CardContent>
      </Card>

      <Card data-oid="xxg_pt1">
        <CardHeader data-oid="6swzpl1">
          <CardTitle data-oid="6fc_a5s">
            Platform Fees & Revenue (Conceptual)
          </CardTitle>
          <CardDescription data-oid="q.oiid_">
            Overview of potential revenue streams.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="dp.7tgt">
          <p className="text-sm text-muted-foreground" data-oid="17qf6tw">
            Fee structure and reporting to be implemented.
          </p>
          {/* TODO: Implement fee settings and revenue reports */}
        </CardContent>
      </Card>
    </div>
  );
}
