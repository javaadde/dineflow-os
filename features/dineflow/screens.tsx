import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { PropsWithChildren, useMemo, useState } from 'react';
import {
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

const red = '#B00012';
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

type NavKey = 'order' | 'waiter' | 'kitchen' | 'manager';

const navItems: { key: NavKey; icon: keyof typeof MaterialIcons.glyphMap; href: string }[] = [
  { key: 'order', icon: 'restaurant-menu', href: '/order' },
  { key: 'waiter', icon: 'table-restaurant', href: '/waiter' },
  { key: 'kitchen', icon: 'receipt-long', href: '/kitchen' },
  { key: 'manager', icon: 'settings', href: '/manager' },
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
  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const selected = item.key === active;

        return (
          <Pressable
            key={item.key}
            onPress={() => router.push(item.href as never)}
            style={[styles.navItem, selected && styles.navItemActive]}>
            <DIcon name={item.icon} color={selected ? '#ffffff' : 'rgba(255,255,255,0.7)'} size={25} />
          </Pressable>
        );
      })}
    </View>
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
          <Pressable style={styles.backCircle} onPress={() => router.back()}>
            <DIcon name="arrow-back" color={red} />
          </Pressable>
        ) : (
          <Image source={{ uri: profile }} style={styles.avatar} contentFit="cover" />
        )}
        <Text style={[styles.topTitle, { color: titleColor }]}>{title}</Text>
      </View>
      <View style={styles.topRight}>
        <DIcon name="notifications" color={showBack ? '#94a3b8' : red} />
        {showBack ? <Image source={{ uri: profile }} style={styles.smallAvatar} contentFit="cover" /> : null}
      </View>
    </View>
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
    <ScreenShell active="waiter" backgroundColor={bg}>
      <TopBar title="Welcome back, Chef" titleColor={red} />
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroller}>
        {['All', 'Free', 'Active', 'Waiting', 'Delayed'].map((label, index) => (
          <Chip key={label} label={label} active={index === 0} />
        ))}
      </ScrollView>
      <View style={styles.cardGrid}>
        {tables.map((table, index) => (
          <TableCard key={table.id} table={table} index={index} />
        ))}
      </View>
    </ScreenShell>
  );
}

function TableCard({ table, index }: { table: (typeof tables)[number]; index: number }) {
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
      <Pressable style={styles.primaryButton}>
        <DIcon name={table.icon} color="#ffffff" size={20} />
        <Text style={styles.primaryButtonText}>{table.action}</Text>
      </Pressable>
    </SoftCard>
  );
}

const menu = [
  ['APPETIZER', 'Caprese Salad', '$14.50'],
  ['APPETIZER', 'Crispy Calamari', '$16.00'],
  ['APPETIZER', 'Garlic Prawns', '$18.50'],
  ['MAINS', 'Ribeye Steak', '$32.00'],
];

export function OrderCreationScreen() {
  return (
    <ScreenShell active="order" backgroundColor={lowBg} noTopPad contentStyle={styles.orderScroll}>
      <TopBar title="New Order - Table 12" showBack />
      <View style={styles.hero}>
        <View style={styles.heroText}>
          <Text style={styles.heroEyebrow}>Chef&apos;s Special</Text>
          <Text style={styles.heroTitle}>Truffle Risotto</Text>
        </View>
        <Image source={{ uri: specialDish }} style={styles.heroDish} contentFit="cover" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroller}>
        {['Appetizers', 'Mains', 'Drinks', 'Desserts'].map((label, index) => (
          <Chip key={label} label={label} active={index === 0} />
        ))}
      </ScrollView>
      <View style={styles.menuGrid}>
        {menu.map(([category, name, price], index) => (
          <MenuItemCard key={name} category={category} name={name} price={price} image={menuImages[index]} index={index} />
        ))}
      </View>
      <SoftCard style={styles.orderTray}>
        <View style={styles.trayLeft}>
          <View style={styles.cartIcon}>
            <DIcon name="shopping-cart" color={red} size={30} />
          </View>
          <View>
            <Text style={styles.trayTitle}>Caprese Salad</Text>
            <Text style={styles.smallLabel}>Selection for order list</Text>
          </View>
        </View>
        <View style={styles.trayBottom}>
          <View style={styles.quantityPill}>
            <Pressable style={styles.qtyButtonLight}>
              <DIcon name="remove" color={primary} />
            </Pressable>
            <Text style={styles.qtyText}>2</Text>
            <Pressable style={styles.qtyButtonRed}>
              <DIcon name="add" color="#ffffff" />
            </Pressable>
          </View>
          <View style={styles.subtotal}>
            <Text style={styles.tinyLabel}>SUBTOTAL</Text>
            <Text style={styles.subtotalText}>$29.00</Text>
          </View>
        </View>
      </SoftCard>
      <Pressable style={styles.voiceButton}>
        <DIcon name="mic" color="#ffffff" size={28} />
      </Pressable>
      <Pressable style={styles.sendButton}>
        <Text style={styles.sendText}>Send to Kitchen</Text>
        <DIcon name="restaurant" color="#ffffff" />
      </Pressable>
    </ScreenShell>
  );
}

