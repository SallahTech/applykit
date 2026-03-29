import type { AIProvider, ParsedCVData, TailoredResult, ExtractedJobDetails } from "./provider";

export class AnthropicProvider implements AIProvider {
  async structureCV(_rawText: string): Promise<ParsedCVData> {
    throw new Error(
      "Anthropic provider not configured. Install @anthropic-ai/sdk and set ANTHROPIC_API_KEY."
    );
  }

  async structureCVFromPDF(_pdfBuffer: Buffer): Promise<ParsedCVData> {
    throw new Error(
      "Anthropic provider not configured. Install @anthropic-ai/sdk and set ANTHROPIC_API_KEY."
    );
  }

  async tailorCV(
    _originalCV: ParsedCVData,
    _jobDescription: string
  ): Promise<TailoredResult> {
    throw new Error(
      "Anthropic provider not configured. Install @anthropic-ai/sdk and set ANTHROPIC_API_KEY."
    );
  }

  async extractJobDetails(_pageText: string): Promise<ExtractedJobDetails> {
    throw new Error(
      "Anthropic provider not configured. Install @anthropic-ai/sdk and set ANTHROPIC_API_KEY."
    );
  }
}
