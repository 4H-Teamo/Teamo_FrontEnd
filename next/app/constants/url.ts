export const URL = {
  HOME: "/",
  FIND_TEAM: "/team",
  FIND_TEAMMATE: "/teammate",
  MY_PAGE: "/mypage",
  MY_NOTIFICATIONS: "/notification",
  CREATE_NEW_TEAM: "/team/create",
  SEARCH: "/search",
  LOGIN: "/login",
  TEAM_DETAIL: (id: string | number) => `/team/${id}`,
  TEAMMATE_DETAIL: (id: string | number) => `/teammate/${id}`,
};

export const API_BASE = "http://devcms.ddns.net:81/api"; // [web] 제공 URL
