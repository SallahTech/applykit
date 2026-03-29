import type { AIProvider } from "./provider";

export function getAIProvider(): AIProvider {
  if (process.env.OPENAI_API_KEY) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { OpenAIProvider } = require("./openai");
    return new OpenAIProvider();
  }
  if (process.env.ANTHROPIC_API_KEY) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AnthropicProvider } = require("./anthropic");
    return new AnthropicProvider();
  }
  throw new Error(
    "No AI provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY."
  );
}
