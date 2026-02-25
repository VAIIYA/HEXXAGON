export interface UserProfile {
    address: string;
    username: string;
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
}

export const getProfile = (address: string): UserProfile => {
    if (typeof window === 'undefined') return { address, username: '', gamesPlayed: 0, gamesWon: 0, gamesLost: 0 };
    const data = localStorage.getItem(`hexxagon_user_${address}`);
    if (data) {
        return JSON.parse(data) as UserProfile;
    }
    return {
        address,
        username: '',
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
    };
};

export const saveProfile = (profile: UserProfile): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`hexxagon_user_${profile.address}`, JSON.stringify(profile));
};

export const updateGameStats = (address: string, isWin: boolean, isTie: boolean): void => {
    if (typeof window === 'undefined') return;
    const profile = getProfile(address);
    profile.gamesPlayed += 1;
    if (isWin && !isTie) {
        profile.gamesWon += 1;
    } else if (!isTie) {
        profile.gamesLost += 1;
    }
    saveProfile(profile);
};
