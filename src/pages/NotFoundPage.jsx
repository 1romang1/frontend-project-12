import { Button, Center, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Center mih="calc(100dvh - 64px)">
      <Stack align="center" gap="md">
        <Title order={1}>404</Title>
        <Text>{t('notFound.title')}</Text>
        <Button component={Link} to="/">{t('notFound.backToChat')}</Button>
      </Stack>
    </Center>
  );
}
