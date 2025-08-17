export default async function Page() {
  // const generateDadJoke = Effect.gen(function* () {
  //   const response = yield* AiLanguageModel.generateText({
  //     system:
  //       "You are helpful joke generator assistant be sexual or funny but don't be racism and only persian",
  //     prompt: "Generate a persian joke",
  //   });
  //   console.log(response.text);
  //   return response;
  // });
  //
  // const Gpt4o = OpenAiLanguageModel.model("gpt-5");
  //
  // const main = generateDadJoke.pipe(Effect.provide(Gpt4o));
  // const recoveredMain = Effect.gen(function* () {
  //   const failureOrSuccess = yield* Effect.either(main);
  //
  //   if (Either.isLeft(failureOrSuccess)) {
  //     const error = failureOrSuccess.left;
  //     if (error._tag === "AiError") {
  //       return "Recovering from AiError";
  //     } else {
  //       return yield* Effect.fail(error);
  //     }
  //   } else {
  //     return failureOrSuccess.right;
  //   }
  // });
  //
  // const OpenAi = OpenAiClient.layerConfig({
  //   apiKey: Config.redacted("OPENAI_API_KEY"),
  // });

  // const OpenAiWithHttp = Layer.provide(OpenAi, NodeHttpClient.layerUndici);
  //
  // let result = await recoveredMain.pipe(
  //   Effect.provide(OpenAiWithHttp),
  //   Effect.runPromise,
  // );

  // if (result instanceof AiResponse.AiResponse) {
  //   result = result.text;
  // }

  // const body = await getSkyLiveResponse();
  //
  // const lastOne = (
  //   await db.select().from(records).orderBy(desc(records.created_at))
  // )?.[0];
  //
  // const { distanceNumber, distancePercentage, constellation, magnitude } =
  //   await exportSkyLiveInformation(body);
  //
  // const data = {
  //   distance: distanceNumber.toFixed(1),
  //   percentage: distancePercentage.toFixed(1),
  //   position: lastOne?.distance
  //     ? lastOne?.distance > distanceNumber
  //       ? "receding"
  //       : "approaching"
  //     : "",
  //   constellation: constellation,
  // };

  return (
    <div>
      <pre dir="ltr" className="font-[tahoma]">
        OK
      </pre>
    </div>
  );
}
