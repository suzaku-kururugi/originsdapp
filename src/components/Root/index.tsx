"use client";
import React, { FC } from "react";
import { ApplicationPage } from "../index";
import { Providers } from "../Common";

export const Layout: FC = () => (
  <>
    <Providers>
      <ApplicationPage />
    </Providers>
  </>
);
