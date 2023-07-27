import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { BannedUser } from "./BanUsers";
import { Button } from "~/components/ui/button";
import { useFetcher } from "@remix-run/react";
import { Input } from "~/components/ui/input";

export const DisplayBannedUsers = ({
  bannedUsers,
  communityRoute,
}: {
  bannedUsers: BannedUser[];
  communityRoute: string;
}) => {
  const fetcher = useFetcher();

  return (
    <Table>
      <TableHeader>
        <TableCell></TableCell>
        <TableCell>Banned user</TableCell>
        <TableCell>Banned by</TableCell>
        <TableCell>Reason for Ban</TableCell>
      </TableHeader>
      <TableBody>
        {bannedUsers.map((bu: BannedUser) => (
          <TableRow key={bu.bannedUser.username}>
            <TableCell>
              <fetcher.Form
                method="POST"
                action={`/api/v1/moderation/reinstate-users/${communityRoute}`}
              >
                <Button type="submit">Remove Ban</Button>
                <Input
                  type="hidden"
                  name="userToReinstate"
                  value={bu.bannedUser.username}
                />
              </fetcher.Form>
            </TableCell>
            <TableCell>{bu.bannedUser.username}</TableCell>
            <TableCell>{bu.bannedBy.username}</TableCell>
            <TableCell>{bu.banReason}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DisplayBannedUsers;
