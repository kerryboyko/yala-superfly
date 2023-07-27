import { ChangeEventHandler, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Textarea } from "../../ui/textarea";
import { useFetcher } from "@remix-run/react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import DisplayBannedUsers from "./DisplayBannedUsers";

export interface BannedUser {
  bannedUser: {
    username: string;
  };
  bannedBy: {
    username: string;
  };
  banReason: string | null;
}

export const BanUsers = ({
  communityRoute,
  bannedUsers,
}: {
  communityRoute: string;
  bannedUsers: BannedUser[];
}) => {
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
        <CardTitle>Ban Control: {communityRoute}</CardTitle>
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
        {fetcher.data ? (
          <div className="data-display">
            {fetcher.data.result.count !== 0 ? (
              <div>
                <div>Number of users banned: {fetcher.data.result.count}</div>
                <div>Users banned: {fetcher.data.bannedUsers.join(", ")}</div>
              </div>
            ) : null}
            {fetcher.data.ineligibleUsers.length ? (
              <div className="data-display__ineligible">
                <div>The following users could not be banned</div>
                {fetcher.data.ineligibleUsers.map(
                  ([username, reason]: [string, string]) => (
                    <div>
                      {username}: {reason}
                    </div>
                  ),
                )}
              </div>
            ) : null}
          </div>
        ) : null}
        <DisplayBannedUsers
          bannedUsers={bannedUsers}
          communityRoute={communityRoute}
        />
      </CardContent>
    </Card>
  );
};

export default BanUsers;
