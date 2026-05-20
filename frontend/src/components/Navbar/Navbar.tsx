import logo from '@/assets/favicon-32x32.png';
import { Group, Image, Text } from '@mantine/core';
import { header } from './Navbar.module.css';
export function Navbar() {
  return (
    <header className={header}>
      <Image src={logo} alt="GenomeLens logo" width={24} height={24} />
      <Text fw={700} size="sm" style={{ letterSpacing: '0.05em' }}>
        GenomeLens
      </Text>
      <Group gap={4} ml="auto">
        <Text size="xs" c="gray.5">
          v0.1.0
        </Text>
      </Group>
    </header>
  );
}
