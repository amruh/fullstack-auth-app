import "server-only";

import { getSessionCookies } from "@/lib/cookies";

type UsersList = {
  id: string;
  username: string;
  signInCount: number;
  lastLogin: Date;
  lastLogout: Date;
  createdAt: Date;
};


export const fetchUserInfo = async () => {
  const session = getSessionCookies();
  
  try {
    const response = await fetch("http://localhost:3001/api/user/info", {
      headers: {
        Cookie: `${session.name}=${session.value}`,
      },
      cache: "no-store",
    });

    const userInfo = (await response.json()) as {
      message: string;
      data: {
        username: string;
        id: string;
      };
    };

    return userInfo.data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch 'users information'.");
  }
};

export const fetchUsersList = async () => {
  const session = getSessionCookies();

  try {
    const response = await fetch("http://localhost:3001/api/users", {
      headers: {
        Cookie: `${session.name}=${session.value}`,
      },
      cache: 'no-store',
    });
    const users = (await response.json()) as {
      message: string;
      data: UsersList[];
    };
    return users.data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch 'users lists'.");
  }
};
