import { verify } from 'jsonwebtoken';

export interface payloadJWT {
  payload: {
    role: string;
    email: string;
  };
}

export default function validateToken(token: string) {
  const { payload } = verify(
    token,
    process.env.JWT_SECRET as string,
  ) as payloadJWT;

  return payload;
}
