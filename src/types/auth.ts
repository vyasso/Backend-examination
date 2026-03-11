export type TokenPayload = {
    sub: string;
    role: "user" | "admin";
    type: "access" | "refresh";
    email: string;
    display_name: string;
    iat: number;
    exp: number;
  };