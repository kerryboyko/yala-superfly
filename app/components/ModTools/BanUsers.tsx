import { ChangeEventHandler, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Textarea } from "../ui/textarea";
import { useFetcher } from "@remix-run/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const BanUsers = ({ communityRoute }: { communityRoute: string }) => {
  const fetcher = useFetcher();
  const [bannedUserNames, setBannedUserNames] = useState<string>("");
  const handleBannedUserName: ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    setBannedUserNames(event.target.value);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ban Users from {communityRoute}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <fetcher.Form
            method="POST"
            action={`/api/v1/moderation/ban-users/${communityRoute}`}
          >
            <Textarea
              name="listOfBannedUsers"
              value={bannedUserNames}
              onChange={handleBannedUserName}
              placeholder="You can seperate multiple users with a comma"
            />
            <Input
              type="text"
              name="reason"
              placeholder="Reason for Ban? (Optional)"
            />
            <Button type="submit">Ban Users</Button>
          </fetcher.Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default BanUsers;
