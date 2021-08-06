import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';
import { Flex, Spacer, Text } from '@chakra-ui/react';

import { trimStr } from '../../utils';
import { PINATA_SERVER } from '../../constants';
import Card from '../../components/card';

const AboutCard: FC<{ about: any }> = ({ about }) => {
  const { t } = useTranslation();
  const { metadata, totalIssuance } = about;
  return (
    <Card title={t('detail.title.class')}>
      {/* <ReactJson
        name={false}
        src={about}
        indentWidth={1}
        collapseStringsAfterLength={100}
        enableClipboard={false}
        displayDataTypes={false}
      /> */}

      <Flex>
        <Text>{t('name')}</Text>
        <Spacer /><Text>{metadata.name}</Text>
      </Flex>
      {/* <Flex>
        <Text>{t('url')}</Text>
        <Spacer />
        <Text
          as="a"
          cursor="pointer"
          color="primary"
          onClick={() => window.open(`${PINATA_SERVER}${metadata.url}`)}
        >
          {trimStr(metadata.url)}
        </Text>
      </Flex> */}
      {metadata.externalUrl && (
        <Flex>
          <Text>{t('external')}</Text>
          <Spacer />
          <Text
            as="a"
            cursor="pointer"
            color="primary"
            onClick={() => window.open(`${metadata.externalUrl}`)}
          >
            {metadata.externalUrl}
          </Text>
        </Flex>
      )}
      <Flex>
        <Text>{t('total')}</Text>
        <Spacer /><Text>{totalIssuance}</Text>
      </Flex>
    </Card>
  );
};

export default AboutCard;
