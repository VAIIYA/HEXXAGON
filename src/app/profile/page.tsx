'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { getProfile, saveProfile, UserProfile } from '@/utils/store';
import './profile.css';

export default function ProfilePage() {
    const { publicKey, connected } = useWallet();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');

    useEffect(() => {
        if (!connected) {
            // Redirect or show not connected
        } else if (publicKey) {
            const data = getProfile(publicKey.toBase58());
            setProfile(data);
            setUsernameInput(data.username);
        }
    }, [publicKey, connected]);

    if (!connected) {
        return (
            <div className="profile-container error-state">
                <h2>Not Connected</h2>
                <p>Please connect your Solana wallet to view your profile.</p>
                <button className="btn" onClick={() => router.push('/')}>Go Back to Game</button>
            </div>
        );
    }

    if (!profile) return null;

    const handleSave = () => {
        const updated = { ...profile, username: usernameInput };
        saveProfile(updated);
        setProfile(updated);
        setIsEditing(false);
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar">
                        {profile.username ? profile.username.charAt(0).toUpperCase() : '?'}
                    </div>
                    {isEditing ? (
                        <div className="edit-username">
                            <input
                                type="text"
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                placeholder="Enter Username"
                                maxLength={20}
                                className="username-input"
                            />
                            <button className="btn small" onClick={handleSave}>Save</button>
                        </div>
                    ) : (
                        <div className="view-username">
                            <h2 className="username">{profile.username || 'Anonymous Player'}</h2>
                            <button className="icon-btn" onClick={() => setIsEditing(true)}>✎</button>
                        </div>
                    )}
                </div>

                <div className="wallet-info">
                    <span className="label">Wallet Address:</span>
                    <span className="address">{profile.address.slice(0, 10)}...{profile.address.slice(-4)}</span>
                </div>

                <div className="stats-grid">
                    <div className="stat-box">
                        <span className="stat-value">{profile.gamesPlayed}</span>
                        <span className="stat-label">Games Played</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value win">{profile.gamesWon}</span>
                        <span className="stat-label">Games Won</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value loss">{profile.gamesLost}</span>
                        <span className="stat-label">Games Lost</span>
                    </div>
                </div>

                <div className="win-rate">
                    <span className="label">Win Rate:</span>
                    <span className="value">
                        {profile.gamesPlayed > 0
                            ? Math.round((profile.gamesWon / profile.gamesPlayed) * 100)
                            : 0}%
                    </span>
                </div>
            </div>
        </div>
    );
}
