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

async function parseOrderCommand(req, res) {
  const { transcript, menu } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({ message: 'OpenAI API key is not configured' });
  }

  const text = String(transcript || '').trim();
  const menuItems = normalizeMenu(menu);

  if (!text) {
    return res.status(400).json({ message: 'Transcript is required' });
  }

  try {
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
              'You parse restaurant voice order commands. Return only JSON with intent add, remove, clear, send, or unknown; itemName must exactly match a menu item when present; quantity must be a positive integer; message is a short waiter-facing confirmation.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              transcript: text,
              menu: menuItems,
              schema: {
                intent: 'add | remove | clear | send | unknown',
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
      return res.status(response.status).json({ message: body.error?.message || 'OpenAI request failed' });
    }

    const parsed = extractJson(body.choices?.[0]?.message?.content || '');

    if (!parsed) {
      return res.status(502).json({ message: 'OpenAI returned an invalid command' });
    }

    return res.status(200).json({
      intent: parsed.intent || 'unknown',
      itemName: parsed.itemName || null,
      quantity: Number(parsed.quantity) > 0 ? Number(parsed.quantity) : 1,
      message: parsed.message || 'Command parsed.',
    });
  } catch {
    return res.status(500).json({ message: 'Failed to parse voice command' });
  }
}

module.exports = {
  parseOrderCommand,
};
