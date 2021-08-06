import { Box, Center, Container, Heading, Stack, StackDivider, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { t } from '../../i18n';
import Layout from '../../layouts/common';
import colors from '../../themes/colors';

export interface NotFoundProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

const NotFound: FC<NotFoundProps> = ({ title, subtitle, description }) => {
  return (
    <Layout title={'title.not-found'}>
      <Box display="flex" paddingTop="20vh">
        <Container width="1180px">
          <Stack spacing={4}>
            <Heading>{title || t('not-found.title')}</Heading>
            <StackDivider />
            <Text color={colors.text.gray}>{subtitle || t('not-found.subtitle')}</Text>
            <Text color={colors.text.gray}>{description || t('not-found.description')}</Text>
          </Stack>
        </Container>
      </Box>
    </Layout>
  );
};

export default NotFound;
