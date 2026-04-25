import { create } from 'zustand';

export type WorkerRole = 'chef' | 'server' | 'manager';
export type UserRole = 'owner' | WorkerRole;
export type OrderStatus = 'pending' | 'cooking' | 'completed';

export type Company = {
  id: string;
  name: string;
  ownerEmail: string;
};

export type WorkerInvite = {
  email: string;
  role: WorkerRole;
  specialties: string[];
  accepted: boolean;
};

export type CurrentUser = {
  id?: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  specialties: string[];
  token?: string;
};

export type KitchenOrder = {
  id: string;
  table: string;
  elapsed: string;
  server: string;
  status: OrderStatus;
  category: string;
  items: { qty: string; name: string; note?: string }[];
};

type AuthState = {
  companies: Company[];
  invites: WorkerInvite[];
  currentUser: CurrentUser | null;
  orders: KitchenOrder[];
  authError: string | null;
  setCurrentUserFromApi: (input: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      companyId: string;
      specialties?: string[];
    };
  }) => void;
  registerCompany: (input: { companyName: string; ownerName: string; ownerEmail: string }) => string;
  loginOwner: (input: { companyId: string; email: string }) => boolean;
  inviteWorker: (input: { email: string; role: WorkerRole; specialties: string[] }) => boolean;
  loginWorker: (input: { companyId: string; email: string; name: string }) => boolean;
  logout: () => void;
  createOrder: (input: {
    table: string;
    server: string;
    category: string;
    items: { qty: number; name: string; note?: string }[];
  }) => void;
  toggleSpecialty: (specialty: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  canAccess: (role: UserRole | undefined, route: 'order' | 'waiter' | 'kitchen' | 'manager' | 'workers') => boolean;
};

const seedCompany: Company = {
  id: 'DF-2040',
  name: 'Culinary Harmony',
  ownerEmail: 'owner@dineflow.test',
};

const seedInvites: WorkerInvite[] = [
  { email: 'chef@dineflow.test', role: 'chef', specialties: ['Burgers', 'Sandwiches'], accepted: true },
  { email: 'server@dineflow.test', role: 'server', specialties: [], accepted: true },
  { email: 'manager@dineflow.test', role: 'manager', specialties: [], accepted: true },
];

const seedOrders: KitchenOrder[] = [
  {
    id: '#2401',
    table: 'Table 12',
    elapsed: '18m elapsed',
    server: 'Server: Elena',
    status: 'pending',
    category: 'Burgers',
    items: [
      { qty: '2x', name: 'Wagyu Burger', note: 'Well Done' },
      { qty: '1x', name: 'Truffle Fries', note: 'No Salt' },
    ],
  },
  {
    id: '#2405',
    table: 'Table 04',
    elapsed: '08m elapsed',
    server: 'Server: Marcus',
    status: 'cooking',
    category: 'Steaks',
    items: [
      { qty: '1x', name: 'Pan-Seared Scallops' },
      { qty: '1x', name: 'Dry-Aged Ribeye', note: 'Medium Rare' },
    ],
  },
  {
    id: '#2408',
    table: 'Table 18',
    elapsed: '02m elapsed',
    server: 'Server: Sarah',
    status: 'pending',
    category: 'Sandwiches',
    items: [{ qty: '4x', name: 'Miso Club Sandwich' }],
  },
  {
    id: '#2399',
    table: 'Table 07',
    elapsed: 'Picked up',
    server: 'Server: Elena',
    status: 'completed',
    category: 'Salads',
    items: [{ qty: '1x', name: 'Caesar Salad' }],
  },
];

