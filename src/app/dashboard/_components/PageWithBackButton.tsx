import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type PageWithBackButtonProps = {
  children: React.ReactNode;
  title: string;
  backHref: string;
};

export default function PageWithBackButton({
  children,
  title,
  backHref,
}: PageWithBackButtonProps) {
  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-8">
      <Button size="icon" asChild className="rounded-full" variant="outline">
        <Link href={backHref}>
          <div className="sr-only">Back</div>
          <ChevronLeft className="size-8" />
        </Link>
      </Button>
      <h1 className="self-center text-2xl font-semibold">{title}</h1>
      <div className="col-start-2">{children}</div>
    </div>
  );
}