function MenuItemCard({
  category,
  name,
  price,
  image,
  index,
}: {
  category: string;
  name: string;
  price: string;
  image: string;
  index: number;
}) {
  return (
    <SoftCard enteringIndex={index} style={styles.menuCard}>
      <Pressable style={styles.favorite}>
        <DIcon name="favorite-border" color={index === 0 || index === 2 ? red : c.border} size={20} />
      </Pressable>
      <Image source={{ uri: image }} style={styles.menuImage} contentFit="cover" />
      <View style={styles.menuCopy}>
        <Text style={styles.tinyLabel}>{category}</Text>
        <Text numberOfLines={1} style={styles.menuName}>
          {name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>{price}</Text>
          <Pressable style={styles.addButton}>
            <DIcon name="add" color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </SoftCard>
  );
}

type KitchenStatus = 'pending' | 'cooking' | 'ready';

const kitchenOrders = [
  {
    order: 'Order #2401',
    table: 'Table 12',
    elapsed: '18m elapsed',
    server: 'Server: Elena',
    status: 'Delayed',
    tone: 'alert' as const,
    items: [
      ['2x', 'Wagyu Burger', 'Well Done'],
      ['1x', 'Truffle Fries', 'No Salt'],
    ],
    action: 'Start Cooking',
    state: 'pending' as KitchenStatus,
  },
  {
    order: 'Order #2405',
    table: 'Table 04',
    elapsed: '08m elapsed',
    server: 'Server: Marcus',
    status: 'Cooking',
    tone: 'soft' as const,
    items: [
      ['1x', 'Pan-Seared Scallops', ''],
      ['1x', 'Lobster Bisque', ''],
      ['1x', 'Dry-Aged Ribeye', 'Medium Rare'],
    ],
    action: 'Mark Ready',
    state: 'cooking' as KitchenStatus,
  },
  {
    order: 'Order #2408',
    table: 'Table 18',
    elapsed: '02m elapsed',
    server: 'Server: Sarah',
    status: 'Pending',
    tone: 'neutral' as const,
    items: [['4x', 'Miso Mackerel', '']],
    action: 'Start Cooking',
    state: 'pending' as KitchenStatus,
  },
  {
    order: 'Order #2399',
    table: 'Table 07',
    elapsed: 'Picked up',
    server: 'Server: Elena',
    status: 'Ready',
    tone: 'ready' as const,
    items: [['1x', 'Caesar Salad', '']],
    action: 'Recall Order',
    state: 'ready' as KitchenStatus,
  },
];

export function KitchenDashboardScreen() {
  const [selected, setSelected] = useState<KitchenStatus>('pending');
  const counts = useMemo(() => ({ pending: 8, cooking: 5, ready: 12 }), []);

  return (
    <ScreenShell active="kitchen" backgroundColor={bg}>
      <TopBar title="Kitchen Monitor" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusTabs}>
        {(['pending', 'cooking', 'ready'] as KitchenStatus[]).map((state) => (
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
        {kitchenOrders.map((order, index) => (
          <KitchenOrderCard key={order.order} order={order} index={index} />
        ))}
      </View>
    </ScreenShell>
  );
}

function KitchenOrderCard({ order, index }: { order: (typeof kitchenOrders)[number]; index: number }) {
  const ready = order.state === 'ready';
  return (
    <SoftCard enteringIndex={index} style={[styles.kitchenCard, ready && styles.readyCard]}>
      <View style={styles.cardHeader}>
        <View>
          <View style={styles.inlineRow}>
            <Text style={styles.boldLabel}>{order.order}</Text>
            <StatusPill label={order.status} tone={order.tone} />
          </View>
          <Text style={styles.headline}>{order.table}</Text>
        </View>
        <View style={styles.rightCopy}>
          <Text style={[styles.boldLabel, order.status === 'Delayed' && styles.errorText]}>{order.elapsed}</Text>
          <Text style={styles.smallLabel}>{order.server}</Text>
        </View>
      </View>
      <View>
        {order.items.map(([qty, item, note]) => (
          <View key={`${order.order}-${item}`} style={styles.orderLine}>
            <View style={styles.inlineRow}>
              <Text style={[styles.orderQty, ready && styles.fadedText]}>{qty}</Text>
              <Text style={[styles.orderItem, ready && styles.strikeText]}>{item}</Text>
            </View>
            {note ? <Text style={styles.noteText}>{note}</Text> : null}
          </View>
        ))}
      </View>
      <Pressable style={[styles.primaryButton, ready && styles.outlineButton]}>
        <DIcon name={ready ? 'history' : order.state === 'cooking' ? 'check-circle' : 'restaurant-menu'} color={ready ? red : '#ffffff'} />
        <Text style={[styles.primaryButtonText, ready && styles.outlineButtonText]}>{order.action}</Text>
      </Pressable>
    </SoftCard>
  );
}

export function ManagerDashboardScreen() {
  return (
    <ScreenShell active="manager" backgroundColor={lowBg}>
      <TopBar title="Welcome back, Chef" />
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
  return (
    <ScreenShell backgroundColor="#f5f5f5" contentStyle={styles.authScroll}>
      <View style={styles.loginMark}>
        <DIcon name="restaurant-menu" color={red} size={48} />
      </View>
      <Text style={styles.authTitle}>DineFlow OS</Text>
      <Text style={styles.authSubtitle}>Welcome back, Staff</Text>
      <SoftCard style={styles.authCard}>
        <AuthField label="Staff ID" placeholder="Enter your ID" icon="person" />
        <AuthField label="PIN" placeholder="••••" icon="lock" secureTextEntry />
        <Pressable style={styles.authButton} onPress={() => router.replace('/' as never)}>
          <Text style={styles.primaryButtonText}>Login</Text>
          <DIcon name="arrow-forward" color="#ffffff" size={18} />
        </Pressable>
        <Text style={styles.forgotText}>Forgot PIN?</Text>
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
  return (
    <ScreenShell backgroundColor={bg} contentStyle={styles.authScroll}>
      <View style={styles.signUpMark}>
        <DIcon name="restaurant-menu" color="#ffffff" size={32} />
      </View>
      <Text style={styles.authTitle}>Join the Team</Text>
      <Text style={styles.authSubtitle}>Set up your DineFlow OS staff account</Text>
      <View style={styles.signupForm}>
        <AuthField label="Full Name" placeholder="Enter your name" icon="person" compact />
        <AuthField label="Email" placeholder="email@restaurant.com" icon="mail" compact />
        <AuthField label="Role" placeholder="Select your position" icon="badge" rightIcon="expand-more" compact />
        <AuthField label="Create PIN" placeholder="4-digit security code" icon="lock" rightIcon="visibility" secureTextEntry compact />
        <Text style={styles.pinHint}>This PIN is used for quick terminal access.</Text>
        <Pressable style={styles.authButton} onPress={() => router.replace('/login' as never)}>
          <Text style={styles.primaryButtonText}>Create Account</Text>
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

function AuthField({
  label,
  placeholder,
  icon,
  rightIcon,
  secureTextEntry,
  compact,
}: {
  label: string;
  placeholder: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  secureTextEntry?: boolean;
  compact?: boolean;
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
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -24,
    marginTop: -12,
    paddingHorizontal: 24,
    paddingVertical: 16,
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
    backgroundColor: red,
    borderRadius: r.pill,
    bottom: 28,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    minWidth: 280,
    paddingHorizontal: 24,
    paddingVertical: 12,
    position: 'absolute',
    ...DineFlowShadows.nav,
  },
  navItem: {
    borderRadius: r.pill,
    padding: 12,
  },
  navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ scale: 1.1 }],
  },
  orderScroll: {
    paddingBottom: 176,
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
    backgroundColor: 'rgba(176,0,18,0.1)',
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
