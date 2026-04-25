const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000';

type ApiErrorBody = {
  message?: string;
};

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const body = (await response.json().catch(() => ({}))) as ApiErrorBody;

  if (!response.ok) {
    throw new Error(body.message ?? 'Request failed');
  }

  return body as T;
}

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'chef' | 'server' | 'manager';
    companyId: string;
    specialties: string[];
  };
};

export function loginCompanyRequest(input: { identifier: string; password: string }) {
  return request<AuthResponse>('/api/auth/company/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function loginWorkerRequest(input: { email: string; password: string }) {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function registerCompanyRequest(input: { email: string; password: string; confirmPassword: string; companyId: string }) {
  return request<AuthResponse>('/api/auth/company/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function inviteWorkerRequest(
  token: string,
  input: { email: string; role: 'chef' | 'server' | 'manager'; specialties: string[] },
) {
  return request<{ invite: { email: string; role: 'chef' | 'server' | 'manager'; specialties: string[]; accepted: boolean } }>(
    '/api/auth/workers/invite',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    },
  );
}

export function registerWorkerRequest(input: {
  companyId: string;
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}) {
  return request<AuthResponse>('/api/auth/workers/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export type VoiceOrderCommand = {
  intent: 'add' | 'remove' | 'clear' | 'send' | 'unknown';
  tableId?: string | null;
  itemName: string | null;
  items?: { itemName: string; quantity: number }[];
  quantity: number;
  message: string;
};

export function parseVoiceOrderCommandRequest(
  token: string,
  input: {
    transcript: string;
    menu: { name: string; category: string }[];
  },
) {
  return request<VoiceOrderCommand>('/api/voice/order-command', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
}

export function transcribeVoiceOrderRequest(
  token: string,
  input: {
    audioUri: string;
    menu: { name: string; category: string }[];
    tables: { id: string; label: string }[];
  },
) {
  const form = new FormData();

  form.append('audio', {
    uri: input.audioUri,
    name: 'voice-order.m4a',
    type: 'audio/mp4',
  } as unknown as Blob);
  form.append('menu', JSON.stringify(input.menu));
  form.append('tables', JSON.stringify(input.tables));

  return fetch(`${API_BASE_URL}/api/voice/transcribe-order`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  }).then(async (response) => {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;

    if (!response.ok) {
      throw new Error(body.message ?? 'Voice transcription failed');
    }

    return body as VoiceOrderCommand & { transcript: string };
  });
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
