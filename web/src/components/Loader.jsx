import { Spinner } from "./ui/spinner";

function Loader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner className="size-8" />
    </div>
  );
}

export default Loader;
