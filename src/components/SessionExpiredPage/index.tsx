"use client"
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../Common";

export const SessionExpiredPage: FC  = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="max-h-96 min-h-52 md:max-w-[30%] min-w-[90%] md:min-w-0 bg-[#F1E0C5] rounded-xl border-2 border-[#3C312B] p-3 text-[#3c312bd4]">
        <div className="text-xl text-center">Session Expired</div>

        <div className="my-4 text-center text-[#3c312ba2]">
          {"Please connect your wallet again for continue work with your tree"}
        </div>

        <div className=" flex justify-center mt-10">
          <Button
            onClick={handleClick}
            name={"Home"}
          />
        </div>
      </div>
    </div>
  );
}
 