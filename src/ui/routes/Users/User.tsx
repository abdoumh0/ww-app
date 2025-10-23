import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { AccountInfo } from "../../../../types";
import Skeleton from "./Skeleton";
import UserNotFound from "./UserNotFound";
import {
  Mail,
  MapPin,
  MessageCircle,
  Package,
  ShoppingCart,
} from "lucide-react";
import { useSession } from "@/lib/SessionContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {};
type User = AccountInfo;
type UserItem = {
  Items: {
    Type: string;
    ItemID: string;
    Name: string;
    CategoryID: string;
    Brand: string;
    DefaultImageLink: string;
  };
} & {
  AccountID: string;
  ItemID: string;
  Price: string;
  Qty?: string;
  ImageLink: string;
};

export default function User({}: Props) {
  const params = useParams();
  const navigate = useNavigate();
  const Username = params.username;
  const [User, setUser] = useState<User | null>(null);
  const [Items, setItems] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  if (!Username) {
    navigate("/");
  }

  async function getUser() {
    setIsLoading(true);
    try {
      let res = await fetch(`http://localhost:3000/api/users/${Username}`);
      const { user } = (await res.json()) as { user: User | null };
      if (!user) {
        setIsLoading(false);
        return;
      }
      setUser(user);
      res = await fetch(`http://localhost:3000/api/users/${Username}/items`);
      const { items } = (await res.json()) as { items: UserItem[] };
      setItems(items);
      console.log(items);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getUser();
  }, []);
  if (!isLoading && !User) {
    return <UserNotFound />;
  }
  return isLoading ? (
    <Skeleton />
  ) : (
    User && <ProfileP {...User} Items={Items} />
  );
}

function ProfileP({
  FirstName,
  LastName,
  Username,
  Email,
  Items,
}: // WorkArea,
AccountInfo & { Items: UserItem[] }) {
  const { session } = useSession();

  // const formatPrice = (price: number) => {
  //   return `$${(price / 100).toFixed(2)}`;
  // };

  return (
    <div className="min-h-0 bg-gradient-to-br from-background to-accent">
      <div className="bg-background shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start space-x-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
                {FirstName[0]}
                {LastName[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {FirstName} {LastName}
                </h1>
                <p className="text-foreground/35 text-sm italic mt-1">
                  @{Username}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-accent-foreground/60">
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-2" />
                    {Email}
                  </div>
                  <div className="flex items-center text-sm ">
                    <MapPin className="w-4 h-4 mr-2" />
                    to be added
                  </div>
                  <div className="flex items-center text-sm">
                    <Package className="w-4 h-4 mr-2" />
                    {Items.length} Items
                  </div>
                </div>
              </div>
            </div>
            {session && (
              <div className="flex gap-3">
                <MessageModal />
                <OrderModal />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl bg-background mx-auto px-4 sm:px-6 lg:px-8 py-8 text-accent-foreground/80">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Available Items</h2>
          <p>Browse items from this seller's inventory</p>
        </div>
        {Items.map((item) => (
          <Item key={item.ItemID.toString()} {...item} />
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </div>
    </div>
  );
}

function OrderModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"}>
          <ShoppingCart className="w-5 h-5" />
          <span>Create Order</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function MessageModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <MessageCircle className="w-5 h-5" />
          <span>Send Message</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send a Message</DialogTitle>
          <DialogDescription>
            This action will send a message to the user.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function Item({ Items, Price, Qty, ImageLink }: UserItem) {
  const { Name, Type, Brand, CategoryID } = Items;
  return (
    <div className="bg-accent p-4 rounded-lg flex flex-col items-center">
      <div>{Name}</div>
      <div>{Type}</div>
      <div>{Brand}</div>
      <div>{CategoryID}</div>
      <img src={ImageLink} alt={Name} className="w-full h-auto rounded-lg" />
    </div>
  );
}
