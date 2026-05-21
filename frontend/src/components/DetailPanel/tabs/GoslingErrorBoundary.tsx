import { Center, Stack, Text } from '@mantine/core';
import IconAlertTriangle from '@tabler/icons-react/dist/esm/icons/IconAlertTriangle.mjs';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class GoslingErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('[GoslingErrorBoundary] caught:', error, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <Center h={200}>
          <Stack align="center" gap="xs">
            <IconAlertTriangle
              size={32}
              color="var(--mantine-color-orange-5)"
            />
            <Text c="dimmed" size="sm" ta="center">
              Genomic track could not be rendered.
              <br />
              WebGL may be unavailable in this environment.
            </Text>
          </Stack>
        </Center>
      );
    }
    return this.props.children;
  }
}
