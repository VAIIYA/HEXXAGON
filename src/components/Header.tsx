'use client';
import React, { FC } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import './Header.css';

export const Header: FC = () => {
    const { publicKey } = useWallet();

    return (
        <header className="app-header">
            <div className="header-content">
                <Link href="/" className="logo">
                    HEXXAGON
                </Link>
                <div className="nav-actions">
                    {publicKey && (
                        <Link href="/profile" className="profile-link">
                            Profile
                        </Link>
                    )}
                    <WalletMultiButton />
                </div>
            </div>
        </header>
    );
};
