import { useFetcher } from "@remix-run/react";
import { Trash2 } from "lucide-react";

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
// TODO: This is a refactor target - we should have each component with it's own styles,
// and then import them into the pages the component is used on, NOT use SCSS imports.
import deleteCommentButtonStyles from "~/styles/delete-comment-button.css";

export const styles = deleteCommentButtonStyles;

export function DeleteCommentButton({
  commentId,
}: {
  commentId: string | number;
}) {
  const deleteFetcher = useFetcher();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="delete-comment-button">
          <Trash2 className="delete-comment-button--icon" />
          Delete
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="delete-comment-dialog__title">
            Are you absolutely sure you want to delete this comment?
          </AlertDialogTitle>
          <AlertDialogDescription className="delete-comment-dialog__description">
            This action cannot be undone. This will permanently delete this
            comment and remove it from the servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="delete-comment-dialog__cancel-button">
            Cancel
          </AlertDialogCancel>
          <deleteFetcher.Form method="POST" action="/api/v1/delete-comment">
            <AlertDialogAction
              type="submit"
              className="delete-comment-dialog__continue-button"
            >
              Continue
              <input type="hidden" name="commentId" value={commentId} />
            </AlertDialogAction>
          </deleteFetcher.Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteCommentButton;
