import {
  AppShell,
  Box,
  Burger,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Skeleton,
  Title,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBell,
  IconBraces,
  IconHash,
  IconHome,
  IconMessageCircle,
  IconMoon,
  IconMoodSmile,
  IconSun,
  IconTags,
  IconUsers,
} from '@tabler/icons-react';
import type { FC, ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import LogoImage from '@/assets/logo.svg';
import { UserAvatar } from '@/components/UserAvatar';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { to: '/', label: 'ダッシュボード', icon: IconHome },
  { to: '/users', label: 'ユーザー', icon: IconUsers },
  { to: '/channels', label: 'チャンネル', icon: IconHash },
  { to: '/stamps', label: 'スタンプ', icon: IconMoodSmile },
  { to: '/messages', label: 'メッセージ', icon: IconMessageCircle },
  { to: '/groups', label: 'グループ', icon: IconUsers },
  { to: '/tags', label: 'タグ', icon: IconTags },
  { to: '/subscriptions', label: '通知管理', icon: IconBell },
  { to: '/playground', label: 'APIプレイグラウンド', icon: IconBraces },
];

type Props = {
  children: ReactNode;
};

export const AppLayout: FC<Props> = ({ children }) => {
  const [opened, { toggle, close }] = useDisclosure();
  const location = useLocation();
  const { me } = useAuth();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');
  const isDark = computedColorScheme === 'dark';

  const nav = (
    <Stack h="100%" gap="md">
      <Group px="md" h={60} justify="center">
        <img src={LogoImage} alt="traQing" width={112} />
      </Group>
      <ScrollArea flex={1} px="xs">
        <Stack gap={4}>
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
            return (
              <NavLink
                active={active}
                color="blue"
                component={Link}
                key={to}
                label={label}
                leftSection={<Icon size={18} />}
                onClick={close}
                className="traqing-sidebar-nav-link"
                styles={{
                  root: {
                    borderRadius: 4,
                  },
                }}
                to={to}
                variant="subtle"
              />
            );
          })}
        </Stack>
      </ScrollArea>
      <UnstyledButton
        className="traqing-sidebar-button"
        mx="md"
        px="sm"
        py="xs"
        onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
      >
        <Group gap="sm" c="var(--traqing-sidebar-text)">
          {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
          <Text size="sm" fw={600}>
            {isDark ? 'ライトモード' : 'ダークモード'}
          </Text>
        </Group>
      </UnstyledButton>
      <Box pb="md">
        {me ? (
          <UnstyledButton
            className="traqing-sidebar-button"
            component={Link}
            mx="md"
            onClick={close}
            px="sm"
            py="xs"
            to={`/users/${encodeURIComponent(me.name)}`}
          >
            <Group gap="sm" wrap="nowrap">
              <UserAvatar user={me} size={32} />
              <Box miw={0} flex={1}>
                <Text c="var(--traqing-sidebar-text)" fw={600} truncate>
                  {me.displayName}
                </Text>
                <Text c="var(--traqing-sidebar-dimmed)" size="xs" truncate>
                  @{me.name}
                </Text>
              </Box>
            </Group>
          </UnstyledButton>
        ) : (
          <UnstyledButton className="traqing-sidebar-button" component="div" mx="md" px="sm" py="xs">
            <Group gap="sm" wrap="nowrap">
              <Skeleton circle h={32} w={32} />
              <Box miw={0} flex={1}>
                <Stack gap={4}>
                  <Skeleton h={14} w="70%" />
                  <Skeleton h={10} w="45%" />
                </Stack>
              </Box>
            </Group>
          </UnstyledButton>
        )}
      </Box>
    </Stack>
  );

  return (
    <AppShell
      header={{ height: { base: 56, md: 0 } }}
      navbar={{ width: 252, breakpoint: 'md', collapsed: { mobile: !opened } }}
      padding="lg"
      styles={{
        main: {
          background: 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-9))',
        },
        navbar: {
          background: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-9))',
          borderColor: 'light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-5))',
        },
        header: {
          background: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-9))',
          borderColor: 'light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-5))',
        },
      }}
    >
      <AppShell.Header hiddenFrom="md">
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Title order={1} size="h4">
              traQing
            </Title>
          </Group>
          {me && (
            <ThemeIcon variant="transparent" size="lg">
              <UserAvatar user={me} size={28} />
            </ThemeIcon>
          )}
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>{nav}</AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
