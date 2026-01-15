const scopes = [
  "openid",
  "profile",
  "email",
  "https://www.googleapis.com/auth/youtube.readonly",
];

export const Login = () => {
  return (
    <a
      href={`https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
        {
          scope: scopes.join(" "),
          access_type: "offline",
          include_granted_scopes: "true",
          response_type: "code",
          redirect_uri: `${import.meta.env.VITE_API_URL}/google/auth`,
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          //   state,
        }
      )}`}
    >
      Login
    </a>
  );
};
