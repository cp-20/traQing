import { Box, Group, Stack } from '@mantine/core';
import type { FC, ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
};

export const Container: FC<ContainerProps> = ({ children }) => {
  return (
    <Box>
      <Stack gap="lg" w="100%">
        {children}
      </Stack>
    </Box>
  );
};

type ContainerTitleProps = {
  children: ReactNode;
  actions?: ReactNode;
};

export const ContainerTitle: FC<ContainerTitleProps> = ({ children, actions }) => {
  return (
    <Group justify="space-between" align="center" gap="md" wrap="wrap">
      <Group gap="sm" align="center" fz="h2" fw={700}>
        {children}
      </Group>
      {actions && <Group justify="flex-end">{actions}</Group>}
    </Group>
  );
};
