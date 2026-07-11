import OpenAI from 'openai';

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const TIMEOUT_MS = 15000;

// Instructions
const INSTRUCTIONS = [
  'You rewrite software task descriptions for a project management tool.',
  'Return exactly one concise, professional task description.',
  'The description must be between 30 and 80 words.',
  'Do not use markdown headings.',
  'Do not use bullet points or numbered lists.',
  'Do not invent company-specific names, people, tools, dates, or details that are not implied by the input.',
  'Do not begin with an introductory phrase such as "Here is" or "This task".',
  'Return only the description text, with no surrounding quotes.',
].join(' ');

let client;

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const err = new Error('AI service is not configured.');
    err.code = 'MISSING_API_KEY';
    throw err;
  }
  if (!client) {
    client = new OpenAI({ apiKey, timeout: TIMEOUT_MS, maxRetries: 1 });
  }
  return client;
}

// Normalize any upstream/SDK error into a safe error carrying an HTTP status
// and a client-safe message. Raw OpenAI errors are never propagated outward.
function toSafeError(error) {
  if (error.safe) return error;

  const safe = new Error();
  safe.safe = true;

  if (error.code === 'MISSING_API_KEY') {
    safe.status = 503;
    safe.message = 'AI service is not configured.';
  } else if (error.code === 'UPSTREAM_EMPTY') {
    safe.status = 502;
    safe.message = 'The AI service returned an empty response. Please try again.';
  } else if (error.name === 'APIConnectionTimeoutError' || error.code === 'ETIMEDOUT') {
    safe.status = 504;
    safe.message = 'The AI request timed out. Please try again.';
  } else if (error.status === 429) {
    safe.status = 429;
    safe.message = 'The AI service is busy right now. Please try again shortly.';
  } else if (error.status === 401 || error.status === 403) {
    safe.status = 503;
    safe.message = 'AI service is not configured.';
  } else if (error.name === 'APIConnectionError') {
    safe.status = 502;
    safe.message = 'Could not reach the AI service. Please try again.';
  } else {
    safe.status = 502;
    safe.message = 'The AI service is temporarily unavailable. Please try again.';
  }

  // Sanitized detail for server-side logging only (never the key, never raw body).
  safe.detail = error.status ? `status=${error.status} ${error.name || ''}`.trim() : error.message;
  return safe;
}

/**
 * Ask OpenAI to produce an improved task description.
 * @param {{ title: string, description?: string }} input
 * @returns {Promise<string>} the improved description text
 */
export async function improveTaskDescription({ title, description }) {
  try {
    const openai = getClient();

    const userInput =
      `Task Title: ${title}\n` +
      `Current Description: ${description ? description : '(none provided)'}\n\n` +
      'Rewrite The Description Following All Of The Rules.';

    const response = await openai.responses.create({
      model: MODEL,
      instructions: INSTRUCTIONS,
      input: userInput,
      max_output_tokens: 300,
    });

    const text = response.output_text?.trim();
    if (!text) {
      const err = new Error('Empty AI Response');
      err.code = 'UPSTREAM_EMPTY';
      throw err;
    }
    return text;
  } catch (error) {
    throw toSafeError(error);
  }
}

export default improveTaskDescription;
