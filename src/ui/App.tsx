import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package } from "lucide-react";
import { Link } from "react-router";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Welcome to POS Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today's Sales</CardTitle>
            <DollarSign className="text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">$1,240.00</p>
            <p className="text-sm text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Orders</CardTitle>
            <ShoppingCart className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">36</p>
            <p className="text-sm text-muted-foreground">+5 new today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Products</CardTitle>
            <Package className="text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">120</p>
            <p className="text-sm text-muted-foreground">4 low in stock</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <Link to="/sales">
          <Card className="hover:bg-muted transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage sales
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/products">
          <Card className="hover:bg-muted transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add and edit products
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/settings">
          <Card className="hover:bg-muted transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage preferences
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
