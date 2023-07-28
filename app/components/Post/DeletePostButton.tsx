import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";

// TODO: This is a refactor target - we should have each component with it's own styles,
// and then import them into the pages the component is used on, NOT use SCSS imports.
import deletePostButtonStyles from "~/styles/delete-post-button.css";

export const styles = deletePostButtonStyles;

export function DeletePostButton({
  communityRoute,
  postId,
  postTitle,
}: {
  communityRoute: string;
  postId: string | number;
  postTitle?: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="delete-post-button">
          <Trash2 className="delete-post-button--icon" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {postTitle ? (
          <div className="delete-post-dialog__title__link-title">
            Re: {postTitle}
          </div>
        ) : null}
        <AlertDialogHeader>
          <AlertDialogTitle className="delete-post-dialog__title">
            Are you absolutely sure you want to delete this post?
          </AlertDialogTitle>
          <AlertDialogDescription className="delete-post-dialog__description">
            This action cannot be undone. This will permanently delete this post
            and remove it from the servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="delete-post-dialog__cancel-button">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className="delete-post-dialog__continue-button">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeletePostButton;
