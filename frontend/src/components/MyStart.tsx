import { Button, Stack, Text, TextInput, Title } from '@mantine/core';
import { button } from './MyStart.module.css';

export function MyStart() {
  return (
    <Stack gap="md">
      <Title order={2}>Hello Mantine</Title>
      <Text c="dimmed">Some description</Text>
      <TextInput label="Gene name" placeholder="e.g. BRCA1" />
      <Button className={button}>Search</Button>
    </Stack>
  );
}
