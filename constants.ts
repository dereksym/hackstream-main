import { User, UserRole, Project, Rubric, ChatMessage } from './types.ts';

const calculateTargetDate = () => {
    const target = new Date();
    target.setDate(target.getDate() + 3);
    target.setHours(23, 59, 59, 0);
    return target;
};
export const HACKATHON_END_DATE = calculateTargetDate();


export const USERS: { [key in UserRole]: User } = {
  [UserRole.Visitor]: { id: 'user1', role: UserRole.Visitor, name: 'Guest', avatar: 'https://i.pravatar.cc/150?u=visitor' },
  [UserRole.Participant]: { id: 'user2', role: UserRole.Participant, name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=participant' },
  [UserRole.Judge]: { id: 'user3', role: UserRole.Judge, name: 'Casey', avatar: 'https://i.pravatar.cc/150?u=judge' },
  [UserRole.Organizer]: { id: 'user4', role: UserRole.Organizer, name: 'Jordan', avatar: 'https://i.pravatar.cc/150?u=organizer' },
};

export const MOCK_CHAT_USERS: User[] = [
    { id: 'chatuser1', role: UserRole.Visitor, name: 'DevDude', avatar: 'https://i.pravatar.cc/150?u=chatuser1' },
    { id: 'chatuser2', role: UserRole.Visitor, name: 'ReactFan', avatar: 'https://i.pravatar.cc/150?u=chatuser2' },
    { id: 'chatuser3', role: UserRole.Visitor, name: 'PyQueen', avatar: 'https://i.pravatar.cc/150?u=chatuser3' },
    { id: 'chatuser4', role: UserRole.Visitor, name: 'CSS_Ninja', avatar: 'https://i.pravatar.cc/150?u=chatuser4' },
];

export const MOCK_PROJECTS: Project[] = [
    {
        id: '1', teamName: 'Streamweavers', name: 'Live Code Feedback', tagline: 'Real-time AI-powered code suggestions for streamers.',
        description: 'A VS Code extension that connects to your stream chat, allowing viewers to suggest code changes that are then vetted by an AI before appearing in your editor. Perfect for collaborative coding sessions.',
        categoryPrimary: 'Developer tools & productivity', categorySecondary: ['AI / Machine Learning'], techTags: ['React', 'TypeScript', 'Firebase', 'Gemini API'],
        streamPlatform: 'Twitch', streamUrl: 'https://www.twitch.tv/some_user', isLive: true, thumbnail: 'https://picsum.photos/seed/project1/480/270', viewerCount: 1450,
        repoUrl: 'https://github.com/example/live-code-feedback', demoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
        id: '2', teamName: 'Data Dynamos', name: 'Global Climate Visualizer', tagline: 'Track climate change indicators on a 3D globe.',
        description: 'An interactive web application built with D3.js and WebGL to visualize real-time and historical climate data from various public APIs. Users can explore datasets like temperature anomalies, sea levels, and CO2 concentrations.',
        categoryPrimary: 'Data visualization & analytics', categorySecondary: ['Sustainability & climate tech'], techTags: ['D3.js', 'WebGL', 'Node.js'],
        streamPlatform: 'YouTube', streamUrl: 'https://www.youtube.com/watch?v=some_video', isLive: true, thumbnail: 'https://picsum.photos/seed/project2/480/270', viewerCount: 890,
        repoUrl: 'https://github.com/example/climate-visualizer', demoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ'
    },
     {
        id: '3', teamName: 'Alex', name: 'AI Symptom Checker', tagline: 'An intelligent chatbot for preliminary health assessments.',
        description: 'A mobile app that uses a conversational AI to help users understand their symptoms and provides information on potential conditions. It uses a fine-tuned model for medical queries and advises users to consult professionals.',
        categoryPrimary: 'Healthtech & med devices', categorySecondary: ['AI / Machine Learning', 'Mobile app'], techTags: ['React Native', 'Gemini API', 'Express'],
        streamPlatform: 'Twitch', streamUrl: 'https://www.twitch.tv/some_user', isLive: false, thumbnail: 'https://picsum.photos/seed/project3/480/270', viewerCount: 0,
        repoUrl: 'https://github.com/example/symptom-checker', demoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
        id: '4', teamName: 'Fintech Wizards', name: 'Decentralized Crowdfunding', tagline: 'A blockchain-based platform for transparent project funding.',
        description: 'Raising funds for creative projects using smart contracts on the Ethereum blockchain. Contributors receive tokens that can represent shares or grant voting rights on project milestones.',
        categoryPrimary: 'Fintech & payments', categorySecondary: ['Web app'], techTags: ['Solidity', 'Next.js', 'Ethers.js'],
        streamPlatform: 'YouTube', streamUrl: 'https://www.youtube.com/watch?v=some_video', isLive: true, thumbnail: 'https://picsum.photos/seed/project4/480/270', viewerCount: 2100,
        repoUrl: 'https://github.com/example/decentralized-crowdfunding', demoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
        id: '5', teamName: 'Game Changers', name: 'AR History Explorer', tagline: 'Walk through historical sites with augmented reality guides.',
        description: 'An AR mobile app that overlays historical information, photos, and 3D models onto real-world locations through your phone\'s camera. Discover the stories behind landmarks as you explore.',
        categoryPrimary: 'AR / VR / MR', categorySecondary: ['Mobile app', 'Edtech & learning'], techTags: ['Unity', 'ARKit', 'Blender'],
        streamPlatform: 'Twitch', streamUrl: 'https://www.twitch.tv/some_user', isLive: false, thumbnail: 'https://picsum.photos/seed/project5/480/270', viewerCount: 0,
        repoUrl: 'https://github.com/example/ar-history', demoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ'
    },
];

export const MOCK_LEADERBOARD_DATA = [
    {
        rank: 1,
        name: 'Blademir Malina Tori',
        handle: '@popy_bob',
        avatar: 'https://i.pravatar.cc/150?u=leader1',
        idNumber: '1587667',
        projectId: '1',
        wins: 443,
        matches: 778,
        points: 44872,
        chestValue: 32421,
        gemValue: 17500,
        spentTime: 778,
        victories: 43,
        bestWin: '1:05',
    },
    {
        rank: 2,
        name: 'Robert Fox',
        handle: '@robert_fox',
        avatar: 'https://i.pravatar.cc/150?u=leader2',
        idNumber: '1587634',
        projectId: '2',
        wins: 440,
        matches: 887,
        points: 42515,
        chestValue: 31001,
        gemValue: 17421,
        spentTime: 887,
        victories: 43,
        bestWin: '1:03',
    },
    {
        rank: 3,
        name: 'Molida Glinda',
        handle: '@molida_glinda',
        avatar: 'https://i.pravatar.cc/150?u=leader3',
        idNumber: '1587699',
        projectId: '3',
        wins: 412,
        matches: 756,
        points: 40550,
        chestValue: 30987,
        gemValue: 17224,
        spentTime: 756,
        victories: 43,
        bestWin: '1:15',
    },
    {
        rank: 4,
        name: 'David Gilo',
        handle: '@david_gilo',
        avatar: 'https://i.pravatar.cc/150?u=leader4',
        idNumber: '1587698',
        projectId: '4',
        wins: 401,
        matches: 750,
        points: 39550,
        chestValue: 29987,
        gemValue: 16224,
        spentTime: 750,
        victories: 41,
        bestWin: '1:18',
    },
    {
        rank: 5,
        name: 'Lana Kroos',
        handle: '@lana_kroos',
        avatar: 'https://i.pravatar.cc/150?u=leader5',
        idNumber: '1587697',
        projectId: '5',
        wins: 380,
        matches: 740,
        points: 38550,
        chestValue: 28987,
        gemValue: 15224,
        spentTime: 740,
        victories: 40,
        bestWin: '1:25',
    },
];


export const MOCK_MESSAGES: ChatMessage[] = [
    { id: 'msg1', user: MOCK_CHAT_USERS[0], message: 'This is an awesome project! 🔥', timestamp: '10:30 AM' },
    { id: 'msg2', user: MOCK_CHAT_USERS[1], message: 'Wow, using the Gemini API like that is genius.', timestamp: '10:31 AM' },
    { id: 'msg3', user: MOCK_CHAT_USERS[2], message: 'What was the backend written in?', timestamp: '10:31 AM' },
    { id: 'msg4', user: USERS.Participant, message: 'Thanks everyone! The backend is Node.js with Express.', timestamp: '10:32 AM' },
    { id: 'msg5', user: MOCK_CHAT_USERS[3], message: 'Super clean UI. I love the animations.', timestamp: '10:33 AM' },
];


export const CATEGORIES = [
  "Web app", 
  "Mobile app", 
  "AI / Machine Learning", 
  "Data visualization & analytics", 
  "Backend / APIs & Integrations", 
  "Developer tools & productivity", 
  "DevOps, infra & automation", 
  "Cloud / Edge computing", 
  "Hardware, IoT & wearables", 
  "Robotics & drones", 
  "AR / VR / MR", 
  "Games & interactive experiences", 
  "Fintech & payments", 
  "Healthtech & med devices", 
  "Edtech & learning", 
  "Sustainability & climate tech", 
  "Social impact & civic tech", 
  "Accessibility & inclusion", 
  "Retail, ecommerce & marketplaces", 
  "Logistics & supply chain", 
  "Legaltech & compliance", 
  "Open source & community projects", 
  "Experimental / wild card"
];

export const RUBRIC_MARKDOWN = `
# Hackathon Rubric v1

## Presentation - 30
- Clarity of problem - 10
- Storytelling - 10
- Demo quality - 10

## Technical - 40
- Code quality - 10
- Architecture - 10
- Tests and reliability - 10
- Performance and security - 10

## Impact - 20
- User value - 10
- Market or community relevance - 10

## Polish - 10
- UI and UX - 5
- Documentation - 5
`;