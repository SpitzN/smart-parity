import { cn } from "@/lib/utils";
import { AsteriskIcon } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

export default function RequiredLabelIcon({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AsteriskIcon>) {
  return (
    <AsteriskIcon
      {...props}
      className={cn("inline size-3 align-top text-destructive", className)}
    />
  );
}