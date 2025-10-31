import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { AccountInfo } from "../../../../types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  Package,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useSession } from "@/lib/SessionContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProfileSkeleton from "./Skeleton";
import { useStore } from "@/lib/StoreContext";
import { toast } from "sonner";

type Props = {};
type User = AccountInfo;
export type UserItem = {
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
  return isLoading ? (
    <ProfileSkeleton />
  ) : (
    User && <ProfileP {...User} Items={Items} />
  );
}

interface DM {
  Type: string;
  ChatID: string;
  Name: string;
  lastMessageAt: Date;
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
                <Button
                  variant={"outline"}
                  className="w-28"
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      const res1 = await fetch(
                        "http://localhost:3000/api/chats/get_dm?target=" +
                          Username,
                        { credentials: "include" }
                      );
                      const { data } = (await res1.json()) as {
                        ok: boolean;
                        data: DM | undefined;
                      };
                      if (data) {
                        navigate("/messages?chat_id=" + data.ChatID);
                        return;
                      }
                      const res2 = await fetch(
                        "http://localhost:3000/api/chats/create",
                        {
                          method: "POST",
                          credentials: "include",
                          body: JSON.stringify({
                            type: "DM",
                            members: [Username, session.user.Username],
                          }),
                        }
                      );
                      const { ok, newChat } = (await res2.json()) as {
                        ok: boolean;
                        newChat: DM;
                      };
                      if (ok) {
                        navigate("/messages?chat_id=" + newChat.ChatID);
                        return;
                      }
                      setIsLoading(false);
                    } catch (error) {
                      toast.error("failed to get DM");
                      console.log(error);
                      setIsLoading(false);
                    }
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      <span>Message</span>
                    </>
                  )}
                </Button>
                <OrderModal username={Username!} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl bg-background mx-auto px-4 sm:px-6 lg:px-8 py-3 text-accent-foreground/80">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Available Items</h2>
          <Filters />
        </div>
        <div className="flex gap-1 flex-wrap">
          {Items.map((item) => (
            <Item key={item.ItemID.toString()} {...item} Username={Username!} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </div>
    </div>
  );
}

export function Filters() {
  return (
    <div className="w-full mx-auto bg-accent p-1.5 rounded-sm flex gap-2 mb-6">
      <Select>
        <SelectTrigger className="w-[180px] ">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Category 1</SelectItem>
          <SelectItem value="2">Category 2</SelectItem>
          <SelectItem value="3">Category 3</SelectItem>
        </SelectContent>
      </Select>
      <input
        type="text"
        className="w-full px-2.5 text-sm bg-background rounded-sm placeholder:text-center"
        placeholder="name"
      />
      <div className="flex ml-auto gap-x-1">
        <input
          type="number"
          className="bg-background rounded-sm px-2.5 text-sm w-28 placeholder:text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="min price"
        />
        <input
          type="number"
          className="bg-background rounded-sm px-2.5 text-sm w-28 placeholder:text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="max price"
        />
      </div>
    </div>
  );
}

function OrderModal({ username }: { username: string }) {
  const { cart } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const { cartDispatch } = useStore();
  const cartItems = cart.get(username);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"}>
          <ShoppingCart className="w-5 h-5" />
          <span>Make Order</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order from @{username}</DialogTitle>
          <input
            type="text"
            name="orderNote"
            id=""
            className="my-1 bg-accent py-0.5 px-2 text-sm rounded-sm"
          />
          <DialogDescription>cart items</DialogDescription>
          {cartItems ? (
            <div>
              {cartItems.map((item) => (
                <CartItem
                  key={item.attributes.ItemID}
                  item={item}
                  username={username}
                />
              ))}
            </div>
          ) : (
            <div>No items in cart</div>
          )}
        </DialogHeader>
        <DialogFooter>
          {cartItems && cartItems.length > 0 ? (
            <Button
              type="submit"
              className="w-24 flex justify-center"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  const res = await fetch(
                    `http://localhost:3000/api/orders/create`,
                    {
                      method: "POST",
                      credentials: "include",
                      body: JSON.stringify({
                        owner: username,
                        items: cartItems.map((item) => ({
                          id: item.attributes.ItemID,
                          qty: item.qty,
                        })),
                      }),
                    }
                  );
                  const { success } = await res.json();
                  console.log(success);
                  if (success) {
                    cartDispatch({
                      type: "CLEAR_CART",
                      payload: { owner: username },
                    });
                    toast.success("Order placed successfully");
                  } else {
                    toast.error("Failed to place order");
                  }
                  setIsLoading(false);
                } catch (error) {
                  console.error(error);
                  setIsLoading(false);
                }
              }}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Place Order"}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CartItem({
  item,
  username,
}: {
  item: { attributes: UserItem; qty: number };
  username: string;
}) {
  const { cartDispatch } = useStore();
  return (
    <div className="flex justify-between">
      <div>{item.attributes.Items.Name}</div>
      <div>{item.qty}</div>
      <div>{parseFloat(item.attributes.Price) * item.qty} DZD</div>
      <span className="space-x-3">
        <button
          onClick={() => {
            cartDispatch({
              type: "ADD_TO_CART",
              payload: {
                owner: username,
                item: item.attributes,
              },
            });
          }}
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            cartDispatch({
              type: "REMOVE_FROM_CART",
              payload: {
                owner: username,
                item: item.attributes,
              },
            });
          }}
        >
          <Minus className="w-4 h-4" />
        </button>
      </span>
    </div>
  );
}

function Item(itemData: UserItem & { Username: string }) {
  const { Items, Price, ImageLink, ItemID, Username } = itemData;
  const { Name, Type, Brand, CategoryID } = Items;
  const { cartDispatch } = useStore();
  return (
    <div className="bg-accent w-fit h-fit rounded-sm overflow-hidden flex flex-col relative">
      <div className="aspect-[16/9] w-52 h-28 overflow-hidden">
        <img
          src={ImageLink}
          alt={Name}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="absolute text-white top-0 left-0 mx-2 px-2 py-0.5 my-1 rounded-2xl bg-black/60">
        {Price} DZD
      </div>
      <button
        onClick={() => {
          cartDispatch({
            type: "ADD_TO_CART",
            payload: { owner: Username, item: itemData },
          });
        }}
        className="absolute top-0 right-0 mx-2 my-1 bg-black/60 px-2 py-2 rounded-full text-white hover:bg-black/80 transition active:bg-black"
      >
        <Plus className="size-3" />
      </button>
      <div className="flex px-2 py-1">
        <div className="">{Name}</div>
        <div>{Brand}</div>
      </div>
    </div>
  );
}

export function ItemSkeleton() {
  return (
    <Skeleton className=" w-fit h-fit rounded-sm overflow-hidden flex flex-col ">
      <Skeleton className="aspect-[16/9] w-52 h-28 overflow-hidden"></Skeleton>

      <Skeleton className="flex px-2 h-8 py-1"></Skeleton>
    </Skeleton>
  );
}
