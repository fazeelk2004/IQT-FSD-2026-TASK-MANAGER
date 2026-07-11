import mongoose from 'mongoose';

const PRIORITIES = ['low', 'medium', 'high'];

// Fields A Client Is Allowed To Set.
const ALLOWED_UPDATE_FIELDS = ['title', 'description', 'completed', 'priority'];

function fail(res, message) {
  return res.status(400).json({ success: false, message });
}

// Validate The :id Route Param As A Real MongoDB ObjectId Before Hitting The DB.
export function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return fail(res, 'Invalid Task ID');
  }
  next();
}

// Validate The Body For POST /api/tasks.
export function validateCreateTask(req, res, next) {
  const body = req.body || {};

  if (typeof body.title !== 'string' || body.title.trim().length === 0) {
    return fail(res, 'Title Is Required');
  }

  const title = body.title.trim();
  if (title.length < 2 || title.length > 150) {
    return fail(res, 'Title Must Be Between 2 And 150 Characters');
  }

  const payload = { title };

  if (body.description !== undefined) {
    if (typeof body.description !== 'string') {
      return fail(res, 'Description Must Be A String');
    }
    const description = body.description.trim();
    if (description.length > 1000) {
      return fail(res, 'Description Must Be At Most 1000 Characters');
    }
    payload.description = description;
  }

  if (body.priority !== undefined) {
    if (!PRIORITIES.includes(body.priority)) {
      return fail(res, 'Priority Must Be One Of: Low, Medium, High');
    }
    payload.priority = body.priority;
  }

  req.validatedBody = payload;
  next();
}

// Validate The Body For PATCH /api/tasks/:id.
export function validateUpdateTask(req, res, next) {
  const body = req.body || {};
  const keys = Object.keys(body);

  if (keys.length === 0) {
    return fail(res, 'No Fields Provided To Update');
  }

  const unsupported = keys.filter((key) => !ALLOWED_UPDATE_FIELDS.includes(key));
  if (unsupported.length > 0) {
    return fail(res, `Unsupported Field(s): ${unsupported.join(', ')}`);
  }

  const payload = {};

  if (body.title !== undefined) {
    if (typeof body.title !== 'string') {
      return fail(res, 'Title Must Be A String');
    }
    const title = body.title.trim();
    if (title.length < 2 || title.length > 150) {
      return fail(res, 'Title Must Be Between 2 And 150 Characters');
    }
    payload.title = title;
  }

  if (body.description !== undefined) {
    if (typeof body.description !== 'string') {
      return fail(res, 'Description Must Be A String');
    }
    const description = body.description.trim();
    if (description.length > 1000) {
      return fail(res, 'Description Must Be At Most 1000 Characters');
    }
    payload.description = description;
  }

  if (body.completed !== undefined) {
    if (typeof body.completed !== 'boolean') {
      return fail(res, 'Completed Must Be A Boolean');
    }
    payload.completed = body.completed;
  }

  if (body.priority !== undefined) {
    if (!PRIORITIES.includes(body.priority)) {
      return fail(res, 'Priority Must Be One Of: Low, Medium, High');
    }
    payload.priority = body.priority;
  }

  req.validatedBody = payload;
  next();
}
