import { NextRequest } from "next/server";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { Data, Effect } from "effect";

class DecryptError extends Data.TaggedError("DecryptError")<{
  readonly message: string;
}> {}

class EncryptError extends Data.TaggedError("EncryptError")<{
  readonly message: string;
}> {}

class AuthService {
  declare private secret: Uint8Array<ArrayBufferLike>;
  constructor() {
    this.secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  }

  encryptWithJose(
    payload: JWTPayload,
  ): Effect.Effect<string, DecryptError | EncryptError, never> {
    return Effect.async((resume) => {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(60 * 60 * 24 * 10)
        .sign(secret)
        .then((result) => {
          resume(Effect.succeed(result));
        })
        .catch((err) => {
          resume(
            Effect.fail(
              new EncryptError({
                message: "Error while encrypting to jwt!",
              }),
            ),
          );
        });
    });
  }

  authServiceResponse(token: string) {
    return Effect.succeed(token);
  }

  async decryptWithJose(token: string) {
    let payload = null;
    try {
      payload = await jwtVerify(token, this.secret);
      return payload;
    } catch (e) {
      throw new DecryptError({ message: "Decrypt failed! " });
    }
  }

  async isRequestHaveAccessToken(req: NextRequest) {
    const accessToken = req.cookies.get("access-token");
    if (!accessToken) return false;
  }
}

export default new AuthService();