function makeCompanyId(companyName: string) {
  const compact = companyName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || 'DF';
  const number = Math.floor(1000 + Math.random() * 9000);

  return `${compact}-${number}`;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  companies: [seedCompany],
  invites: seedInvites,
  currentUser: null,
  orders: seedOrders,
  authError: null,
  setCurrentUserFromApi: ({ token, user }) =>
    set({
      currentUser: {
        id: user.id,
        companyId: user.companyId,
        email: user.email,
        name: user.name,
        role: user.role,
        specialties: user.specialties ?? [],
        token,
      },
      authError: null,
    }),
  registerCompany: ({ companyName, ownerName, ownerEmail }) => {
    const companyId = makeCompanyId(companyName);
    const company = { id: companyId, name: companyName, ownerEmail: ownerEmail.trim().toLowerCase() };

    set((state) => ({
      companies: [...state.companies, company],
      currentUser: {
        companyId,
        email: company.ownerEmail,
        name: ownerName.trim() || 'Company Owner',
        role: 'owner',
        specialties: [],
      },
      authError: null,
    }));

    return companyId;
  },
  loginOwner: ({ companyId, email }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const company = get().companies.find(
      (item) => item.id.trim().toLowerCase() === companyId.trim().toLowerCase() && item.ownerEmail === normalizedEmail,
    );

    if (!company) {
      set({ authError: 'Company owner not found for this Company ID.' });
      return false;
    }

    set({
      currentUser: {
        companyId: company.id,
        email: normalizedEmail,
        name: 'Company Owner',
        role: 'owner',
        specialties: [],
      },
      authError: null,
    });
    return true;
  },
  inviteWorker: ({ email, role, specialties }) => {
    const currentUser = get().currentUser;

    if (!currentUser || currentUser.role !== 'owner') {
      set({ authError: 'Only the company owner can add workers.' });
      return false;
    }

    const normalizedEmail = email.trim().toLowerCase();
    set((state) => ({
      invites: [
        ...state.invites.filter((invite) => invite.email !== normalizedEmail),
        { email: normalizedEmail, role, specialties, accepted: false },
      ],
      authError: null,
    }));
    return true;
  },
  loginWorker: ({ companyId, email, name }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const company = get().companies.find((item) => item.id.trim().toLowerCase() === companyId.trim().toLowerCase());
    const invite = get().invites.find((item) => item.email === normalizedEmail);

    if (!company || !invite) {
      set({ authError: 'This email has not been invited to that company.' });
      return false;
    }

    set((state) => ({
      invites: state.invites.map((item) => (item.email === normalizedEmail ? { ...item, accepted: true } : item)),
      currentUser: {
        companyId: company.id,
        email: normalizedEmail,
        name: name.trim() || normalizedEmail,
        role: invite.role,
        specialties: invite.specialties,
      },
      authError: null,
    }));
    return true;
  },
  logout: () => set({ currentUser: null, authError: null }),
  createOrder: ({ table, server, category, items }) =>
    set((state) => {
      const nextNumber =
        state.orders.reduce((max, order) => {
          const numericId = Number(order.id.replace(/[^0-9]/g, ''));
          return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
        }, 2408) + 1;

      return {
        orders: [
          {
            id: `#${nextNumber}`,
            table,
            elapsed: 'Just now',
            server,
            status: 'pending',
            category,
            items: items.map((item) => ({
              qty: `${item.qty}x`,
              name: item.name,
              note: item.note,
            })),
          },
          ...state.orders,
        ],
      };
    }),
  toggleSpecialty: (specialty) =>
    set((state) => {
      if (!state.currentUser || state.currentUser.role !== 'chef') {
        return state;
      }

      const hasSpecialty = state.currentUser.specialties.includes(specialty);
      const specialties = hasSpecialty
        ? state.currentUser.specialties.filter((item) => item !== specialty)
        : [...state.currentUser.specialties, specialty];

      return {
        currentUser: {
          ...state.currentUser,
          specialties,
        },
      };
    }),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    })),
  canAccess: (role, route) => {
    if (!role) {
      return false;
    }

    const permissions: Record<UserRole, AuthState['canAccess'] extends (r: UserRole | undefined, route: infer R) => boolean ? R[] : never> = {
      owner: ['manager', 'workers'],
      manager: ['manager'],
      chef: ['kitchen'],
      server: ['waiter', 'order'],
    };

    return permissions[role].includes(route);
  },
}));

export const specialtyOptions = ['Burgers', 'Sandwiches', 'Steaks', 'Seafood', 'Salads', 'Desserts'];
