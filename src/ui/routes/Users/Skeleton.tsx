import { Skeleton } from "@/components/ui/skeleton";
import { Filters, ItemSkeleton } from "./User";

type Props = {};

export default function ProfileSkeleton({}: Props) {
  return (
    <div className="min-h-0 bg-background">
      <div className="bg-background shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start space-x-6">
              <Skeleton className="h-24 w-24 rounded-full flex-shrink-0" />
              <div>
                <Skeleton className="text-3xl font-bold h-9 w-3xs" />
                <Skeleton className="h-5 mt-1 w-24" />
                <div className="flex flex-wrap gap-4 mt-3 text-accent-foreground/60">
                  <Skeleton className="h-5 w-48"></Skeleton>
                  <Skeleton className="h-5 w-36"></Skeleton>
                  <Skeleton className="h-5 w-20"></Skeleton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl bg-background mx-auto px-4 sm:px-6 lg:px-8 py-3 text-accent-foreground/80">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Available Items</h2>
          <Filters />
        </div>
        <div className="flex gap-1 flex-wrap">
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </div>
    </div>
  );
}
