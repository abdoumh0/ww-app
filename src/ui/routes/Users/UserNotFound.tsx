import { TriangleAlert } from "lucide-react";
import React from "react";

type Props = {};

export default function UserNotFound({}: Props) {
  return (
    <div className="w-full h-full bg-background items-center flex justify-center">
      <div className="text-rose-600">
        <h2 className="mx-auto">Could not find user</h2>
        <TriangleAlert className="mx-auto my-4" size={90} />
      </div>
    </div>
  );
}
