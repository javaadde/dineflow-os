function normalizeMenu(menu) {
  if (!Array.isArray(menu)) {
    return [];
  }

  return menu
    .map((item) => ({
      name: String(item.name || '').trim(),
      category: String(item.category || '').trim(),
    }))
    .filter((item) => item.name);
}

function normalizeTables(tables) {
  if (!Array.isArray(tables)) {
    return [];
  }

  return tables
    .map((table) => ({
      id: String(table.id || '').trim(),
      label: String(table.label || table.id || '').trim(),
    }))
    .filter((table) => table.id);
}

function extractJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);

    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

async function parseCommandWithOpenAI({ transcript, menu, tables }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const error = new Error('OpenAI API key is not configured');
    error.statusCode = 503;
    throw error;
  }

  const text = String(transcript || '').trim();
  const menuItems = normalizeMenu(menu);
  const tableItems = normalizeTables(tables);

  if (!text) {
    const error = new Error('Transcript is required');
    error.statusCode = 400;
    throw error;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_VOICE_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You parse restaurant voice order commands. Return only JSON with intent add, remove, clear, send, or unknown; tableId must exactly match an available table when the speaker mentions a table; items is an array of every ordered menu item with exact itemName and positive integer quantity; itemName is the first item for backward compatibility; quantity is the first item quantity; message is a short waiter-facing confirmation.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            transcript: text,
            menu: menuItems,
            tables: tableItems,
            schema: {
              intent: 'add | remove | clear | send | unknown',
              tableId: 'exact table id or null',
              items: [{ itemName: 'exact menu item name', quantity: 'positive integer' }],
              itemName: 'exact menu item name or null',
              quantity: 'positive integer',
              message: 'short confirmation',
            },
          }),
        },
      ],
    }),
  });

  const body = await response.json();

  if (!response.ok) {
    const error = new Error(body.error?.message || 'OpenAI request failed');
    error.statusCode = response.status;
    throw error;
  }

  const parsed = extractJson(body.choices?.[0]?.message?.content || '');

  if (!parsed) {
    const error = new Error('OpenAI returned an invalid command');
    error.statusCode = 502;
    throw error;
  }

  return {
    intent: parsed.intent || 'unknown',
    tableId: parsed.tableId || null,
    items: Array.isArray(parsed.items)
      ? parsed.items.map((item) => ({
          itemName: item.itemName || null,
          quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
        }))
      : [],
    itemName: parsed.itemName || null,
    quantity: Number(parsed.quantity) > 0 ? Number(parsed.quantity) : 1,
    message: parsed.message || 'Command parsed.',
  };
}

async function transcribeAudio(file) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const error = new Error('OpenAI API key is not configured');
    error.statusCode = 503;
    throw error;
  }

  if (!file?.buffer) {
    const error = new Error('Audio file is required');
    error.statusCode = 400;
    throw error;
  }

  const form = new FormData();
  const blob = new Blob([file.buffer], { type: file.mimetype || 'audio/mp4' });

  form.append('file', blob, file.originalname || 'voice-order.m4a');
  form.append('model', process.env.OPENAI_TRANSCRIPTION_MODEL || 'gpt-4o-mini-transcribe');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  const body = await response.json();

  if (!response.ok) {
    const error = new Error(body.error?.message || 'OpenAI transcription failed');
    error.statusCode = response.status;
    throw error;
  }

  return body.text || '';
}

async function parseOrderCommand(req, res) {
  try {
    const command = await parseCommandWithOpenAI({
      transcript: req.body.transcript,
      menu: req.body.menu,
      tables: req.body.tables,
    });

    return res.status(200).json(command);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to parse voice command' });
  }
}

async function transcribeOrderCommand(req, res) {
  try {
    const transcript = await transcribeAudio(req.file);
    const menu = JSON.parse(req.body.menu || '[]');
    const tables = JSON.parse(req.body.tables || '[]');
    const command = await parseCommandWithOpenAI({ transcript, menu, tables });

    return res.status(200).json({
      transcript,
      ...command,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to transcribe voice order' });
  }
}

module.exports = {
  parseOrderCommand,
  transcribeOrderCommand,
};
