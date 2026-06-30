"use client"
import React, { FC } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const ConnectWallet: FC = () => {
  return (
    <div>
      <ConnectButton
        label='Connect Wallet'
      />
    </div>
  )
}

export default ConnectWallet;