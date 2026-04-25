import { MaterialIcons } from '@expo/vector-icons';
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder } from 'expo-audio';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  DineFlowColors as c,
  DineFlowFontFamily,
  DineFlowRadius as r,
  DineFlowShadows,
  DineFlowSpacing as s,
  DineFlowTypography as t,
} from '@/constants/theme';
import { specialtyOptions, useAuthStore, WorkerRole } from '@/store/auth';
import {
  getApiBaseUrl,
  inviteWorkerRequest,
  loginCompanyRequest,
  loginWorkerRequest,
  parseVoiceOrderCommandRequest,
  registerCompanyRequest,
  registerWorkerRequest,
  transcribeVoiceOrderRequest,
} from '@/utils/api';

const red = '#d94624';
const primary = '#84000a';
const bg = '#f9f9f9';
const lowBg = '#f3f3f3';
const profile =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBCKc9gszxvUbfeo5A2g0ul8rrdmi2zooh6OHrQ-HbB1ofZED0mXB5tw7UDPEYjHcf9RH3sOKDGouJXjYm04iy_HmrYJHpPbhnPprRxALuIS76NtTR1-US8G5FkfOcOnq9rAGqqgJzKfpWEPIcIFFQWi0j0aQyJ1OuViEvFQBl4DT53Fo4HI7NI1HxSy4JtAVcMmK4U92LT17Z4jd3ZzOqDmLz1jlRxGJLif9Y2o3FrfbKPpQ1to3eeFpa-GCOH_304jOWnFmuy0k4';

const menuImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBASkrZiadZXR3-WzLCoTPSwZ_0U6YpoAqO86WQ9CPS4qwp_6yWsdhSkh6_8mcNY5TutSNYCa_iEHUSqh96aiFj9Bv8rvZ1sm8zunGpsAgpJn5N9cOQ_pdOLfMcBLCQRmb7tCy63CAqWVN8uzqXGyJIS5CmCMOlLmrvw2IAcx9NIyBNKB0XcJL0ZhlE1I3vux4apEoUmiaD2NpiiJLvaETYcoMVyaA8tzNf98mQjdda9bCyQcN5Hn0gRKHYRyfwITrZmN6QeLAww9s',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDi5gSPTRfi_p9-J3NfN-nqGUbkJFP5TWIGDQpU_JwyYTTa5uh37ur2zsSvoUOLTAsF6KJPOnzNpmW-RY8EIYi2hqASJ4lZPRvMWHvBZjLRolv-Ye9uwyE_oQp1vhF9_TnOvJiEL2OwZ77MA3AY2VDHbF4Q9meZ0aRGM0TA2RWU4WGgF40Ng9y3ZU6IQUZaYkMF-eq-5ixQLVG2ivlj1bIpIgSOfIVqnVk9gaQdRlzVGr1JdsPFvnxpEfOOyQgjXVY5NePxGAIz4Ko',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDBm94NuHC3d66fe_KUGEn7q84hOQSX_awGwtCjzkXQsJN8umKF0WLUjuzKiwbAQM56M3MrSxkA8SqK4qBmS7NQdYko-ALKyyR4dvOHzRXVpfYT7qo0PTQUo-q4UOpGvqJb6-I9F2vsayy3o3gztoWNFF_4uwQrXdwQmrHnGldRRFZBIW3i_N_Qo9pjmmCpQJZbzgLOXje97mO3v-qPHAFeX50sUnylMOUVFNP3muA4EKV4uF5ktWzYA5B6D5c7HRSH8-J3c7ApMqM',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB-QH1zGVu6-0uu6qbO42l58bmCZtwPhlL2iyWYyyxFjxyvPoxyCxkzP4BKzpZLFKfUtGyu401u8RJBryQlkAl_DLE4x9ZK3Ci7PHJQw9vm2dXa7xomhU_2xgytZ2DfOkH55eJYrdNvDub0NZQnGiv7JVABuT69OlzBH-EdGbHe7AdoexwCD0fs1VCk1MHCAneT5mzt6Yl4J--ycZGQR_bxqyp98VRxW4hzgJVaRkoiVsOQ_-7l1r-8v6lpC1ykoldZPCB0q_R6NPo',
];

const specialDish =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCpSrjoy82VBPuaKiGOhJb8OCydEkiftG4e-w9BONHZjj9BdIZm99LeNfzPTSnrPHO9d-573_8Y5xJn0U0DVjcoQoXm4vIPZ6r6Fm6WUW3l3Baa7gjQRqD8sLeA07HeOiu865EMEVpO8ZTvKbWGWjtXk6i5WLMcwfv-LwlyKTzWvHG5wPFkpzqTP_lBTXjN6C1Rbwb6MqhABU_ZCpO-tLCNW4DrUpgq5pH_J3mRFyRMBECjl09V87fjXjxii_qG4HNoQ-xEURHOpDI';

const popularImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB2Rz5C2vd-h73pklrYU24KBFKA-_DbDlRgSE7jjdeCDUjIZ8cgLox2dBlHfFH1_rGjiPm-O2rFZZsyaWgqUj3uPHFbq-FDiRzzwkEK_gjkXwdcOnjgyiKPXlfspYYaBGdpmHyZ32sXWRh9rSfHpc37e3AK7nPS4eQSK_DQbNzfVpqwl2bZav2IFCk3dFs1B0RFGqphJvu-bTLY5dbPw2QGykf4_4q-J_BrT2DoFtsNQqM8j4Aii-hT_Pbt9ZZNyqia8775E1sFbak',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA6hSSbfFUyG559TqS7oAUFTwUfa8DKAnwqmMRZy6s6bwhgQOEiUYJbLsVYQPiVdaBIfDuWLuAy65gGfXTqLCj8iiN9mTkbho71VBGP1wmD4vH8hSp1AW60myVTSjlUs0aNUjIUl_u2PsLUeQEpOu7oDJa5vrGZwAsxzEiMbg1OhiVyCNeoo8ZackifFAToO7N6BjOB51epho-DYgaDaM52K7W5gb-dkeEom6fpSyCKfuvlGug3SUBhv5SuR25W_vhlfl-CsFEf3qs',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB7a7DFIqSKahwq4BjxuVcyr2854wwDzADUmJ1FhGRAet7WGVEwSK8xNaUT3vIvLjCzG0hj2Jx3J0A2DttcPJCl_VBBctyF1KtG22dt5LuIL-aJKq55awAjRjQxBdkjVbGK4K2Ks4il55ueoWW4zzIHe7d0teiqdXaq7mfRV4OipcRqqqVJ9Pw7WscH1iaOvc4v5xd6JIGyz-la1UnQJbyUWHkkuzlVXaab1sZR4cA9zKoJxf0sKeCpyXVLruh3LxbRIrm7lqB3asw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBUTE2lEAZL6-DDMo4UVMZKVGd3GDmtbj0Z8qpNN9B1vC_ijk0kWIhVXNPhO8ovPgrR75TI14IIECePaUVSQB8Y9VMPcMkl-tzUxrhIRPf7dPDsg9_naylhw-4f2GRQQQ_1MRVLoAIQ0w3Iu9MtQJrIN2JJYmIYXmXm-RnRhv3xIe0unOKsU_rdFMLuQUQateuywVvskOnGN2lU4mLIFsesqR5cISjEcswlBZTwAFaFxKlOvpY1J8fIXLmj8QhybVT9Rb4QRj0iwJk',
];

type NavKey = 'order' | 'waiter' | 'kitchen' | 'manager' | 'workers';

const navItems: { key: NavKey; icon: keyof typeof MaterialIcons.glyphMap; href: string }[] = [
  { key: 'order', icon: 'restaurant-menu', href: '/order' },
  { key: 'waiter', icon: 'table-restaurant', href: '/waiter' },
  { key: 'kitchen', icon: 'receipt-long', href: '/kitchen' },
  { key: 'manager', icon: 'dashboard', href: '/manager' },
  { key: 'workers', icon: 'group-add', href: '/workers' },
];

function DIcon({
  name,
  size = 24,
  color = c.textPrimary,
}: {
  name: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color?: string;
}) {
  return <MaterialIcons name={name} size={size} color={color} />;
}

function ScreenShell({
  children,
  active,
  backgroundColor = bg,
  contentStyle,
  noTopPad,
}: PropsWithChildren<{
  active?: NavKey;
  backgroundColor?: string;
  contentStyle?: StyleProp<ViewStyle>;
  noTopPad?: boolean;
}>) {
  return (
    <SafeAreaView style={[styles.shell, { backgroundColor }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, noTopPad && styles.noTopPad, contentStyle]}>
        {children}
      </ScrollView>
      {active ? <BottomNav active={active} /> : null}
    </SafeAreaView>
  );
}

function BottomNav({ active }: { active: NavKey }) {
  const user = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const canAccess = useAuthStore((state) => state.canAccess);
  const [profileOpen, setProfileOpen] = useState(false);
  const visibleItems = navItems.filter((item) => canAccess(user?.role, item.key));

  const openVoiceOrder = () => {
    router.push({
      pathname: '/order',
      params: { voice: String(Date.now()) },
    } as never);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    router.replace('/login' as never);
  };

  return (
    <View style={styles.bottomNav}>
      {visibleItems.map((item) => {
        const selected = item.key === active;

        return (
          <Pressable
            key={item.key}
            onPress={() => router.push(item.href as never)}
            style={[styles.navItem, selected && styles.navItemActive]}>
            <DIcon name={item.icon} color={selected ? '#ffffff' : '#475569'} size={25} />
            {selected && <Text style={styles.navLabel}>{item.key === 'order' ? 'Home' : item.key.charAt(0).toUpperCase() + item.key.slice(1)}</Text>}
          </Pressable>
        );
      })}
      {user?.role === 'server' ? (
        <Pressable
          accessibilityLabel="Open voice ordering"
          accessibilityRole="button"
          hitSlop={12}
          onPress={openVoiceOrder}
          style={[styles.navItem, styles.navVoiceItem]}
          testID="server-voice-order-button">
          <DIcon name="mic" color="#ffffff" size={25} />
        </Pressable>
      ) : null}
      <Pressable
        onPress={() => setProfileOpen(true)}
        style={[styles.navItem, styles.profileNavItem]}>
        {user ? (
          <Image source={{ uri: profile }} style={styles.miniAvatar} contentFit="cover" />
        ) : (
          <DIcon name="person-outline" color="#475569" size={25} />
        )}
      </Pressable>
      <ProfileModal
        visible={profileOpen}
        onClose={() => setProfileOpen(false)}
        onLogout={handleLogout}
        user={user}
      />
    </View>
  );
}

