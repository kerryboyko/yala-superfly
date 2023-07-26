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

export const DisplayBannedUsers = ({
  bannedUsers,
}: {
  bannedUsers: BannedUser[];
}) => {
  console.log("bannedUsers", bannedUsers);
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
            <TableCell>button goes here</TableCell>
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
