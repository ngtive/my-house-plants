import { Config, Effect, Either, Layer, pipe, Schedule } from "effect";
import AuthService from "@/services/auth";
import { Refinement } from "effect/ParseResult";
import { log } from "console";
import { AiLanguageModel, AiResponse } from "@effect/ai";
import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai";
import { NodeHttpClient } from "@effect/platform-node";

export default async function Page() {
  const generateDadJoke = Effect.gen(function* () {
    const response = yield* AiLanguageModel.generateText({
      system:
        "You are helpful joke generator assistant be sexual or funny but don't be racism and only persian",
      prompt: "Generate a persian joke",
    });
    console.log(response.text);
    return response;
  });

  const Gpt4o = OpenAiLanguageModel.model("gpt-5");

  const main = generateDadJoke.pipe(Effect.provide(Gpt4o));
  const recoveredMain = Effect.gen(function* () {
    const failureOrSuccess = yield* Effect.either(main);

    if (Either.isLeft(failureOrSuccess)) {
      const error = failureOrSuccess.left;
      if (error._tag === "AiError") {
        return "Recovering from AiError";
      } else {
        return yield* Effect.fail(error);
      }
    } else {
      return failureOrSuccess.right;
    }
  });

  const OpenAi = OpenAiClient.layerConfig({
    apiKey: Config.redacted("OPENAI_API_KEY"),
  });

  const OpenAiWithHttp = Layer.provide(OpenAi, NodeHttpClient.layerUndici);

  let result = await recoveredMain.pipe(
    Effect.provide(OpenAiWithHttp),
    Effect.runPromise,
  );

  if (result instanceof AiResponse.AiResponse) {
    result = result.text;
  }
  return (
    <div>
      <p dir="rtl" className="font-[tahoma]">
        {result}
      </p>
    </div>
  );
}
