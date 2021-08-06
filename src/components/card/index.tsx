import React, { FC } from 'react';
import { HTMLChakraProps, Box, Heading, Divider } from '@chakra-ui/react';
import colors from '../../themes/colors';

export const CardHead: FC<HTMLChakraProps<'div'>> = ({ children, ...restProps }) => (
  <Box paddingX={4} display="inline-block">
    <Box paddingY={4}>
      <Heading as="h4" size="md" color={colors.text.black}>
        {children}
      </Heading>
    </Box>
  </Box>
);

type CardBodyProps = {
  bodyPadding: boolean;
} & HTMLChakraProps<'div'>;

export const CardBody: FC<CardBodyProps> = ({ children, bodyPadding, ...restProps }) => (
  <Box paddingX={bodyPadding ? 4 : 0}>
    <Box paddingY={bodyPadding ? 4 : 0}>{children}</Box>
  </Box>
);

export interface CardProps {
  title?: React.ReactNode;
  icon?: string;
  body?: React.ReactNode;
  bodyPadding?: boolean;
  noHeadBorder?: boolean;
}

const Card: FC<Omit<HTMLChakraProps<'div'>, 'title'> & CardProps> = ({
  title,
  icon,
  noHeadBorder = false,
  body,
  bodyPadding = true,
  children,
  ...restProps
}) => {
  return (
    <Box borderRadius="3px" backgroundColor="white" padding={0} {...restProps}>
      {icon && (
        <Box as="img" src={icon} w="22px" h="22px" marginLeft="20px" display="inline-block" />
      )}
      {title && <CardHead>{title}</CardHead>}
      {title && !noHeadBorder && <Divider borderColor={colors.divider.dark} />}
      {body || <CardBody bodyPadding={bodyPadding}>{children}</CardBody>}
    </Box>
  );
};

export default Card;
