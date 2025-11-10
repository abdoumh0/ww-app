import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/SessionContext";
import { Loader2, MessageCircle, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type Props = {};

export interface User {
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
}

export default function People({}: Props) {
  const [people, setPeople] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(true);

  async function getPeople() {
    setIsLoading(true);
    setSuccess(true);
    try {
      const res = await fetch("http://localhost:3000/api/users");
      const { users } = (await res.json()) as { users: User[] };
      setPeople(users);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setSuccess(false);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getPeople();
  }, []);

  return (
    <div className="flex-1 flex flex-col px-2 overflow-scroll">
      <span className="bg-chart-2 text-white text-xs my-1 px-2 rounded-sm">
        People near you:
      </span>
      {people.map((person) => {
        return <UserPreview key={person.AccountID} {...person} />;
      })}
      {isLoading && <Loader2 className="animate-spin w-fit mx-auto size-4" />}
      {!success && (
        <div className="grid gap-y-1.5">
          <span className="text-red-500 w-fit mx-auto text-sm">
            loading failed
          </span>
          <button
            className="w-fit mx-auto bg-red-500 text-sm text-background px-3 py-1.5 rounded-sm"
            onClick={getPeople}
          >
            retry
          </button>
        </div>
      )}
    </div>
  );
}

interface DM {
  Type: string;
  ChatID: string;
  Name: string;
  lastMessageAt: Date;
}

function UserPreview({ FirstName, LastName, Username }: User) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSession();
  return (
    <div className="flex justify-between items-center align-middle px-2 py-1 rounded-sm bg-accent my-0.5">
      <div>
        {FirstName} {LastName}
        <div className="italic text-xs text-gray-500">@{Username}</div>
      </div>
      <div className="flex gap-x-1.5">
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={async () => {
            setIsLoading(true);
            try {
              const res1 = await fetch(
                "http://localhost:3000/api/chats/get_dm?target=" + Username,
                { credentials: "include" }
              );
              const { data } = (await res1.json()) as {
                ok: boolean;
                data: DM | undefined;
              };
              if (data) {
                setIsLoading(false);
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
                    members: [Username, session?.user.Username],
                  }),
                }
              );
              const { ok, newChat } = (await res2.json()) as {
                ok: boolean;
                newChat: DM;
              };
              if (ok) {
                setIsLoading(false);
                navigate("/messages?chat_id=" + newChat.ChatID);
                return;
              }
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
            </>
          )}
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            navigate("/users/" + Username);
          }}
        >
          <User />
        </Button>
      </div>
    </div>
  );
}
