// Gamification stuff (note: keep in sync server postPoint.js)
// Level interface
export interface Level {
    id: number;
    name: string;
    points: number;
    pointsRemaining?: number; // calculated on client
    percent?: number; // calculated on client
    nextLevelName?: string; // calculated on client
}

export interface Action {
    name: string;
    message: string;
    points: number;
    dailyLimit: number;
    streakMin?: number;
    streakMax?: number;
    dailyQuota?: number; // calculated on client
    isComplete?: boolean; // calculated on client
} 

const levels: Level[] = [
    { id: 1, name: 'Seeker', points: 3 },
    { id: 2, name: 'Initiate', points: 10 },
    { id: 3, name: 'Disciple', points: 25 },
    { id: 4, name: 'Sage', points: 100 },
    { id: 5, name: 'Mentor', points: 500 },
    { id: 6, name: 'Visionary', points: 2000 },
    { id: 7, name: 'Master', points: 4000 },
    { id: 8, name: 'Grandmaster', points: 6000 },
    { id: 9, name: 'Ascended', points: 8000 },
    { id: 10, name: 'Direct Dominion', points: 10000 },
    { id: 11, name: 'Luminary', points: 20000 },
    { id: 12, name: 'Oracle', points: 40000 },
    { id: 13, name: 'Archon', points: 60000 },
    { id: 14, name: 'Sovereign', points: 80000 },
    { id: 15, name: 'Celestial', points: 100000 },
    { id: 16, name: 'Guardian', points: 200000 },
    { id: 17, name: 'Nexus', points: 400000 },
    { id: 18, name: 'Apex', points: 600000 },
    { id: 19, name: 'Progenitor', points: 800000 },
    { id: 20, name: 'Omnipresent', points: 1000000 }
];

const actions: Action[] = [
    { name: 'Check-in', message: 'Checked in for the day', points: 1, dailyLimit: 1 },
    { name: 'Listen', message: 'Listened to a full episode', points: 5, dailyLimit: 5 },
    { name: 'Note', message: 'Created a note', points: 3, dailyLimit: 1 },
    { name: 'Heart', message: 'Hearted a public note', points: 1, dailyLimit: 1 },
    { name: 'Streak-1', message: 'Continued a 1+ day streak', points: 1, dailyLimit: 1, streakMin: 1, streakMax: 2 },
    { name: 'Streak-3', message: 'Continued a 3+ day streak', points: 10, dailyLimit: 1, streakMin: 3, streakMax: 6 },
    { name: 'Streak-7', message: 'Continued a 7+ day streak', points: 20, dailyLimit: 1, streakMin: 7, streakMax: 20 },
    { name: 'Streak-21', message: 'Continued a 21+ day streak', points: 30, dailyLimit: 1, streakMin: 21, streakMax: 39 },
    { name: 'Streak-40', message: 'Continued a 40+ day streak', points: 40, dailyLimit: 1, streakMin: 40, streakMax: Infinity },
  ];
  
  

export { levels, actions };