function ProfileModal({
  visible,
  onClose,
  onLogout,
  user,
}: {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: any;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.profileModalOverlay} onPress={onClose}>
        <Animated.View entering={FadeInDown.duration(300)} style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatarContainer}>
              <Image source={{ uri: profile }} style={styles.largeAvatar} />
              <Pressable style={styles.editAvatarBadge}>
                <DIcon name="edit" size={12} color="#ffffff" />
              </Pressable>
            </View>
            <Text style={styles.profileName}>{user?.name || 'Worker'}</Text>
            <Text style={styles.profileRole}>{user?.role?.toUpperCase() || 'Member'}</Text>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailRow}>
              <DIcon name="email" size={18} color={c.textSecondary} />
              <Text style={styles.detailText}>{user?.email || 'No email'}</Text>
            </View>
            <View style={styles.detailRow}>
              <DIcon name="business" size={18} color={c.textSecondary} />
              <Text style={styles.detailText}>ID: {user?.companyId || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.profileActions}>
            <Pressable style={styles.actionItem} onPress={() => {}}>
              <DIcon name="image" size={20} color={c.textPrimary} />
              <Text style={styles.actionText}>Change Image</Text>
            </Pressable>
            <Pressable style={styles.actionItem} onPress={() => {}}>
              <DIcon name="lock-reset" size={20} color={c.textPrimary} />
              <Text style={styles.actionText}>Reset Password</Text>
            </Pressable>
            <View style={styles.actionDivider} />
            <Pressable style={[styles.actionItem, styles.logoutAction]} onPress={onLogout}>
              <DIcon name="logout" size={20} color={red} />
              <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

function TopBar({
  title,
  titleColor = c.textPrimary,
  showBack,
}: {
  title: string;
  titleColor?: string;
  showBack?: boolean;
}) {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        {showBack ? (
          <Pressable style={styles.backCircle} onPress={() => (router.canGoBack() ? router.back() : router.replace('/waiter' as never))}>
            <DIcon name="arrow-back" color={red} />
          </Pressable>
        ) : (
          <View style={styles.brandMark}>
            <DIcon name="restaurant" color={red} size={22} />
          </View>
        )}
        <Text style={[styles.topTitle, { color: titleColor }]}>{title}</Text>
      </View>
      <View style={styles.topRight}>
        <Pressable style={styles.notifIcon}>
          <DIcon name="notifications-none" color={c.textPrimary} size={24} />
          <View style={styles.notifDot} />
        </Pressable>
      </View>
    </View>
  );
}

function ProtectedScreen({
  route,
  children,
}: PropsWithChildren<{ route: 'order' | 'waiter' | 'kitchen' | 'manager' | 'workers' }>) {
  const user = useAuthStore((state) => state.currentUser);
  const canAccess = useAuthStore((state) => state.canAccess);

  if (!user) {
    return <AccessNotice title="Login required" body="Use your Company ID and invited email to continue." action="Go to Login" href="/login" />;
  }

  if (!canAccess(user.role, route)) {
    return (
      <AccessNotice
        title="Limited access"
        body={`Your ${user.role} account does not have permission to open this workspace.`}
        action="Open My Workspace"
        href={homeForRole(user.role)}
      />
    );
  }

  return <>{children}</>;
}

function homeForRole(role: string) {
  if (role === 'chef') return '/kitchen';
  if (role === 'server') return '/waiter';
  if (role === 'manager' || role === 'owner') return '/manager';
  return '/login';
}

function AccessNotice({ title, body, action, href }: { title: string; body: string; action: string; href: string }) {
  return (
    <ScreenShell backgroundColor={bg} contentStyle={styles.authScroll}>
      <View style={styles.loginMark}>
        <DIcon name="lock" color={red} size={44} />
      </View>
      <Text style={styles.authTitle}>{title}</Text>
      <Text style={styles.authSubtitle}>{body}</Text>
      <Pressable style={[styles.authButton, styles.accessButton]} onPress={() => router.replace(href as never)}>
        <Text style={styles.primaryButtonText}>{action}</Text>
      </Pressable>
    </ScreenShell>
  );
}

function Chip({ label, active }: { label: string; active?: boolean }) {
  return (
    <Pressable style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}>
      <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextIdle]}>{label}</Text>
    </Pressable>
  );
}

function SoftCard({
  children,
  style,
  enteringIndex = 0,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle>; enteringIndex?: number }>) {
  return (
    <Animated.View
      entering={FadeInDown.delay(enteringIndex * 60).duration(260)}
      layout={LinearTransition.duration(180)}
      style={[styles.softCard, style]}>
      {children}
    </Animated.View>
  );
}

function StatusPill({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'soft' | 'alert' | 'ready' }) {
  const colors = {
    neutral: ['#e8e8e8', c.textSecondary],
    soft: ['#ffdada', '#84222e'],
    alert: ['#ffdad6', '#93000a'],
    ready: ['#d1fae5', '#065f46'],
  } as const;
  const [backgroundColor, color] = colors[tone];

  return (
    <View style={[styles.statusPill, { backgroundColor }]}>
      <Text style={[styles.statusText, { color }]}>{label}</Text>
    </View>
  );
}

const tables = [
  {
    id: 'T-12',
    meta: 'Window Side • 4 Seats',
    status: 'Active',
    tone: 'soft' as const,
    title: '3 Orders',
    subtitle: 'Main Course Prep',
    action: 'New Order',
    icon: 'add-circle' as const,
    avatars: ['A', 'B', '+1'],
  },
  {
    id: 'T-05',
    meta: 'Terrace • 2 Seats',
    status: 'Free',
    tone: 'neutral' as const,
    title: 'Available for seating',
    subtitle: '',
    action: 'Assign Guests',
    icon: 'person-add' as const,
  },
  {
    id: 'T-18',
    meta: 'Main Hall • 6 Seats',
    status: 'Waiting',
    tone: 'alert' as const,
    title: 'Needs Attention',
    subtitle: 'Checks Requested',
    action: 'Print Bill',
    icon: 'receipt-long' as const,
    alert: 'timer' as const,
  },
  {
    id: 'T-01',
    meta: 'Corner • 4 Seats',
    status: 'Delayed',
    tone: 'alert' as const,
    title: '15m Overdue',
    subtitle: 'Kitchen Alert',
    action: 'Check Status',
    icon: 'priority-high' as const,
    alert: 'warning' as const,
  },
  {
    id: 'T-09',
    meta: 'Bar Area • 2 Seats',
    status: 'Active',
    tone: 'soft' as const,
    title: '1 Order',
    subtitle: 'Dessert Served',
    action: 'New Order',
    icon: 'add-circle' as const,
    avatars: ['C'],
  },
  {
    id: 'T-22',
    meta: 'Upper Deck • 8 Seats',
    status: 'Active',
    tone: 'soft' as const,
    title: '6 Orders',
    subtitle: 'Starters Ready',
    action: 'Serve Food',
    icon: 'restaurant' as const,
    avatars: ['JP', 'ML'],
  },
];

export function WaiterDashboardScreen() {
  return (
    <ProtectedScreen route="waiter">
      <ScreenShell active="waiter" backgroundColor={bg}>
        <TopBar title="Welcome back, Server" titleColor={red} />
        <View style={styles.section}>
          <Text style={styles.displayTitle}>Manage Your Tables</Text>
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <DIcon name="search" color={c.outline} />
              <TextInput placeholder="Search tables or servers..." placeholderTextColor={c.border} style={styles.searchInput} />
            </View>
            <Pressable style={styles.filterButton}>
              <DIcon name="tune" color="#ffffff" />
            </Pressable>
          </View>
        </View>
        <SoftCard style={styles.aiStatusCard}>
          <View style={styles.insightHeader}>
            <View style={styles.sparkIcon}>
              <DIcon name="auto-awesome" color={red} />
            </View>
            <Text style={styles.insightLabel}>AI service prediction</Text>
          </View>
          <Text style={styles.insightBody}>
            Table 12 has a likely 9 minute prep delay. Let guests know before placing the next round.
          </Text>
        </SoftCard>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroller}>
          {['All', 'Free', 'Active', 'Waiting', 'Delayed'].map((label, index) => (
            <Chip key={label} label={label} active={index === 0} />
          ))}
        </ScrollView>
        <View style={styles.cardGrid}>
          {tables.map((table, index) => (
            <TableCard
              key={table.id}
              table={table}
              index={index}
              onAction={() => router.push({ pathname: '/order', params: { tableId: table.id } } as never)}
            />
          ))}
        </View>
      </ScreenShell>
    </ProtectedScreen>
  );
}

