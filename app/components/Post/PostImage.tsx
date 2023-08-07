import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/custom/dialog";
import postImageStyles from "~/styles/post-image.css";

export const styles = postImageStyles;

export const PostImage = ({ src }: { src: string }) => (
  <Dialog>
    <DialogTrigger asChild>
      <img src={src} alt={`${src}`} className="post-image__preview" />
    </DialogTrigger>
    <DialogContent className="post-image__display">
      <a href={src} target="_blank" rel="noreferrer">
        <img src={src} alt={`${src}`} className="post-image__full" />
      </a>
    </DialogContent>
  </Dialog>
);

export default PostImage;
