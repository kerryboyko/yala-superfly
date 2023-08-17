import type { ChangeEventHandler } from "react";
import { useState } from "react";

import { useFetcher } from "@remix-run/react";
import get from "lodash/get";

import DisplayBannedUsers from "./DisplayBannedUsers";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/custom/card";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";

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
    <Card className="ban-control">
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
              className="ban-control__list-users"
              name="listOfBannedUsers"
              value={bannedUserNames}
              onChange={handleBannedUserName}
              placeholder="You can seperate multiple users with a comma"
            />
            <div className="ban-control__reason-for-ban--warning">
              The user who is banned will be able to see the reason they are
              banned, so this may be left entirely optional.
            </div>
            <Input
              className="ban-control__reason-for-ban"
              type="text"
              name="reason"
              placeholder="Reason for Ban? (Optional)"
            />

            <Button className="button" type="submit">
              Ban Users
            </Button>
          </fetcher.Form>
        </div>
        {get(fetcher, "data.result", false) ? (
          <div className="data-display">
            {fetcher.data.result.count !== 0 ? (
              <div>
                <div>Number of users banned: {fetcher.data.result.count}</div>
                <div>Users banned: {fetcher.data.bannedUsers.join(", ")}</div>
              </div>
            ) : null}
            {get(fetcher, "data.ineligibleUsers", []).length ? (
              <div className="data-display__ineligible">
                <div>The following users could not be banned</div>
                {fetcher.data.ineligibleUsers.map(
                  ([username, reason]: [string, string]) => (
                    <div key={JSON.stringify([username, reason])}>
                      {username}: {reason}
                    </div>
                  ),
                )}
              </div>
            ) : null}
          </div>
        ) : null}
        {bannedUsers.length ? (
          <DisplayBannedUsers
            bannedUsers={bannedUsers}
            communityRoute={communityRoute}
          />
        ) : null}
      </CardContent>
    </Card>
  );
};

export default BanUsers;
