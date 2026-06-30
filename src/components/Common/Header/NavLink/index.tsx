"use client"
import React, { FC } from "react";
import { useRouter } from "next/navigation";

export const NavLink: FC<{label: string, path: string }> = ({ label, path }) => {
  const router = useRouter();

  return (
    <div>
      
    </div>
  )
}