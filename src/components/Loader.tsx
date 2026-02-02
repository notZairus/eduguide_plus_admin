import { Dialog, DialogContent } from "./ui/dialog";
import { Spinner } from "./ui/spinner";

const Loader = ({
  show = true,
  text = "loading",
}: {
  show: boolean;
  text?: string;
}) => {
  return (
    <Dialog open={show}>
      <DialogContent className="w-min" showCloseButton={false}>
        <div className="">
          <Spinner className="mx-auto" />
        </div>
        <p className="text-center">{text}</p>
      </DialogContent>
    </Dialog>
  );
};

export default Loader;
