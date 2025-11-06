const API_URL = "https://86geb0cba3.execute-api.ap-south-1.amazonaws.com/login";

export const loginUser = async (code) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
  return res.json();
};
