import React from 'react';
import { Stack, Flex, Center, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Card from '../../../components/card';
import NSelect from '../../../components/nSelect';
import colors from '../../../themes/colors';
import PriceHistoryChart from '../PriceHistoryChart';

const PriceHistoryCard = () => {
  const { t } = useTranslation();

  return (
    <Card title={t('detail.title.price')} h="300px">
      <Stack spacing={4}>
        <Center direction="row" spacing={4}>
          {/* <NSelect
            options={[
              { title: '最近7天', value: 7 },
              { title: '最近30天', value: 30 },
            ]}
            suffix
          />

          <Flex direction="column" justify="space-between">
            <Text color={colors.text.gray}>7天成交价格</Text>
            <Heading as="h4" size="md">
              187,123
            </Heading>
          </Flex>

          <Flex direction="column" justify="space-between">
            <Text color={colors.text.gray}>7天成交价格</Text>
            <Heading as="h4" size="md">
              187,123
            </Heading>
          </Flex> */}
          <Flex>{t('order.coming.soon')}</Flex>
        </Center>

        {/* <PriceHistoryChart /> */}
      </Stack>
    </Card>
  );
};

export default PriceHistoryCard;
