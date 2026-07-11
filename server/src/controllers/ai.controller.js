import { improveTaskDescription } from '../services/openaiService.js';

// POST /api/ai/improve-task
export async function improveTask(req, res) {
  const body = req.body || {};
  const { title, description } = body;

  // --- Input validation ---
  if (typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Title Is Required.' });
  }
  if (title.trim().length > 150) {
    return res
      .status(400)
      .json({ success: false, message: 'Title Must Be At Most 150 Characters.' });
  }
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      return res
        .status(400)
        .json({ success: false, message: 'Description Must Be A String.' });
    }
    if (description.length > 1000) {
      return res
        .status(400)
        .json({ success: false, message: 'Description must be at most 1000 characters.' });
    }
  }

  // --- Call the AI service ---
  try {
    const improvedDescription = await improveTaskDescription({
      title: title.trim(),
      description: (description || '').trim(),
    });

    return res.status(200).json({
      success: true,
      data: { improvedDescription },
    });
  } catch (error) {
    // Log a sanitized detail server-side; the API key is never part of these.
    console.error('[ai] improve-task failed:', error.detail || error.message);

    const status = error.status || 502;
    const message = error.safe
      ? error.message
      : 'The AI Service Is Temporarily Unavailable. Please Try Again.';

    return res.status(status).json({ success: false, message });
  }
}

export default improveTask;
