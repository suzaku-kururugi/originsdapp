import React, { FC } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const Logo: FC = () => {
  const router = useRouter();

  return (
    <div className=" w-[160px] flex justify-between cursor-pointer" onClick={() => router.push("/")}>
      <div className="bg-[#776344] w-[60px] p-2 rounded-full">
        <Image src="/logo_tree.png" alt="logo" width={48} height={48}/>
      </div>

      <div className=" font-mrDafoe text-[24px] w-[80px] text-[#776344] flex flex-col justify-center tracking-[6px] leading-6">
          {"Origins dApp"}
      </div>
    </div>
  )
}