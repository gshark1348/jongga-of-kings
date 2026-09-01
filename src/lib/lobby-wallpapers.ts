import { realCompanies } from "./company-data";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export type LobbyWallpaper = {
  id: string;
  groupName: string;
  companies: string[];
  imageUrl: string;
  wordmarks: string[];
};

const mergedGroups: Record<string, Omit<LobbyWallpaper, "id">> = {
  "samsung-electronics": {
    groupName: "삼성",
    companies: ["삼성전자", "삼성바이오로직스", "삼성증권"],
    imageUrl: `${basePath}/lobby-wallpapers/samsung-group.png`,
    wordmarks: ["SAMSUNG", "BIOLOGICS", "SECURITIES"],
  },
  "hyundai-motor": {
    groupName: "현대자동차그룹",
    companies: ["현대차", "기아", "현대건설"],
    imageUrl: `${basePath}/lobby-wallpapers/hyundai-group.png`,
    wordmarks: ["HYUNDAI", "KIA", "HYUNDAI E&C"],
  },
  "hanwha-solutions": {
    groupName: "한화",
    companies: ["한화솔루션", "한화오션"],
    imageUrl: `${basePath}/lobby-wallpapers/hanwha-group.png`,
    wordmarks: ["HANWHA", "SOLUTIONS", "OCEAN"],
  },
};

const mergedMemberIds = new Set([
  "samsung-biologics",
  "samsung-securities",
  "kia",
  "hyundai-ec",
  "hanwha-ocean",
]);

export const lobbyWallpapers: LobbyWallpaper[] = realCompanies
  .filter((company) => !mergedMemberIds.has(company.id))
  .map((company) => {
    const merged = mergedGroups[company.id];
    if (merged) return { id: company.id, ...merged };
    return {
      id: company.id,
      groupName: company.name,
      companies: [company.name],
      imageUrl: company.imageUrl,
      wordmarks: [company.name],
    };
  });

export function shuffleLobbyWallpapers(items: LobbyWallpaper[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}
