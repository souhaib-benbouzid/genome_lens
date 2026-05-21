import logo from '@/assets/favicon-32x32.png';
import {
  ActionIcon,
  Badge,
  Group,
  Image,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import IconMoon from '@tabler/icons-react/dist/esm/icons/IconMoon.mjs';
import IconSun from '@tabler/icons-react/dist/esm/icons/IconSun.mjs';
import { header } from './Navbar.module.css';

export function Navbar() {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme('dark');

  return (
    <header className={header}>
      <Group gap="xs" align="center">
        <Image
          src={logo}
          alt="GenomeLens logo"
          width={22}
          height={22}
          style={{ opacity: 0.9 }}
        />
        <Text
          fw={800}
          size="sm"
          style={{
            letterSpacing: '0.08em',
            background: 'linear-gradient(90deg, #a78bfa, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          GENOMELENS
        </Text>
      </Group>
      <Group gap="xs" ml="auto" align="center">
        <Badge
          size="xs"
          variant="light"
          color="violet"
          radius="sm"
          style={{ letterSpacing: '0.04em', fontWeight: 600 }}
        >
          v0.2.0
        </Badge>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          aria-label="Toggle colour scheme"
          onClick={() => setColorScheme(computed === 'dark' ? 'light' : 'dark')}
        >
          {computed === 'dark' ? <IconSun size={15} /> : <IconMoon size={15} />}
        </ActionIcon>
      </Group>
    </header>
  );
}
