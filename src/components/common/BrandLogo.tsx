import Image from "next/image";

export function BrandLogo() {
  return (
    <span className="mr-auto flex flex-shrink-0 items-center gap-2 text-lg font-semibold">
      <Image
        src={"/assets/images/logo.png"}
        height={50}
        width={50}
        alt="smart parity logo"
      />
      <span>SMARTPARITY</span>
    </span>
  );
}
