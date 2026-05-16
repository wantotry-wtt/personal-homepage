import fs from 'fs/promises';
import path from 'path';

// Define the type of our application data
export interface AppData {
  profile: {
    name: string;
    avatar: string;
    bio: string;
    motto: string[];
  };
  cards: {
    id: string;
    type: 'project' | 'article' | 'social' | 'stats';
    title: string;
    description?: string;
    link?: string;
    icon?: string;
    color?: string;
    size: 'small' | 'medium' | 'large';
    order: number;
    visible: boolean;
  }[];
  config: {
    theme: 'system' | 'light' | 'dark';
    language: 'zh' | 'en';
  };
}

const defaultData: AppData = {
  profile: {
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    bio: "A passionate full-stack developer & UI/UX designer.",
    motto: [
      "Turning coffee into code...",
      "Building digital experiences.",
      "Design is not just what it looks like, it's how it works."
    ]
  },
  cards: [
    {
      id: "1",
      type: "project",
      title: "Digital Garden",
      description: "My personal homepage built with Next.js & Tailwind.",
      link: "https://github.com",
      size: "large",
      order: 1,
      visible: true
    },
    {
      id: "2",
      type: "article",
      title: "The Art of Glassmorphism",
      description: "How to create stunning glass effects in CSS.",
      link: "#",
      size: "medium",
      order: 2,
      visible: true
    },
    {
      id: "3",
      type: "social",
      title: "GitHub",
      description: "@johndoe",
      link: "https://github.com",
      size: "small",
      order: 3,
      visible: true
    }
  ],
  config: {
    theme: "system",
    language: "en"
  }
};

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'data.json');

// Simple lock mechanism for concurrent writes
let isWriting = false;

/**
 * Ensures the data directory and file exist. If not, initializes with default data.
 */
async function initDb() {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  try {
    await fs.access(dataFile);
  } catch {
    // If file doesn't exist, create it with default data
    await fs.writeFile(dataFile, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

/**
 * Reads data from the JSON file.
 */
export async function readData(): Promise<AppData> {
  await initDb();
  try {
    const rawData = await fs.readFile(dataFile, 'utf-8');
    return JSON.parse(rawData) as AppData;
  } catch (error) {
    console.error("Error reading data.json:", error);
    // Fallback to default if JSON is corrupted
    return defaultData;
  }
}

/**
 * Writes data to the JSON file safely using a simple lock.
 */
export async function writeData(data: AppData): Promise<boolean> {
  await initDb();
  
  // Wait if another write is in progress
  while (isWriting) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  isWriting = true;
  try {
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Error writing data.json:", error);
    return false;
  } finally {
    isWriting = false;
  }
}
