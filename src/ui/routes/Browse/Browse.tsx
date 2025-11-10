import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Search } from "lucide-react";

type Item = {
  Accounts: {
    AccountID: string;
    Email: string;
    FirstName: string;
    LastName: string;
    Type: string;
    Username: string | null;
    FacebookID: string | null;
    GoogleID: string | null;
    WorkArea: Object | null;
    WorkAreaIDs: number[];
  };
  Items: {
    Type: string;
    Name: string;
    ItemID: number;
    Code: number;
    CategoryID: number;
    Brand: string;
    DefaultImageLink: string;
  };
} & {
  AccountID: string;
  ItemID: number;
  Price: number;
  Qty: number;
  ImageLink: string;
};

export default function Browse() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");

  useEffect(() => {
    async function getItems() {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:3000/api/items_public", {
          credentials: "include",
        });
        const { items, error } = (await res.json()) as {
          items?: Item[];
          error?: string;
        };
        if (!items) {
          console.log("err:", error);
          setIsLoading(false);
          return;
        }
        setItems(items);
        setIsLoading(false);
      } catch (error) {
        console.log("err:", error);
        setIsLoading(false);
      }
    }
    getItems();
  }, []);

  // Get unique categories and brands
  const categories = Array.from(new Set(items.map((item) => item.Items.Type)));
  const brands = Array.from(new Set(items.map((item) => item.Items.Brand)));

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.Items.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.Items.Brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || item.Items.Type === selectedCategory;

    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "under50" && item.Price < 50) ||
      (priceRange === "50to100" && item.Price >= 50 && item.Price <= 100) ||
      (priceRange === "over100" && item.Price > 100);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Items</h1>
          <p className="text-muted-foreground mt-1">
            Discover amazing products from our marketplace
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search items or brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat || `category-${cat}`}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under50">Under $50</SelectItem>
                  <SelectItem value="50to100">$50 - $100</SelectItem>
                  <SelectItem value="over100">Over $100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            {!isLoading && (
              <p className="text-sm text-muted-foreground mt-4">
                Showing {filteredItems.length} of {items.length} items
              </p>
            )}
          </CardContent>
        </Card>

        {/* Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="p-0">
                  <Skeleton className="aspect-square rounded-t-lg" />
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No items found</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.ItemID}
                className="overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <CardHeader className="p-0">
                  <div className="aspect-square bg-muted overflow-hidden">
                    {item.ImageLink || item.Items.DefaultImageLink ? (
                      <img
                        src={item.ImageLink || item.Items.DefaultImageLink}
                        alt={item.Items.Name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold line-clamp-2 flex-1">
                      {item.Items.Name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.Items.Brand}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      ${item.Price.toFixed(2)}
                    </span>
                    <Badge variant="secondary">{item.Qty} available</Badge>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Sold by{" "}
                      <span className="font-medium text-foreground">
                        {item.Accounts.FirstName} {item.Accounts.LastName}
                      </span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
