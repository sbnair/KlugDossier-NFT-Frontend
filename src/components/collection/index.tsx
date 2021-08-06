import React, { useCallback, useMemo } from 'react';
import {
  forwardRef,
  ChakraProps,
  chakra,
  ComponentWithAs,
  Box,
  Flex,
  Center,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { motion, MotionProps, isValidMotionProp } from 'framer-motion';
import Image, { Shimmer } from 'react-shimmer';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { omit } from 'ramda';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import colors from '../../themes/colors';
import { Work } from '../../types';
import { toFixedDecimals } from '../../utils';
import { actions } from '../../stores/assets';
import { PINATA_SERVER } from '../../constants';
import { parseMoneyText } from '../../utils/fomart';

type CollectionProps = {
  isSet?: boolean;
} & Partial<Work>;

export type MotionBoxProps = Omit<ChakraProps, keyof MotionProps> &
  MotionProps & {
    as?: React.ElementType;
  };

// TODO: Should we abstract motion to a common component?
export const MotionBox = motion.custom(
  forwardRef<MotionBoxProps, 'div'>((props, ref) => {
    const chakraProps = Object.fromEntries(
      // do not pass framer props to DOM element
      Object.entries(props).filter(([key]) => !isValidMotionProp(key)),
    );
    // FIXME: ref type imcompatible
    return <chakra.div ref={ref as any} {...chakraProps} />;
  }),
) as ComponentWithAs<'div', MotionBoxProps>;

// FIXME: MotionBox seems to have a bit rendering issue which looks like crashing
const Collection = (props: CollectionProps) => {
  const { t } = useTranslation();
  const { classId, tokenId: id, name, price, isSet = false, url, pledge, status } = props;
  const history = useHistory();

  const picUrl = useMemo(() => `${PINATA_SERVER}${url}`, []);
  const normalizedPledge = useMemo(() => {
    if (!pledge) return 0;
    const { value, unit } = parseMoneyText(pledge);
    // TODO: as a component
    return `${value} ${unit}`;
  }, [pledge]);

  const disPrice = useMemo(() => {
    if (!price) return 0;
    const { value, unit } = parseMoneyText(String(price));
    // TODO: as a component
    return `${value} ${unit}`;
  }, [price]);

  const dispense = () => {
    actions.selectAsset(omit(['isSet'], props as Work));
    history.push(`/detail/${classId}/${id}`);
  };

  const handleCollectionClick = useCallback(dispense, [classId, id]);

  // TODO: Might wanna move link outside
  return (
    <MotionBox
      onClick={handleCollectionClick}
      width="300px"
      height="442px"
      backgroundColor="#fff"
      borderRadius="4px"
      cursor="pointer"
      _hover={{ boxShadow: 'lg' }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      display="flex"
      flexDirection="column"
    >
      <LazyLoadImage
        wrapperProps={{
          style: {
            width: '300px',
            height: '295px',
            borderBottom: `1px solid ${colors.divider.dark}`,
            display: 'flex',
            justifyContent: 'center',
          },
        }}
        style={{
          objectFit: 'contain',
          maxWidth: '100%',
          maxHeight: '100%',
          borderRadius: '5px',
        }}
        src={picUrl as string}
        effect="none"
        fallback={<Shimmer height={295} width={300} />}
        fadeIn
      />

      <Box
        mt="16px"
        display="flex"
        justifyContent="space-between"
        p="0 16px"
        height="17px"
        lineHeight="17px"
        fontSize="12px"
        color={colors.text.gray}
      >
        <Box userSelect="none">{t('component.collection.title')}</Box>
        {price && (
          <Box userSelect="none" flex="1" textAlign="right">
            {t('component.collection.price')}
          </Box>
        )}
      </Box>
      <Box
        mt="8px"
        display="flex"
        justifyContent="space-between"
        maxHeight="56px"
        padding="0 16px 16px 16px"
        paddingBottom={status === 1 ? 0 : '16px'}
        fontWeight="600"
        color={colors.text.black}
        flex="1"
      >
        <Box pr={2} flex="2" overflow="hidden" textOverflow="ellipsis">
          <Flex align="center" lineHeight="18px">
            {name}
          </Flex>
        </Box>
        {price && (
          <Box flex="1" textAlign="right" display="flex" justifyContent="flex-end">
            <Flex align="flex-start">
              {/* {isSet && <Box src={PriceIcon} as="img" alt="" mr="4px" />} */}
              <Box>{disPrice}</Box>
            </Flex>
          </Box>
        )}
      </Box>
      {status === 1 && (
        <Box padding="0 16px 16px" display="inline-block">
          {/* TODO: Add helper text like tooltip to help guiding user */}
          {/* <Tooltip
            label={t('component.collection.pledge.tooltip')}
            placement="top-start"
            children={ */}
          <Text color={colors.text.gray} fontSize="12px">
            {t('component.collection.pledge')}
          </Text>

          <Text fontWeight="bold">{normalizedPledge}</Text>
        </Box>
      )}
    </MotionBox>
  );
};

export default Collection;
