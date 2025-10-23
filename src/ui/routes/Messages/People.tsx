import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type Props = {};

export interface User {
  AccountID: string;
  Email: string;
  FirstName: string;
  LastName: string;
  Password: Uint8Array;
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
  const navigate = useNavigate();

  async function getPeople() {
    setIsLoading(true);
    setSuccess(true);
    try {
      const res = await fetch("http://localhost:3000/api/users/get");
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
        return (
          <div
            key={person.AccountID}
            className="px-2 py-1 rounded-sm bg-accent my-0.5 cursor-pointer hover:brightness-105 active:brightness-95"
            onClick={() => {
              navigate(`/users/${person.Username}`);
            }}
          >
            <div>
              {person.FirstName} {person.LastName}
            </div>
            <div className="italic text-xs text-gray-500">
              @{person.Username}
            </div>
          </div>
        );
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
