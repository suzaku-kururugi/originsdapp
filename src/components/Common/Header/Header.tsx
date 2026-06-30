import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import ConnectButton from "../ConnectButton/ConnectButtom";
import { Logo } from "../Logo";
import { Container } from "../Container";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../Buttons";

export const Header: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const path = usePathname();

  return (
    <div
      className="w-full h-fit bg-transparent fixed z-20 top-0 left-0 min-h-[72px] border-b-[1px] border-b-[#3C312B]"
      style={{ backdropFilter: "blur(4px)"}}
    >
      <Container>
        <div className="relative px-2 py-4">
          <div className="absolute top-1/4 left-6">
            <Logo />
          </div>
          { children }

          { path === "/dApp/" && 
            (
              <div className="absolute top-4 right-6">
                <ConnectButton />
              </div>
            )
          }
          { path === "/" && 
            (
              <div className="absolute top-4 right-4 flex gap-4">
                <Button name="Open dApp" onClick={() => router.push("/dApp")} />
              </div>
            )
          }
        </div>
      </Container>
    </div>
  )
}