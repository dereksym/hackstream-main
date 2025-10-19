import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_LEADERBOARD_DATA, HACKATHON_END_DATE } from '../constants.ts';
import { useCountdown } from '../hooks/useCountdown.ts';
import { Users, LayoutGrid, Flame, Medal } from '../components/Icons.tsx';

const LeaderboardPage = () => {
    const { timeLeft } = useCountdown(HACKATHON_END_DATE);
    const topThree = MOCK_LEADERBOARD_DATA.slice(0, 3);
    const globalRanking = MOCK_LEADERBOARD_DATA;
    const MAX_POINTS = 50000;

    const StatCard = ({ icon, value, label, color }: { icon: React.ReactNode, value: string, label: string, color: string }) => (
        <div className="bg-[#181818] p-4 rounded-xl flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-text-primary">{value}</p>
                <p className="text-sm text-text-secondary">{label}</p>
            </div>
        </div>
    );

    const CountdownCard = () => (
        <div className="bg-[#181818] p-4 rounded-xl col-span-2 lg:col-span-1">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-text-primary flex items-center">
                        Remaining time for completion <Flame className="w-4 h-4 ml-1 text-orange-400" />
                    </p>
                    <p className="text-xs text-text-secondary mt-1">Only the first three positions will be awarded prizes</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-text-primary tracking-tighter">
                        <span>{String(timeLeft.days).padStart(2, '0')}</span> : <span>{String(timeLeft.hours).padStart(2, '0')}</span> : <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                    </div>
                    <div className="text-xs text-text-secondary flex justify-between px-1">
                        <span>DAYS</span><span>HRS</span><span>MINS</span>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const TopPlayerCard = ({ player, isFirst }: { player: typeof MOCK_LEADERBOARD_DATA[0], isFirst: boolean}) => {
        const score = (player.points / MAX_POINTS) * 100;

        return (
            <div className={`relative bg-[#181818] p-6 rounded-2xl flex flex-col h-full transition-all duration-300 hover:bg-surface-accent ${isFirst ? 'border-2 border-yellow-400 transform lg:scale-105 shadow-lg' : ''}`}>
                {isFirst && <Medal className="absolute top-4 right-4 w-12 h-12 text-yellow-400" />}
                 <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img src={player.avatar} alt={player.name} className="w-16 h-16 rounded-full border-2 border-surface-accent" />
                         <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{player.rank}</div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-text-primary">{player.name}</h3>
                        <p className="text-sm text-text-secondary">{player.handle}</p>
                    </div>
                </div>
                <div className="flex-grow flex flex-col items-center justify-center text-center my-6">
                    <p className="text-xs text-text-secondary uppercase tracking-wider">Score</p>
                    <p className="text-5xl font-black text-text-primary mt-1">{score.toFixed(1)}%</p>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-black mb-6">Leaderboard</h1>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard icon={<Users className="w-6 h-6 text-green-400" />} value="1,277" label="Total Registered" color="bg-green-500/20" />
                    <StatCard icon={<LayoutGrid className="w-6 h-6 text-blue-400" />} value="255" label="Total Participated" color="bg-blue-500/20" />
                    <CountdownCard />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {topThree.map((player) => (
                        <Link key={player.rank} to={`/watch/${player.projectId}`} className="block">
                            <TopPlayerCard player={player} isFirst={player.rank === 1} />
                        </Link>
                    ))}
                </div>

                <div className="bg-[#181818] p-6 rounded-2xl">
                    <h2 className="text-2xl font-bold mb-4">Global Ranking</h2>
                    <div className="overflow-x-auto">
                        <div className="min-w-full">
                            {/* Header */}
                            <div className="grid grid-cols-12 gap-4 text-xs text-text-secondary uppercase pb-2 border-b border-surface-accent font-semibold px-4">
                                <div className="col-span-1">Rank</div>
                                <div className="col-span-4">User name</div>
                                <div className="col-span-1 text-center">Match Wins</div>
                                <div className="col-span-1 text-center">Spent time</div>
                                <div className="col-span-1 text-center">Victories</div>
                                <div className="col-span-2 text-center">Best Win (mins)</div>
                                <div className="col-span-2 text-right">Points</div>
                            </div>
                            {/* Body */}
                            <div className="space-y-2 mt-2">
                                {globalRanking.map((player) => (
                                    <Link key={player.rank} to={`/watch/${player.projectId}`} className="grid grid-cols-12 gap-4 items-center bg-surface-hover/50 hover:bg-surface-hover rounded-lg px-4 py-2 transition-colors">
                                        <div className="col-span-1 font-bold text-text-primary">{player.rank}</div>
                                        <div className="col-span-4 flex items-center space-x-3">
                                            <img src={player.avatar} alt={player.name} className="w-8 h-8 rounded-full"/>
                                            <div>
                                                <p className="font-semibold text-text-primary text-sm">{player.name}</p>
                                                <p className="text-xs text-text-secondary">ID {player.idNumber}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-1 text-center text-text-primary font-medium">{player.wins}</div>
                                        <div className="col-span-1 text-center text-text-primary font-medium">{player.spentTime}</div>
                                        <div className="col-span-1 text-center text-text-primary font-medium">{player.victories}</div>
                                        <div className="col-span-2 text-center text-text-primary font-medium">{player.bestWin}</div>
                                        <div className="col-span-2 text-right font-bold text-text-primary">{player.points.toLocaleString()}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;