function TableCard({ table, index, onAction }: { table: (typeof tables)[number]; index: number; onAction?: () => void }) {
  return (
    <SoftCard enteringIndex={index} style={[table.status === 'Delayed' && styles.leftError, table.status === 'Waiting' && styles.leftCoral]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.headline}>{table.id}</Text>
          <Text style={styles.labelMuted}>{table.meta}</Text>
        </View>
        <StatusPill label={table.status} tone={table.tone} />
      </View>
      <View style={styles.tableBody}>
        {table.avatars ? (
          <View style={styles.avatarStack}>
            {table.avatars.map((avatar, idx) => (
              <View key={`${table.id}-${avatar}`} style={[styles.initialAvatar, idx > 0 && styles.initialOverlap]}>
                <Text style={styles.initialText}>{avatar}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.alertIcon, table.status === 'Delayed' && styles.alertIconHot]}>
            <DIcon name={table.alert ?? 'timer'} color={table.status === 'Delayed' ? '#ffffff' : '#93000a'} />
          </View>
        )}
        <View style={styles.flexOne}>
          <Text style={[styles.boldLabel, table.status === 'Delayed' && styles.errorText]}>{table.title}</Text>
          {table.subtitle ? <Text style={[styles.smallLabel, table.status !== 'Free' && styles.secondaryText]}>{table.subtitle}</Text> : null}
        </View>
      </View>
      <Pressable style={styles.primaryButton} onPress={onAction}>
        <DIcon name={table.icon} color="#ffffff" size={20} />
        <Text style={styles.primaryButtonText}>{table.action}</Text>
      </Pressable>
    </SoftCard>
  );
}

const menu = [
  { category: 'Burgers', label: 'BURGER', name: 'Cheese Burger', price: '$12.00', amount: 12 },
  { category: 'Burgers', label: 'BURGER', name: 'Chicken Burger', price: '$11.50', amount: 11.5 },
  { category: 'Burgers', label: 'BURGER', name: 'Spicy Beef Burger', price: '$13.50', amount: 13.5 },
  { category: 'Sandwiches', label: 'SANDWICH', name: 'Club Sandwich', price: '$10.00', amount: 10 },
  { category: 'Sandwiches', label: 'SANDWICH', name: 'Chicken Sandwich', price: '$9.50', amount: 9.5 },
  { category: 'Sandwiches', label: 'SANDWICH', name: 'Veg Sandwich', price: '$8.00', amount: 8 },
  { category: 'Sides', label: 'SIDES', name: 'French Fries', price: '$5.00', amount: 5 },
  { category: 'Sides', label: 'SIDES', name: 'Cheese Fries', price: '$6.50', amount: 6.5 },
  { category: 'Drinks', label: 'DRINKS', name: 'Fresh Lime', price: '$4.00', amount: 4 },
  { category: 'Drinks', label: 'DRINKS', name: 'Mint Lime', price: '$4.50', amount: 4.5 },
  { category: 'Drinks', label: 'DRINKS', name: 'Pineapple Mojito', price: '$6.00', amount: 6 },
  { category: 'Drinks', label: 'DRINKS', name: 'Orange Mojito', price: '$6.00', amount: 6 },
];

type CartItem = (typeof menu)[number] & {
  qty: number;
};

type VoiceDraftItem = (typeof menu)[number] & {
  qty: number;
};

type VoiceStage = 'idle' | 'recording' | 'review';

const numberWords: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

const voiceAliases: Record<string, string[]> = {
  'Cheese Burger': ['cheeseburger', 'cheese burgers', 'cheeseburgers'],
  'Chicken Burger': ['chicken burgers'],
  'Spicy Beef Burger': ['spicy burger', 'beef burger', 'beef burgers'],
  'Club Sandwich': ['club sandwiches'],
  'Chicken Sandwich': ['chicken sandwiches'],
  'Veg Sandwich': ['veg sandwiches', 'vegetable sandwich', 'vegetable sandwiches'],
  'French Fries': ['french fry'],
  'Cheese Fries': ['cheesy fries', 'cheese fry'],
  'Fresh Lime': ['fresh lime soda', 'fresh limes'],
  'Mint Lime': ['mint limes'],
  'Pineapple Mojito': ['pine apple mojito', 'pinaple mojito', 'pineapple mojitos', 'pinapple mojito'],
  'Orange Mojito': ['orange mojitos'],
};

const voiceExamples = [
  'two cheese burgers and one fresh lime to table one',
  'one club sandwich and two pineapple mojito to table twelve',
  'two french fries and one chicken burger to table five',
];

export function OrderCreationScreen() {
  const params = useLocalSearchParams<{ voice?: string; tableId?: string }>();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(params.tableId || null);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState('Try: "add two Caprese Salad" or "send order".');
  const [voiceStage, setVoiceStage] = useState<VoiceStage>('idle');
  const [voiceDraft, setVoiceDraft] = useState<VoiceDraftItem[]>([]);
  const [voiceDraftTableId, setVoiceDraftTableId] = useState<string | null>(null);
  const [lastVoiceParam, setLastVoiceParam] = useState<string | null>(null);
  const voiceTranscriptRef = useRef('');
  const browserSpeechRef = useRef<{ stop: () => void } | null>(null);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const selectedTable = tables.find((table) => table.id === selectedTableId);
  const currentUser = useAuthStore((state) => state.currentUser);
  const createOrder = useAuthStore((state) => state.createOrder);
  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.qty * item.amount, 0);

  useEffect(() => {
    const voiceParam = Array.isArray(params.voice) ? params.voice[0] : params.voice;

    if (voiceParam && voiceParam !== lastVoiceParam) {
      setLastVoiceParam(voiceParam);
      void startVoiceAgent();
    }
  }, [params.voice, lastVoiceParam]);

  const updateCart = (item: (typeof menu)[number], delta: number) => {
    setCart((current) => {
      const existing = current[item.name];
      const nextQty = Math.max((existing?.qty ?? 0) + delta, 0);
      const next = { ...current };

      if (nextQty === 0) {
        delete next[item.name];
      } else {
        next[item.name] = { ...item, qty: nextQty };
      }

      return next;
    });
  };

  const setDraftQuantity = (itemName: string, delta: number) => {
    setVoiceDraft((current) =>
      current
        .map((item) => (item.name === itemName ? { ...item, qty: Math.max(item.qty + delta, 0) } : item))
        .filter((item) => item.qty > 0),
    );
  };

  const removeDraftItem = (itemName: string) => {
    setVoiceDraft((current) => current.filter((item) => item.name !== itemName));
  };

  const updateVoiceTranscript = (value: string) => {
    voiceTranscriptRef.current = value;
    setVoiceTranscript(value);
  };

  const normalizeVoiceText = (value: string) =>
    value
      .toLowerCase()
      .replace(/pinapple|pinaple|pine apple/g, 'pineapple')
      .replace(/chesse/g, 'cheese')
      .replace(/burgar/g, 'burger')
      .replace(/mojitoes/g, 'mojitos')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => (word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word))
      .join(' ');

  const voiceNamesForItem = (itemName: string) => [itemName, ...(voiceAliases[itemName] ?? [])].map(normalizeVoiceText);

  const containsVoicePhrase = (text: string, phrase: string) => new RegExp(`(^|\\s)${phrase.replace(/\s+/g, '\\s+')}(\\s|$)`).test(text);

  const findMenuItemByVoiceName = (itemName?: string | null) => {
    if (!itemName) {
      return null;
    }

    const normalizedName = normalizeVoiceText(itemName);

    return (
      menu
        .map((item) => ({
          item,
          matchedName: voiceNamesForItem(item.name)
            .sort((a, b) => b.length - a.length)
            .find((name) => name === normalizedName || containsVoicePhrase(normalizedName, name)),
        }))
        .filter((match): match is { item: (typeof menu)[number]; matchedName: string } => Boolean(match.matchedName))
        .sort((a, b) => b.matchedName.length - a.matchedName.length)[0]?.item ?? null
    );
  };

  const normalizeTableId = (tableId?: string | null) => {
    if (!tableId) {
      return null;
    }

    const direct = tables.find((table) => table.id.toLowerCase() === tableId.toLowerCase());

    if (direct) {
      return direct.id;
    }

    const tableNumber = tableId.match(/\d+/)?.[0];

    if (!tableNumber) {
      return null;
    }

    const normalized = `T-${String(Number(tableNumber)).padStart(2, '0')}`;
    return tables.some((table) => table.id === normalized) ? normalized : null;
  };

  const applyParsedVoiceCommand = (command: {
    transcript?: string;
    tableId?: string | null;
    itemName?: string | null;
    quantity?: number;
    items?: { itemName: string | null; quantity: number }[];
    message?: string;
  }) => {
    const commandItems = command.items?.length
      ? command.items
      : command.itemName
        ? [{ itemName: command.itemName, quantity: command.quantity ?? 1 }]
      : [];
    const draftItems = commandItems
      .map((commandItem) => {
        const matchedItem = findMenuItemByVoiceName(commandItem.itemName);
        return matchedItem ? { ...matchedItem, qty: Math.max(commandItem.quantity || 1, 1) } : null;
      })
      .filter((item): item is VoiceDraftItem => Boolean(item));

    if (command.transcript) {
      updateVoiceTranscript(command.transcript);
    }

    setVoiceDraft(draftItems);
    setVoiceDraftTableId(normalizeTableId(command.tableId));
    setVoiceStage('review');
    setVoiceFeedback(
      command.message ||
        (draftItems.length > 0
          ? `${draftItems.length} item${draftItems.length === 1 ? '' : 's'} found.`
          : 'No menu items found. Edit the text and parse again.'),
    );
  };

  const localTableFromTranscript = (spokenText = voiceTranscript) => {
    const text = spokenText.trim().toLowerCase();
    const tableMatch = text.match(/\btable\s+([a-z]+|\d+)\b/);

    if (!tableMatch) {
      return null;
    }

    const tableValue = numberWords[tableMatch[1]] ?? Number(tableMatch[1]);

    if (!Number.isFinite(tableValue)) {
      return null;
    }

    return `T-${String(tableValue).padStart(2, '0')}`;
  };

  const localDraftFromTranscript = (spokenText = voiceTranscript) => {
    const text = spokenText.trim().toLowerCase();

    if (!text) {
      setVoiceFeedback('Say or type an order command first.');
      return [];
    }

    const normalizedText = normalizeVoiceText(text);
    const matchedItems = menu
      .map((item) => ({
        item,
        matchedName: voiceNamesForItem(item.name)
          .sort((a, b) => b.length - a.length)
          .find((name) => containsVoicePhrase(normalizedText, name)),
      }))
      .filter((match): match is { item: (typeof menu)[number]; matchedName: string } => Boolean(match.matchedName))
      .sort((a, b) => normalizedText.indexOf(a.matchedName) - normalizedText.indexOf(b.matchedName));

    if (matchedItems.length === 0) {
      setVoiceFeedback(`Could not match "${spokenText}" to a menu item.`);
      return [];
    }

    return matchedItems.map(({ item, matchedName }) => {
      const itemIndex = normalizedText.indexOf(matchedName);
      const beforeItem = normalizedText.slice(Math.max(0, itemIndex - 32), itemIndex);
      const quantityMatch = beforeItem.match(/\b\d+\b/g);
      const wordQuantity = Object.entries(numberWords)
        .reverse()
        .find(([word]) => beforeItem.includes(word));
      const quantity = quantityMatch?.length ? Number(quantityMatch[quantityMatch.length - 1]) : wordQuantity ? wordQuantity[1] : 1;

      return { ...item, qty: quantity };
    });
  };

  const reviewVoiceTranscript = async (spokenText = voiceTranscript) => {
    const text = spokenText.trim();

    if (!text) {
      setVoiceFeedback('Say or type an order command first.');
      setVoiceStage('review');
      return;
    }

    if (currentUser?.token) {
      try {
        const command = await parseVoiceOrderCommandRequest(currentUser.token, {
          transcript: text,
          menu: menu.map((item) => ({ name: item.name, category: item.category })),
          tables: tables.map((table) => ({ id: table.id, label: `${table.id} ${table.meta}` })),
        });

        if (command.items?.length || command.itemName) {
          applyParsedVoiceCommand(command);
          return;
        }
      } catch {
        setVoiceFeedback('Using local voice command matching.');
      }
    }

    const draftItems = localDraftFromTranscript(text);
    setVoiceDraft(draftItems);
    setVoiceDraftTableId(localTableFromTranscript(text));
    setVoiceStage('review');
    setVoiceFeedback(draftItems.length > 0 ? `${draftItems.length} item${draftItems.length === 1 ? '' : 's'} found.` : 'No menu items found. Edit the text and parse again.');
  };

  const addVoiceDraftToCart = () => {
    voiceDraft.forEach((item) => updateCart(item, item.qty));
    if (voiceDraftTableId) {
      setSelectedTableId(voiceDraftTableId);
    }
    setVoiceStage('idle');
    setVoiceOpen(false);
    setVoiceDraft([]);
    setVoiceDraftTableId(null);
    updateVoiceTranscript('');
    setVoiceFeedback('Voice items added to cart.');
  };

  const stopVoiceRecording = async () => {
    try {
      const fallbackTranscript = voiceTranscriptRef.current.trim();

      browserSpeechRef.current?.stop();
      browserSpeechRef.current = null;

      if (voiceListening) {
        await audioRecorder.stop();
      }
      setVoiceListening(false);
      setVoiceFeedback('Transcribing voice order...');

      const audioUri = audioRecorder.uri;

      if (!audioUri || !currentUser?.token) {
        if (fallbackTranscript) {
          await reviewVoiceTranscript(fallbackTranscript);
          return;
        }

        setVoiceStage('review');
        setVoiceFeedback('Recording saved, but transcription needs a logged-in worker and audio file.');
        return;
      }

      const command = await transcribeVoiceOrderRequest(currentUser.token, {
        audioUri,
        menu: menu.map((item) => ({ name: item.name, category: item.category })),
        tables: tables.map((table) => ({ id: table.id, label: `${table.id} ${table.meta}` })),
      });

      if (command.items?.length || command.itemName) {
        applyParsedVoiceCommand(command);
        return;
      }

      await reviewVoiceTranscript(command.transcript || fallbackTranscript);
    } catch (error) {
      const fallbackTranscript = voiceTranscriptRef.current.trim();

      setVoiceListening(false);
      if (fallbackTranscript) {
        await reviewVoiceTranscript(fallbackTranscript);
        return;
      }

      setVoiceStage('review');
      setVoiceFeedback(error instanceof Error ? error.message : 'Could not transcribe the recording. Type the order and parse it.');
    }
  };

  const startBrowserSpeechFallback = (parseOnResult = true) => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (
            window as typeof window & {
              SpeechRecognition?: new () => {
                continuous: boolean;
                interimResults: boolean;
                lang: string;
                start: () => void;
                stop: () => void;
                onresult: ((event: { results: { [key: number]: { [key: number]: { transcript: string } } }; resultIndex: number }) => void) | null;
                onerror: (() => void) | null;
                onend: (() => void) | null;
              };
              webkitSpeechRecognition?: new () => {
                continuous: boolean;
                interimResults: boolean;
                lang: string;
                start: () => void;
                stop: () => void;
                onresult: ((event: { results: { [key: number]: { [key: number]: { transcript: string } } }; resultIndex: number }) => void) | null;
                onerror: (() => void) | null;
                onend: (() => void) | null;
              };
            }
          ).SpeechRecognition ??
          (
            window as typeof window & {
              webkitSpeechRecognition?: new () => {
                continuous: boolean;
                interimResults: boolean;
                lang: string;
                start: () => void;
                stop: () => void;
                onresult: ((event: { results: { [key: number]: { [key: number]: { transcript: string } } }; resultIndex: number }) => void) | null;
                onerror: (() => void) | null;
                onend: (() => void) | null;
              };
            }
          ).webkitSpeechRecognition
        : undefined;

    if (!SpeechRecognition) {
      setVoiceListening(false);
      setVoiceStage('review');
      setVoiceFeedback('Voice recording is not available here. Type the order and parse it.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';
    recognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex][0].transcript;

      if (parseOnResult) {
        updateVoiceTranscript(transcript);
        setVoiceListening(false);
        void reviewVoiceTranscript(transcript);
      } else {
        voiceTranscriptRef.current = transcript;
        setVoiceFeedback('Audio is recording in English. Tap Stop & Review when finished.');
      }
    };
    recognition.onerror = () => {
      if (parseOnResult) {
        setVoiceListening(false);
        setVoiceStage('review');
        setVoiceFeedback('I could not hear that. Type the order and parse it.');
      }
    };
    recognition.onend = () => {
      if (browserSpeechRef.current === recognition) {
        browserSpeechRef.current = null;
      }

      if (parseOnResult) {
        setVoiceListening(false);
      }
    };
    browserSpeechRef.current = recognition;
    setVoiceListening(true);
    setVoiceFeedback(parseOnResult ? 'Listening with browser speech...' : 'Recording audio and listening for speech...');
    recognition.start();
  };

  const startVoiceAgent = async () => {
    setVoiceOpen(true);
    setVoiceStage('recording');
    setVoiceDraft([]);
    setVoiceDraftTableId(null);
    setVoiceFeedback('Listening...');

    try {
      const permission = await requestRecordingPermissionsAsync();

      if (!permission.granted) {
        setVoiceListening(false);
        setVoiceStage('review');
        setVoiceFeedback('Microphone permission was denied. Type the order and parse it.');
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setVoiceListening(true);
      startBrowserSpeechFallback(false);
    } catch (error) {
      setVoiceFeedback(error instanceof Error ? `Recorder unavailable: ${error.message}` : 'Recorder unavailable. Trying browser speech.');
      startBrowserSpeechFallback();
    }
  };

  const sendOrder = () => {
    if (!selectedTable || cartItems.length === 0) {
      return;
    }

    createOrder({
      table: selectedTable.id,
      server: currentUser?.name ? `Server: ${currentUser.name}` : 'Server',
      category: cartItems[0]?.category ?? 'Mains',
      items: cartItems.map((item) => ({ name: item.name, qty: item.qty })),
    });
    setCart({});
    setSelectedTableId(null);
    router.push('/waiter' as never);
  };

  const voiceModals = (
    <>
      <Modal transparent visible={voiceOpen && voiceStage === 'recording'} animationType="fade" onRequestClose={() => setVoiceStage('idle')}>
        <View style={styles.voiceModalOverlay}>
          <View style={styles.recordingModal}>
            <View style={styles.recordingPulse}>
              <DIcon name="mic" color="#ffffff" size={34} />
            </View>
            <Text style={styles.voiceModalTitle}>Recording Order</Text>
            <Text style={styles.voiceModalBody}>Listening for table items...</Text>
            <Text style={styles.voiceWaveText}>Voice is being recorded</Text>
            <Pressable
              style={styles.voiceModalSecondary}
              onPress={() => void stopVoiceRecording()}>
              <Text style={styles.secondaryAuthText}>{voiceListening ? 'Stop & Review' : 'Review'}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal transparent visible={voiceOpen && voiceStage === 'review'} animationType="slide" onRequestClose={() => setVoiceStage('idle')}>
        <View style={styles.voiceModalOverlay}>
          <View style={styles.reviewModal}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.voiceModalTitle}>Review Voice Order</Text>
                <Text style={styles.smallLabel}>{voiceFeedback}</Text>
              </View>
              <Pressable
                onPress={() => {
                  setVoiceOpen(false);
                  setVoiceStage('idle');
                }}
                style={styles.closeVoiceButton}>
                <DIcon name="close" color={c.textSecondary} size={20} />
              </Pressable>
            </View>
            <View style={styles.voiceInputBox}>
              <DIcon name="record-voice-over" color={red} />
              <TextInput
                value={voiceTranscript}
                onChangeText={updateVoiceTranscript}
                autoCapitalize="none"
                multiline
                placeholder='Try "two cheese burgers and one fresh lime to table one"'
                placeholderTextColor={c.border}
                style={styles.fieldInput}
              />
            </View>
            <Pressable style={styles.voiceModalSecondary} onPress={() => void reviewVoiceTranscript()}>
              <Text style={styles.secondaryAuthText}>Parse Again</Text>
            </Pressable>
            <View style={styles.voiceSuggestions}>
              {voiceExamples.map((example) => (
                <Pressable
                  key={example}
                  style={styles.voiceSuggestionChip}
                  onPress={() => {
                    updateVoiceTranscript(example);
                    void reviewVoiceTranscript(example);
                  }}>
                  <Text style={styles.smallLabel}>{example}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.voiceDraftList}>
              {voiceDraftTableId ? (
                <View style={styles.voiceTableRow}>
                  <DIcon name="table-restaurant" color={red} size={20} />
                  <Text style={styles.boldLabel}>{voiceDraftTableId} detected</Text>
                </View>
              ) : null}
              {voiceDraft.length > 0 ? (
                voiceDraft.map((item) => (
                  <View key={item.name} style={styles.voiceDraftRow}>
                    <View style={styles.flexOne}>
                      <Text style={styles.boldLabel}>{item.name}</Text>
                      <Text style={styles.smallLabel}>{item.price}</Text>
                    </View>
                    <View style={styles.menuQuantityControl}>
                      <Pressable style={styles.menuQtyButton} onPress={() => setDraftQuantity(item.name, -1)}>
                        <DIcon name="remove" color={primary} size={18} />
                      </Pressable>
                      <Text style={styles.menuQtyText}>{item.qty}</Text>
                      <Pressable style={styles.menuQtyButtonRed} onPress={() => setDraftQuantity(item.name, 1)}>
                        <DIcon name="add" color="#ffffff" size={18} />
                      </Pressable>
                    </View>
                    <Pressable style={styles.voiceRemoveButton} onPress={() => removeDraftItem(item.name)}>
                      <DIcon name="delete-outline" color={c.danger} size={20} />
                    </Pressable>
                  </View>
                ))
              ) : (
                <View style={styles.emptyVoiceDraft}>
                  <Text style={styles.boldLabel}>No items detected</Text>
                  <Text style={styles.smallLabel}>Edit the text above or record again.</Text>
                </View>
              )}
            </View>
            <View style={styles.voiceActions}>
              <Pressable style={styles.voiceSecondaryButton} onPress={() => void startVoiceAgent()}>
                <Text style={styles.secondaryAuthText}>Record Again</Text>
              </Pressable>
              <Pressable
                style={[styles.voiceApplyButton, voiceDraft.length === 0 && styles.disabledButton]}
                disabled={voiceDraft.length === 0}
                onPress={addVoiceDraftToCart}>
                <Text style={styles.primaryButtonText}>Add to Cart</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );

  return (
    <ProtectedScreen route="order">
      <ScreenShell active="order" backgroundColor={lowBg} noTopPad contentStyle={styles.orderScroll}>
        <TopBar title={selectedTable ? `New Order - ${selectedTable.id}` : 'Select Table'} showBack />
        {!selectedTable ? (
          <>
            <View style={styles.tableSelectCanvas}>
              <View style={styles.section}>
                <Text style={styles.displayTitle}>Choose a Table</Text>
                <Text style={styles.bodyMuted}>Select the guest table before opening the menu list.</Text>
              </View>
              <View style={styles.tableSelectGrid}>
                {tables.map((table, index) => (
                  <Pressable key={table.id} onPress={() => setSelectedTableId(table.id)}>
                    <SoftCard enteringIndex={index} style={styles.tableSelectCard}>
                      <View style={styles.cardHeader}>
                        <View>
                          <Text style={styles.headline}>{table.id}</Text>
                          <Text style={styles.labelMuted}>{table.meta}</Text>
                        </View>
                        <StatusPill label={table.status} tone={table.tone} />
                      </View>
                      <View style={styles.tableSelectFooter}>
                        <Text style={styles.boldLabel}>{table.title}</Text>
                        <DIcon name="arrow-forward" color={red} />
                      </View>
                    </SoftCard>
                  </Pressable>
                ))}
              </View>
            </View>
            {voiceModals}
          </>
        ) : (
          <>
            <View style={styles.hero}>
              <View style={styles.heroText}>
                <Text style={styles.heroEyebrow}>Chef&apos;s Special</Text>
                <Text style={styles.heroTitle}>Truffle Risotto</Text>
              </View>
              <Image source={{ uri: specialDish }} style={styles.heroDish} contentFit="cover" />
            </View>
            <View style={styles.selectedTableBanner}>
              <View>
                <Text style={styles.boldLabel}>{selectedTable.id} selected</Text>
                <Text style={styles.smallLabel}>{selectedTable.meta}</Text>
              </View>
              <Pressable onPress={() => setSelectedTableId(null)} style={styles.changeTableButton}>
                <Text style={styles.linkText}>Change</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroller}>
              {['Appetizers', 'Mains', 'Drinks', 'Desserts'].map((label, index) => (
                <Chip key={label} label={label} active={index === 0} />
              ))}
            </ScrollView>
            <View style={styles.menuGrid}>
              {menu.map((item, index) => (
                <MenuItemCard
                  key={item.name}
                  item={item}
                  image={menuImages[index % menuImages.length]}
                  index={index}
                  quantity={cart[item.name]?.qty ?? 0}
                  onAdd={() => updateCart(item, 1)}
                  onRemove={() => updateCart(item, -1)}
                />
              ))}
            </View>
            <SoftCard style={styles.orderTray}>
              <View style={styles.trayLeft}>
                <View style={styles.cartIcon}>
                  <DIcon name="shopping-cart" color={red} size={30} />
                </View>
                <View>
                  <Text style={styles.trayTitle}>{cartCount > 0 ? `${cartCount} item${cartCount === 1 ? '' : 's'} selected` : 'No items selected'}</Text>
                  <Text style={styles.smallLabel}>Order for {selectedTable.id}</Text>
                </View>
              </View>
              {cartItems.length > 0 ? (
                <View style={styles.cartLineList}>
                  {cartItems.map((item) => (
                    <View key={item.name} style={styles.cartLine}>
                      <Text style={styles.boldLabel}>
                        {item.qty}x {item.name}
                      </Text>
                      <Text style={styles.smallLabel}>${(item.qty * item.amount).toFixed(2)}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
              <View style={styles.trayBottom}>
                <View style={styles.quantityPill}>
                  <Pressable
                    style={styles.qtyButtonLight}
                    disabled={cartItems.length === 0}
                    onPress={() => {
                      const lastItem = cartItems[cartItems.length - 1];
                      if (lastItem) updateCart(lastItem, -1);
                    }}>
                    <DIcon name="remove" color={primary} />
                  </Pressable>
                  <Text style={styles.qtyText}>{cartCount}</Text>
                  <Pressable
                    style={styles.qtyButtonRed}
                    disabled={cartItems.length === 0}
                    onPress={() => {
                      const lastItem = cartItems[cartItems.length - 1];
                      if (lastItem) updateCart(lastItem, 1);
                    }}>
                    <DIcon name="add" color="#ffffff" />
                  </Pressable>
                </View>
                <View style={styles.subtotal}>
                  <Text style={styles.tinyLabel}>SUBTOTAL</Text>
                  <Text style={styles.subtotalText}>${subtotal.toFixed(2)}</Text>
                </View>
              </View>
            </SoftCard>
            <Pressable style={[styles.voiceButton, voiceListening && styles.voiceButtonActive]} onPress={() => void startVoiceAgent()}>
              <DIcon name={voiceListening ? 'hearing' : 'mic'} color="#ffffff" size={28} />
            </Pressable>
            {voiceModals}
            <Pressable style={[styles.sendButton, cartItems.length === 0 && styles.disabledButton]} disabled={cartItems.length === 0} onPress={sendOrder}>
              <Text style={styles.sendText}>Send to Kitchen</Text>
              <DIcon name="restaurant" color="#ffffff" />
            </Pressable>
          </>
        )}
      </ScreenShell>
    </ProtectedScreen>
  );
}

function MenuItemCard({
  item,
  image,
  index,
  quantity,
  onAdd,
  onRemove,
}: {
  item: (typeof menu)[number];
  image: string;
  index: number;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <SoftCard enteringIndex={index} style={styles.menuCard}>
      <Pressable style={styles.favorite}>
        <DIcon name="favorite-border" color={index === 0 || index === 2 ? red : c.border} size={20} />
      </Pressable>
      <Image source={{ uri: image }} style={styles.menuImage} contentFit="cover" />
      <View style={styles.menuCopy}>
        <Text style={styles.tinyLabel}>{item.label}</Text>
        <Text numberOfLines={1} style={styles.menuName}>
          {item.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>{item.price}</Text>
          {quantity > 0 ? (
            <View style={styles.menuQuantityControl}>
              <Pressable style={styles.menuQtyButton} onPress={onRemove}>
                <DIcon name="remove" color={red} size={18} />
              </Pressable>
              <Text style={styles.menuQtyText}>{quantity}</Text>
              <Pressable style={styles.menuQtyButtonRed} onPress={onAdd}>
                <DIcon name="add" color="#ffffff" size={18} />
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.addButton} onPress={onAdd}>
              <DIcon name="add" color="#ffffff" />
            </Pressable>
          )}
        </View>
      </View>
    </SoftCard>
  );
}

type KitchenStatus = 'pending' | 'cooking' | 'completed';

export function KitchenDashboardScreen() {
  const [selected, setSelected] = useState<KitchenStatus>('pending');
  const user = useAuthStore((state) => state.currentUser);
  const orders = useAuthStore((state) => state.orders);
  const toggleSpecialty = useAuthStore((state) => state.toggleSpecialty);
  const visibleOrders = orders.filter((order) => user?.specialties.length === 0 || user?.specialties.includes(order.category));
  const counts = useMemo(
    () => ({
      pending: visibleOrders.filter((order) => order.status === 'pending').length,
      cooking: visibleOrders.filter((order) => order.status === 'cooking').length,
      completed: visibleOrders.filter((order) => order.status === 'completed').length,
    }),
    [visibleOrders],
  );

  return (
    <ProtectedScreen route="kitchen">
      <ScreenShell active="kitchen" backgroundColor={bg}>
        <TopBar title="Kitchen Monitor" />
        <SoftCard style={styles.specialtyCard}>
          <Text style={styles.boldLabel}>Notify me for</Text>
          <Text style={styles.smallLabel}>Choose stations you cook. Only matching orders appear here.</Text>
          <View style={styles.specialtyWrap}>
            {specialtyOptions.map((specialty) => {
              const selectedSpecialty = user?.specialties.includes(specialty);
              return (
                <Pressable
                  key={specialty}
                  onPress={() => toggleSpecialty(specialty)}
                  style={[styles.specialtyChip, selectedSpecialty ? styles.chipActive : styles.chipIdle]}>
                  <Text style={[styles.chipText, selectedSpecialty ? styles.chipTextActive : styles.chipTextIdle]}>{specialty}</Text>
                </Pressable>
              );
            })}
          </View>
        </SoftCard>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusTabs}>
          {(['pending', 'cooking', 'completed'] as KitchenStatus[]).map((state) => (
            <Pressable
              key={state}
              onPress={() => setSelected(state)}
              style={[styles.statusTab, selected === state ? styles.statusTabActive : styles.statusTabIdle]}>
              <Text style={[styles.statusTabText, selected === state ? styles.whiteText : styles.mutedText]}>
                {state[0].toUpperCase() + state.slice(1)} ({counts[state]})
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.kitchenGrid}>
          {visibleOrders
            .filter((order) => order.status === selected)
            .map((order, index) => (
              <KitchenOrderCard key={order.id} order={order} index={index} />
            ))}
        </View>
      </ScreenShell>
    </ProtectedScreen>
  );
}

function KitchenOrderCard({ order, index }: { order: ReturnType<typeof useAuthStore.getState>['orders'][number]; index: number }) {
  const updateOrderStatus = useAuthStore((state) => state.updateOrderStatus);
  const completed = order.status === 'completed';
  const nextStatus = order.status === 'pending' ? 'cooking' : 'completed';
  const action = order.status === 'pending' ? 'Start Cooking' : order.status === 'cooking' ? 'Mark Completed' : 'Completed';
  const tone = order.status === 'completed' ? 'ready' : order.status === 'cooking' ? 'soft' : 'neutral';

  return (
    <SoftCard enteringIndex={index} style={[styles.kitchenCard, completed && styles.readyCard]}>
      <View style={styles.cardHeader}>
        <View>
          <View style={styles.inlineRow}>
            <Text style={styles.boldLabel}>Order {order.id}</Text>
            <StatusPill label={order.status} tone={tone} />
          </View>
          <Text style={styles.headline}>{order.table}</Text>
          <Text style={styles.smallLabel}>{order.category}</Text>
        </View>
        <View style={styles.rightCopy}>
          <Text style={styles.boldLabel}>{order.elapsed}</Text>
          <Text style={styles.smallLabel}>{order.server}</Text>
        </View>
      </View>
      <View>
        {order.items.map(({ qty, name, note }) => (
          <View key={`${order.id}-${name}`} style={styles.orderLine}>
            <View style={styles.inlineRow}>
              <Text style={[styles.orderQty, completed && styles.fadedText]}>{qty}</Text>
              <Text style={[styles.orderItem, completed && styles.strikeText]}>{name}</Text>
            </View>
            {note ? <Text style={styles.noteText}>{note}</Text> : null}
          </View>
        ))}
      </View>
      <Pressable
        disabled={completed}
        onPress={() => updateOrderStatus(order.id, nextStatus)}
        style={[styles.primaryButton, completed && styles.outlineButton]}>
        <DIcon name={completed ? 'check-circle' : order.status === 'cooking' ? 'check-circle' : 'restaurant-menu'} color={completed ? red : '#ffffff'} />
        <Text style={[styles.primaryButtonText, completed && styles.outlineButtonText]}>{action}</Text>
      </Pressable>
    </SoftCard>
  );
}

export function ManagerDashboardScreen() {
  return (
    <ProtectedScreen route="manager">
    <ScreenShell active="manager" backgroundColor={lowBg}>
      <TopBar title="Welcome back, Manager" />
      <View style={styles.section}>
        <Text style={styles.displayTitle}>Business Insights</Text>
        <Text style={styles.bodyMuted}>Real-time overview of your restaurant performance</Text>
      </View>
      <View style={styles.metricGrid}>
        <MetricCard title="Total Revenue" value="$12,842" detail="+12.5% from yesterday" icon="payments" index={0} />
        <MetricCard title="Active Orders" value="24" detail="8 orders in progress" icon="restaurant-menu" index={1} neutral />
        <MetricCard title="Avg Prep Time" value="18m" detail="2m faster than avg" icon="timer" index={2} />
      </View>
      <SoftCard style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <View style={styles.sparkIcon}>
            <DIcon name="auto-awesome" color={red} />
          </View>
          <Text style={styles.insightLabel}>AI Suggestion</Text>
        </View>
        <Text style={styles.headline}>Optimize Floor Staff</Text>
        <Text style={styles.insightBody}>
          We&apos;ve detected a 25% surge in table turnover expected between 7:00 PM - 8:30 PM. Consider re-allocating two additional servers to Zone B to maintain your 18-minute prep average.
        </Text>
        <Pressable style={styles.applyButton}>
          <Text style={styles.primaryButtonText}>Apply Adjustment</Text>
        </Pressable>
      </SoftCard>
      <SoftCard style={styles.chartCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.boldLabel}>Hourly Revenue</Text>
          <View style={styles.inlineRow}>
            <Text style={styles.smallPill}>Today</Text>
            <Text style={styles.smallLabel}>Yesterday</Text>
          </View>
        </View>
        <View style={styles.chart}>
          {[40, 65, 35, 85, 100, 55].map((height, index) => (
            <View key={height + index} style={styles.chartColumn}>
              <View style={[styles.chartBar, { height }]} />
              <Text style={styles.chartLabel}>{['12PM', '2PM', '4PM', '6PM', '8PM', '10PM'][index]}</Text>
            </View>
          ))}
        </View>
      </SoftCard>
      <View style={styles.popularHeader}>
        <Text style={styles.headline}>Popular Items</Text>
        <Text style={styles.linkText}>View full menu →</Text>
      </View>
      <View style={styles.popularList}>
        {[
          ['Quinoa Power Bowl', '142 orders today'],
          ['Classic Pepperoni', '118 orders today'],
          ['Wagyu Smash Burger', '95 orders today'],
          ['Truffle Donuts', '87 orders today'],
        ].map(([title, subtitle], index) => (
          <SoftCard key={title} enteringIndex={index} style={styles.popularCard}>
            <Image source={{ uri: popularImages[index] }} style={styles.popularImage} contentFit="cover" />
            <View>
              <Text style={styles.boldLabel}>{title}</Text>
              <Text style={styles.smallLabel}>{subtitle}</Text>
            </View>
          </SoftCard>
        ))}
      </View>
    </ScreenShell>
    </ProtectedScreen>
  );
}

function MetricCard({
  title,
  value,
  detail,
  icon,
  index,
  neutral,
}: {
  title: string;
  value: string;
  detail: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  index: number;
  neutral?: boolean;
}) {
  return (
    <SoftCard enteringIndex={index} style={styles.metricCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.boldMuted}>{title}</Text>
        <DIcon name={icon} color={red} />
      </View>
      <View>
        <Text style={styles.metricValue}>{value}</Text>
        <View style={styles.inlineRow}>
          <DIcon name={neutral ? 'schedule' : 'trending-up'} color={neutral ? c.textSecondary : primary} size={16} />
          <Text style={[styles.metricDetail, neutral && styles.mutedText]}>{detail}</Text>
        </View>
      </View>
    </SoftCard>
  );
}

export function LoginScreen() {
  const [mode, setMode] = useState<'company' | 'worker'>('company');
  const [identifier, setIdentifier] = useState('OWNER@DINEFLOW.TEST');
  const [password, setPassword] = useState('password123');
  const setCurrentUserFromApi = useAuthStore((state) => state.setCurrentUserFromApi);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const response =
        mode === 'company'
          ? await loginCompanyRequest({ identifier, password })
          : await loginWorkerRequest({ email: identifier.trim().toLowerCase(), password });
      setCurrentUserFromApi(response);
      const user = response.user;
      router.replace(homeForRole(user?.role ?? 'owner') as never);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell backgroundColor="#f5f5f5" contentStyle={styles.authScroll}>
      <View style={styles.loginMark}>
        <DIcon name="restaurant-menu" color={red} size={48} />
      </View>
      <Text style={styles.authTitle}>DineFlow OS</Text>
      <Text style={styles.authSubtitle}>Connected to {getApiBaseUrl()}</Text>
      <SoftCard style={styles.authCard}>
        <View style={styles.segmented}>
          {(['company', 'worker'] as const).map((item) => (
            <Pressable key={item} onPress={() => setMode(item)} style={[styles.segment, mode === item && styles.segmentActive]}>
              <Text style={[styles.segmentText, mode === item && styles.whiteText]}>{item === 'company' ? 'Company' : 'Worker'}</Text>
            </Pressable>
          ))}
        </View>
        <AuthField
          label={mode === 'company' ? 'Email or Company ID' : 'Worker Email'}
          placeholder={mode === 'company' ? 'OWNER@MAIL.COM or COMPANYID' : 'worker@restaurant.com'}
          icon={mode === 'company' ? 'business' : 'mail'}
          value={identifier}
          onChangeText={(value) => setIdentifier(mode === 'company' ? value.toUpperCase() : value)}
        />
        <AuthField label="Password" placeholder="Enter password" icon="lock" value={password} onChangeText={setPassword} secureTextEntry />
        {apiError ? <Text style={styles.errorMessage}>{apiError}</Text> : null}
        <Pressable style={styles.authButton} onPress={submit}>
          <Text style={styles.primaryButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
          <DIcon name="arrow-forward" color="#ffffff" size={18} />
        </Pressable>
        <Pressable onPress={() => router.push('/sign-up' as never)}>
          <Text style={styles.forgotText}>Register a company</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/worker-register' as never)}>
          <Text style={styles.forgotText}>Register as invited worker</Text>
        </Pressable>
      </SoftCard>
      <View style={styles.authDivider}>
        <View style={styles.dividerLine} />
        <Text style={styles.smallLabel}>Authorized Access Only</Text>
        <View style={styles.dividerLine} />
      </View>
      <View style={styles.helpGrid}>
        <InfoTile icon="support-agent" title="IT Help" subtitle="Ext. 404" />
        <InfoTile icon="sync" title="System" subtitle="v2.4.0" />
      </View>
    </ScreenShell>
  );
}

export function SignUpScreen() {
  const [ownerEmail, setOwnerEmail] = useState('OWNER@DINEFLOW.TEST');
  const [companyId, setCompanyId] = useState('DINEFLOWHQ');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const setCurrentUserFromApi = useAuthStore((state) => state.setCurrentUserFromApi);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const response = await registerCompanyRequest({
        email: ownerEmail.trim().toLowerCase(),
        companyId,
        password,
        confirmPassword,
      });
      setCurrentUserFromApi(response);
      router.replace('/workers' as never);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Company registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell backgroundColor={bg} contentStyle={styles.authScroll}>
      <View style={styles.signUpMark}>
        <DIcon name="restaurant-menu" color="#ffffff" size={32} />
      </View>
      <Text style={styles.authTitle}>Register Company</Text>
      <Text style={styles.authSubtitle}>Only a company owner can create the workspace</Text>
      <View style={styles.signupForm}>
        <AuthField
          label="Company ID"
          placeholder="DINEFLOWHQ"
          icon="business"
          compact
          value={companyId}
          onChangeText={(value) => setCompanyId(value.toUpperCase())}
        />
        <AuthField label="Owner Email" placeholder="owner@restaurant.com" icon="mail" compact value={ownerEmail} onChangeText={setOwnerEmail} />
        <AuthField label="Password" placeholder="Minimum 6 characters" icon="lock" compact value={password} onChangeText={setPassword} secureTextEntry />
        <AuthField
          label="Repeat Password"
          placeholder="Repeat password"
          icon="lock"
          compact
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {apiError ? <Text style={styles.errorMessage}>{apiError}</Text> : null}
        <View style={styles.companyIdBox}>
          <Text style={styles.smallLabel}>Company ID</Text>
          <Text style={styles.companyIdText}>{companyId}</Text>
          <Text style={styles.pinHint}>Workers can only join this ID after you add their email.</Text>
        </View>
        <Pressable style={styles.authButton} onPress={submit}>
          <Text style={styles.primaryButtonText}>{loading ? 'Creating...' : 'Create Company'}</Text>
        </Pressable>
      </View>
      <Pressable style={styles.loginLink} onPress={() => router.push('/login' as never)}>
        <Text style={styles.bodyMuted}>Already have an account? </Text>
        <Text style={styles.linkText}>Login</Text>
      </Pressable>
      <View style={styles.authDivider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dineflowStamp}>DINEFLOW OS</Text>
        <View style={styles.dividerLine} />
      </View>
    </ScreenShell>
  );
}

export function WorkersScreen() {
  const [email, setEmail] = useState('newchef@dineflow.test');
  const [role, setRole] = useState<WorkerRole>('chef');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(['Burgers']);
  const currentUser = useAuthStore((state) => state.currentUser);
  const invites = useAuthStore((state) => state.invites);
  const inviteWorker = useAuthStore((state) => state.inviteWorker);
  const authError = useAuthStore((state) => state.authError);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleInviteSpecialty = (specialty: string) => {
    setSelectedSpecialties((items) =>
      items.includes(specialty) ? items.filter((item) => item !== specialty) : [...items, specialty],
    );
  };

  const submit = async () => {
    setLoading(true);
    setApiError(null);

    try {
      if (!currentUser?.token) {
        throw new Error('Login again before inviting workers');
      }

      await inviteWorkerRequest(currentUser.token, {
        email: email.trim().toLowerCase(),
        role,
        specialties: role === 'chef' ? selectedSpecialties : [],
      });
      inviteWorker({
        email,
        role,
        specialties: role === 'chef' ? selectedSpecialties : [],
      });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to invite worker');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedScreen route="workers">
      <ScreenShell active="workers" backgroundColor={lowBg}>
        <TopBar title="Company Workers" />
        <View style={styles.section}>
          <Text style={styles.displayTitle}>Invite Staff</Text>
          <Text style={styles.bodyMuted}>Company ID: {currentUser?.companyId}</Text>
        </View>
        <SoftCard style={styles.workerForm}>
          <AuthField label="Worker Email" placeholder="worker@restaurant.com" icon="mail" value={email} onChangeText={setEmail} compact />
          <Text style={styles.fieldLabel}>Role</Text>
          <View style={styles.roleRow}>
            {(['chef', 'server', 'manager'] as WorkerRole[]).map((item) => (
              <Pressable key={item} onPress={() => setRole(item)} style={[styles.roleChip, role === item && styles.chipActive]}>
                <Text style={[styles.chipText, role === item ? styles.chipTextActive : styles.chipTextIdle]}>
                  {item === 'server' ? 'Servant' : item}
                </Text>
              </Pressable>
            ))}
          </View>
          {role === 'chef' ? (
            <>
              <Text style={styles.fieldLabel}>Chef order notifications</Text>
              <View style={styles.specialtyWrap}>
                {specialtyOptions.map((specialty) => {
                  const active = selectedSpecialties.includes(specialty);
                  return (
                    <Pressable
                      key={specialty}
                      onPress={() => toggleInviteSpecialty(specialty)}
                      style={[styles.specialtyChip, active ? styles.chipActive : styles.chipIdle]}>
                      <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextIdle]}>{specialty}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}
          {apiError || authError ? <Text style={styles.errorMessage}>{apiError ?? authError}</Text> : null}
          <Pressable style={styles.authButton} onPress={submit}>
            <Text style={styles.primaryButtonText}>{loading ? 'Adding...' : 'Add Worker Email'}</Text>
          </Pressable>
        </SoftCard>
        <View style={styles.popularList}>
          {invites.map((invite, index) => (
            <SoftCard key={invite.email} enteringIndex={index} style={styles.workerCard}>
              <View>
                <Text style={styles.boldLabel}>{invite.email}</Text>
                <Text style={styles.smallLabel}>
                  {invite.role} {invite.specialties.length ? `• ${invite.specialties.join(', ')}` : ''}
                </Text>
              </View>
              <StatusPill label={invite.accepted ? 'Joined' : 'Invited'} tone={invite.accepted ? 'ready' : 'neutral'} />
            </SoftCard>
          ))}
        </View>
      </ScreenShell>
    </ProtectedScreen>
  );
}

export function WorkerRegisterScreen() {
  const [companyId, setCompanyId] = useState('DINEFLOWHQ');
  const [name, setName] = useState('Worker');
  const [email, setEmail] = useState('worker@restaurant.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const setCurrentUserFromApi = useAuthStore((state) => state.setCurrentUserFromApi);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const response = await registerWorkerRequest({
        companyId,
        name,
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
      });
      setCurrentUserFromApi(response);
      router.replace(homeForRole(response.user.role) as never);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Worker registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell backgroundColor={bg} contentStyle={styles.authScroll}>
      <View style={styles.signUpMark}>
        <DIcon name="badge" color="#ffffff" size={32} />
      </View>
      <Text style={styles.authTitle}>Worker Join</Text>
      <Text style={styles.authSubtitle}>Use the Company ID and invited email</Text>
      <View style={styles.signupForm}>
        <AuthField label="Company ID" placeholder="DINEFLOWHQ" icon="business" compact value={companyId} onChangeText={(value) => setCompanyId(value.toUpperCase())} />
        <AuthField label="Name" placeholder="Your name" icon="person" compact value={name} onChangeText={setName} />
        <AuthField label="Invited Email" placeholder="worker@restaurant.com" icon="mail" compact value={email} onChangeText={setEmail} />
        <AuthField label="Password" placeholder="Minimum 6 characters" icon="lock" compact value={password} onChangeText={setPassword} secureTextEntry />
        <AuthField
          label="Repeat Password"
          placeholder="Repeat password"
          icon="lock"
          compact
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {apiError ? <Text style={styles.errorMessage}>{apiError}</Text> : null}
        <Pressable style={styles.authButton} onPress={submit}>
          <Text style={styles.primaryButtonText}>{loading ? 'Joining...' : 'Create Worker Account'}</Text>
        </Pressable>
      </View>
      <Pressable style={styles.loginLink} onPress={() => router.push('/login' as never)}>
        <Text style={styles.bodyMuted}>Already joined? </Text>
        <Text style={styles.linkText}>Login</Text>
      </Pressable>
    </ScreenShell>
  );
}

function AuthField({
  label,
  placeholder,
  icon,
  rightIcon,
  secureTextEntry,
  compact,
  value,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  secureTextEntry?: boolean;
  compact?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
}) {
  return (
    <View style={styles.authField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.fieldBox, compact && styles.fieldBoxCompact]}>
        <DIcon name={icon} color={c.textSecondary} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={c.border}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          style={styles.fieldInput}
        />
        {rightIcon ? <DIcon name={rightIcon} color={c.textSecondary} /> : null}
      </View>
    </View>
  );
}

function InfoTile({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.infoTile}>
      <DIcon name={icon} color={red} />
      <View>
        <Text style={styles.boldLabel}>{title}</Text>
        <Text style={styles.smallLabel}>{subtitle}</Text>
      </View>
    </View>
  );
}

const font = {
  fontFamily: DineFlowFontFamily,
} as const;

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 132,
  },
  noTopPad: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  topBar: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingTop: 12,
  },
  topBarLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: 14,
  },
  topRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  topTitle: {
    ...font,
    fontSize: 18,
    fontWeight: '600',
  },
  avatar: {
    borderColor: red,
    borderRadius: 20,
    borderWidth: 2,
    height: 40,
    width: 40,
  },
  smallAvatar: {
    borderRadius: 16,
    height: 32,
    width: 32,
  },
  backCircle: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
    ...DineFlowShadows.level1,
  },
  section: {
    marginTop: 28,
    gap: 24,
  },
  displayTitle: {
    ...font,
    color: c.textPrimary,
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 48,
  },
  searchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: r.pill,
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 20,
    ...DineFlowShadows.level1,
  },
  searchInput: {
    ...font,
    color: c.textPrimary,
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: red,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
    ...DineFlowShadows.level2,
  },
  chipScroller: {
    gap: 12,
    paddingBottom: 20,
    paddingTop: 32,
  },
  chip: {
    alignItems: 'center',
    borderRadius: r.pill,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  chipActive: {
    backgroundColor: red,
  },
  chipIdle: {
    backgroundColor: '#e8e8e8',
  },
  chipText: {
    ...font,
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  chipTextIdle: {
    color: c.textSecondary,
  },
  cardGrid: {
    gap: 24,
  },
  softCard: {
    backgroundColor: '#ffffff',
    borderColor: '#eeeeee',
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    ...DineFlowShadows.level1,
  },
  leftError: {
    borderLeftColor: c.danger,
    borderLeftWidth: 4,
  },
  leftCoral: {
    borderLeftColor: '#fe7f86',
    borderLeftWidth: 4,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  headline: {
    ...font,
    color: c.textPrimary,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  labelMuted: {
    ...font,
    color: c.outline,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  statusPill: {
    borderRadius: r.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    ...font,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  tableBody: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 24,
    marginBottom: 32,
    marginTop: 32,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  initialAvatar: {
    alignItems: 'center',
    backgroundColor: '#ffdad6',
    borderColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  initialOverlap: {
    marginLeft: -8,
  },
  initialText: {
    ...font,
    color: c.textPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  alertIcon: {
    alignItems: 'center',
    backgroundColor: '#ffdad6',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  alertIconHot: {
    backgroundColor: c.danger,
  },
  flexOne: {
    flex: 1,
  },
  boldLabel: {
    ...font,
    color: c.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  boldMuted: {
    ...font,
    color: c.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  smallLabel: {
    ...font,
    color: c.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  secondaryText: {
    color: c.secondary,
  },
  errorText: {
    color: c.danger,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: red,
    borderRadius: r.pill,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 20,
    ...DineFlowShadows.level1,
  },
  primaryButtonText: {
    ...font,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  bottomNav: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 32,
    bottom: 32,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    width: '90%',
    ...DineFlowShadows.level2,
  },
  navItem: {
    alignItems: 'center',
    borderRadius: 24,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  navItemActive: {
    backgroundColor: '#1a1614',
  },
  navLabel: {
    ...font,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  navVoiceItem: {
    backgroundColor: red,
    borderRadius: 24,
    height: 48,
    width: 48,
  },
  profileNavItem: {
    paddingHorizontal: 8,
  },
  miniAvatar: {
    borderRadius: 15,
    height: 30,
    width: 30,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
    ...DineFlowShadows.level1,
  },
  notifIcon: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    position: 'relative',
    width: 40,
    ...DineFlowShadows.level1,
  },
  notifDot: {
    backgroundColor: red,
    borderColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 2,
    height: 8,
    position: 'absolute',
    right: 10,
    top: 10,
    width: 8,
  },
  profileModalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 24,
    width: '85%',
    ...DineFlowShadows.level2,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileAvatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  largeAvatar: {
    borderColor: '#f1f5f9',
    borderRadius: 50,
    borderWidth: 4,
    height: 100,
    width: 100,
  },
  editAvatarBadge: {
    backgroundColor: red,
    borderColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 2,
    bottom: 0,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    width: 28,
  },
  profileName: {
    ...font,
    color: c.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  profileRole: {
    ...font,
    color: red,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },
  profileDetails: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    gap: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  detailText: {
    ...font,
    color: c.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  profileActions: {
    gap: 4,
  },
  actionItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  actionText: {
    ...font,
    color: c.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  actionDivider: {
    backgroundColor: '#f1f5f9',
    height: 1,
    marginVertical: 8,
  },
  logoutAction: {
    marginTop: 4,
  },
  logoutText: {
    color: red,
  },
  orderScroll: {
    paddingBottom: 176,
  },
  tableSelectCanvas: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  tableSelectGrid: {
    gap: 16,
    marginTop: 24,
  },
  tableSelectCard: {
    gap: 24,
  },
  tableSelectFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedTableBanner: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: 24,
    padding: 18,
    ...DineFlowShadows.level1,
  },
  changeTableButton: {
    borderColor: red,
    borderRadius: r.pill,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  hero: {
    backgroundColor: red,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    height: 256,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    paddingBottom: 48,
    paddingHorizontal: 24,
    position: 'relative',
  },
  heroText: {
    width: '58%',
  },
  heroEyebrow: {
    ...font,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  heroTitle: {
    ...font,
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
  },
  heroDish: {
    borderColor: '#ffffff',
    borderRadius: 96,
    borderWidth: 4,
    bottom: -32,
    height: 192,
    position: 'absolute',
    right: -16,
    width: 192,
  },
  categoryScroller: {
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 24,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 24,
  },
  menuCard: {
    borderWidth: 0,
    padding: 12,
    width: '47.4%',
  },
  favorite: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    top: 20,
    width: 32,
    zIndex: 2,
  },
  menuImage: {
    aspectRatio: 1,
    borderRadius: 16,
    width: '100%',
  },
  menuCopy: {
    paddingBottom: 8,
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  tinyLabel: {
    ...font,
    color: c.outline,
    fontSize: 12,
    fontWeight: '700',
  },
  menuName: {
    ...font,
    color: c.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  priceText: {
    ...font,
    color: red,
    fontSize: 18,
    fontWeight: '700',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: red,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
    ...DineFlowShadows.level1,
  },
  menuQuantityControl: {
    alignItems: 'center',
    backgroundColor: c.surfaceContainer,
    borderRadius: r.pill,
    flexDirection: 'row',
    padding: 4,
  },
  menuQtyButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  menuQtyButtonRed: {
    alignItems: 'center',
    backgroundColor: red,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  menuQtyText: {
    ...font,
    color: c.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  orderTray: {
    borderRadius: 32,
    borderWidth: 0,
    gap: 24,
    marginHorizontal: 24,
    marginTop: 48,
  },
  trayLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  cartIcon: {
    alignItems: 'center',
    backgroundColor: '#ffdad6',
    borderRadius: 16,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  trayTitle: {
    ...font,
    color: c.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  trayBottom: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  cartLineList: {
    borderTopColor: c.surfaceContainer,
    borderTopWidth: 1,
    gap: 10,
    paddingTop: 16,
  },
  cartLine: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityPill: {
    alignItems: 'center',
    backgroundColor: c.surfaceContainer,
    borderRadius: r.pill,
    flexDirection: 'row',
    padding: 8,
  },
  qtyButtonLight: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  qtyButtonRed: {
    alignItems: 'center',
    backgroundColor: red,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  qtyText: {
    ...font,
    color: c.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 24,
  },
  subtotal: {
    alignItems: 'flex-end',
  },
  subtotalText: {
    ...font,
    color: red,
    fontSize: 20,
    fontWeight: '600',
  },
  voiceButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: red,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginRight: 32,
    marginTop: 32,
    width: 56,
    ...DineFlowShadows.level2,
  },
  voiceButtonActive: {
    backgroundColor: primary,
    transform: [{ scale: 1.06 }],
  },
  voicePanel: {
    borderWidth: 0,
    gap: 16,
    marginHorizontal: 24,
    marginTop: 16,
  },
  voiceModalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.42)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  recordingModal: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    gap: 14,
    padding: 28,
    width: '100%',
    ...DineFlowShadows.level2,
  },
  reviewModal: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    gap: 16,
    maxHeight: '86%',
    padding: 20,
    width: '100%',
    ...DineFlowShadows.level2,
  },
  recordingPulse: {
    alignItems: 'center',
    backgroundColor: red,
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    width: 80,
    ...DineFlowShadows.level2,
  },
  voiceModalTitle: {
    ...font,
    color: c.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  voiceModalBody: {
    ...font,
    color: c.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
  },
  voiceWaveText: {
    ...font,
    color: red,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 6,
  },
  voiceModalSecondary: {
    alignItems: 'center',
    borderColor: red,
    borderRadius: r.pill,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 18,
  },
  closeVoiceButton: {
    alignItems: 'center',
    backgroundColor: c.surfaceContainerHigh,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  voiceInputBox: {
    alignItems: 'center',
    backgroundColor: bg,
    borderRadius: r.pill,
    flexDirection: 'row',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 18,
  },
  voiceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  voiceDraftList: {
    gap: 12,
  },
  voiceTableRow: {
    alignItems: 'center',
    backgroundColor: '#fff1f2',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  voiceDraftRow: {
    alignItems: 'center',
    backgroundColor: bg,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  voiceRemoveButton: {
    alignItems: 'center',
    backgroundColor: '#ffdad6',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  emptyVoiceDraft: {
    alignItems: 'center',
    backgroundColor: bg,
    borderRadius: 20,
    gap: 4,
    padding: 18,
  },
  voiceSecondaryButton: {
    alignItems: 'center',
    borderColor: red,
    borderRadius: r.pill,
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  voiceApplyButton: {
    alignItems: 'center',
    backgroundColor: red,
    borderRadius: r.pill,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  voiceSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  voiceSuggestionChip: {
    backgroundColor: c.surfaceContainerLow,
    borderRadius: r.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: red,
    borderRadius: r.pill,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginHorizontal: 24,
    marginTop: 18,
    paddingVertical: 16,
    ...DineFlowShadows.level2,
  },
  disabledButton: {
    opacity: 0.45,
  },
  sendText: {
    ...font,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  statusTabs: {
    gap: 12,
    paddingBottom: 32,
    paddingTop: 24,
  },
  statusTab: {
    borderRadius: r.pill,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  statusTabActive: {
    backgroundColor: red,
    ...DineFlowShadows.level1,
  },
  statusTabIdle: {
    backgroundColor: '#ffffff',
  },
  statusTabText: {
    ...font,
    fontSize: 14,
    fontWeight: '700',
  },
  whiteText: {
    color: '#ffffff',
  },
  mutedText: {
    color: c.textSecondary,
  },
  kitchenGrid: {
    gap: 24,
  },
  kitchenCard: {
    gap: 24,
  },
  readyCard: {
    backgroundColor: 'rgba(243,243,243,0.6)',
    opacity: 0.8,
  },
  inlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  rightCopy: {
    alignItems: 'flex-end',
  },
  orderLine: {
    borderBottomColor: c.surfaceContainer,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  orderQty: {
    ...font,
    color: primary,
    fontSize: 14,
    fontWeight: '700',
  },
  orderItem: {
    ...font,
    color: c.textPrimary,
    fontSize: 16,
    lineHeight: 24,
  },
  noteText: {
    ...font,
    color: c.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  strikeText: {
    color: 'rgba(26,28,28,0.4)',
    textDecorationLine: 'line-through',
  },
  fadedText: {
    color: 'rgba(132,0,10,0.4)',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: red,
    borderWidth: 2,
    shadowOpacity: 0,
  },
  outlineButtonText: {
    color: red,
  },
  bodyMuted: {
    ...font,
    color: c.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  metricGrid: {
    gap: 24,
    marginTop: 24,
  },
  metricCard: {
    minHeight: 160,
    justifyContent: 'space-between',
  },
  metricValue: {
    ...font,
    color: c.textPrimary,
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 48,
  },
  metricDetail: {
    ...font,
    color: primary,
    fontSize: 14,
    fontWeight: '700',
  },
  insightCard: {
    gap: 12,
    marginTop: 24,
    overflow: 'hidden',
  },
  insightHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  sparkIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(217,70,36,0.1)',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  insightLabel: {
    ...font,
    color: red,
    fontSize: 14,
    fontWeight: '700',
  },
  insightBody: {
    ...font,
    color: c.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  applyButton: {
    alignItems: 'center',
    backgroundColor: red,
    borderRadius: r.pill,
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 12,
  },
  chartCard: {
    marginTop: 24,
  },
  smallPill: {
    ...font,
    backgroundColor: c.surfaceContainerLow,
    borderRadius: r.pill,
    color: c.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    height: 200,
    justifyContent: 'space-between',
    marginTop: 24,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
    justifyContent: 'flex-end',
  },
  chartBar: {
    backgroundColor: red,
    borderTopLeftRadius: 99,
    borderTopRightRadius: 99,
    width: '100%',
  },
  chartLabel: {
    ...font,
    color: c.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  popularHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  linkText: {
    ...font,
    color: red,
    fontSize: 14,
    fontWeight: '700',
  },
  popularList: {
    gap: 16,
    marginTop: 16,
  },
  popularCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    padding: 16,
  },
  popularImage: {
    borderRadius: 16,
    height: 64,
    width: 64,
  },
  authScroll: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 48,
    paddingTop: 48,
  },
  loginMark: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 48,
    height: 96,
    justifyContent: 'center',
    marginBottom: 24,
    width: 96,
    ...DineFlowShadows.level1,
  },
  signUpMark: {
    alignItems: 'center',
    backgroundColor: red,
    borderRadius: 24,
    height: 64,
    justifyContent: 'center',
    marginBottom: 24,
    width: 64,
    ...DineFlowShadows.level2,
  },
  authTitle: {
    ...font,
    color: red,
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 48,
    textAlign: 'center',
  },
  authSubtitle: {
    ...font,
    color: c.textSecondary,
    fontSize: 18,
    lineHeight: 28,
    marginTop: 4,
    textAlign: 'center',
  },
  authCard: {
    borderRadius: 32,
    gap: 24,
    marginTop: 48,
    width: '100%',
  },
  accessButton: {
    marginTop: 32,
  },
  aiStatusCard: {
    gap: 12,
    marginTop: 24,
  },
  specialtyCard: {
    gap: 12,
    marginTop: 24,
  },
  specialtyWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  specialtyChip: {
    borderRadius: r.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  segmented: {
    backgroundColor: c.surfaceContainer,
    borderRadius: r.pill,
    flexDirection: 'row',
    padding: 6,
  },
  segment: {
    alignItems: 'center',
    borderRadius: r.pill,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  segmentActive: {
    backgroundColor: red,
  },
  segmentText: {
    ...font,
    color: c.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  errorMessage: {
    ...font,
    color: c.danger,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  companyIdBox: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    gap: 6,
    padding: 20,
    ...DineFlowShadows.level1,
  },
  companyIdText: {
    ...font,
    color: red,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 1,
  },
  secondaryAuthButton: {
    alignItems: 'center',
    borderColor: red,
    borderRadius: r.pill,
    borderWidth: 2,
    height: 56,
    justifyContent: 'center',
    width: '100%',
  },
  secondaryAuthText: {
    ...font,
    color: red,
    fontSize: 14,
    fontWeight: '700',
  },
  workerForm: {
    gap: 18,
    marginTop: 24,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  roleChip: {
    alignItems: 'center',
    backgroundColor: c.surfaceContainerHigh,
    borderRadius: r.pill,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  workerCard: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
  },
  signupForm: {
    gap: 24,
    marginTop: 32,
    width: '100%',
  },
  authField: {
    width: '100%',
  },
  fieldLabel: {
    ...font,
    color: c.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 24,
  },
  fieldBox: {
    alignItems: 'center',
    backgroundColor: bg,
    borderRadius: r.pill,
    flexDirection: 'row',
    gap: 12,
    height: 64,
    paddingHorizontal: 20,
  },
  fieldBoxCompact: {
    backgroundColor: '#ffffff',
    height: 56,
    ...DineFlowShadows.level1,
  },
  fieldInput: {
    ...font,
    color: c.textPrimary,
    flex: 1,
    fontSize: 16,
  },
  authButton: {
    alignItems: 'center',
    backgroundColor: red,
    borderRadius: r.pill,
    flexDirection: 'row',
    gap: 8,
    height: 56,
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
    ...DineFlowShadows.level2,
  },
  forgotText: {
    ...font,
    color: c.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  authDivider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 24,
    marginTop: 48,
  },
  dividerLine: {
    backgroundColor: c.surfaceContainerHighest,
    borderRadius: 4,
    height: 4,
    width: 48,
  },
  helpGrid: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 24,
    width: '100%',
  },
  infoTile: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 24,
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 24,
  },
  pinHint: {
    ...font,
    color: 'rgba(92,64,61,0.6)',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 24,
    marginTop: -16,
  },
  loginLink: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 24,
  },
  dineflowStamp: {
    ...font,
    color: c.border,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1.6,
  },
});
