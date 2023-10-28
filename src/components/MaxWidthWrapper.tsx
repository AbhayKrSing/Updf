import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const MaxWidthWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: String;
}) => {
  // const [pending, setpending] = useState(false)
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
        className
        // (pending && "bg-red-900")  //you can also pass object in this place like  { Pending:"bg-red-900"}  //For this only clsx made
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
