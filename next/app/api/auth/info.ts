import axios from "axios";

export const fetchUser = async (token?: string) => {
  if (!token) {
    throw new Error("No token provided");
  }

  const res = await axios.get("http://devcms.ddns.net:81/api/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
