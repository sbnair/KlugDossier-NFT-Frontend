import React, { FC, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Stack,
  Portal,
  Avatar,
  Text,
  Icon,
  Flex,
  Box,
  useToast,
} from '@chakra-ui/react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

import { globalStore } from 'rekv';
import { t } from '../../i18n';
import store from '../../stores/whiteList';
import NLink from '../link';
import { USER_LINKS } from '../../constants';

export interface LoginProps {
  avatar?: string;
  username?: string;
}

const Login: FC<LoginProps> = ({ avatar, username = 'no name' }) => {
  const location = useLocation();
  const toast = useToast();
  const { account } = globalStore.useState('account');
  const { whiteList } = store.useState('whiteList');

  const [opening, setOpening] = useState(false);
  const [hideMenu, setHideMenu] = useState(false);

  useEffect(() => {
    if (!account || whiteList.length === 0) {
      return;
    }
    const flag = whiteList.indexOf(account.address);
    if (flag < 0) {
      setHideMenu(true);
    } else {
      setHideMenu(false);
    }
  }, [whiteList, account]);

  // Link render helper
  const renderLink = (title: string) => {
    // add whitelist check hide menu
    function noJurisdiction() {
      toast({
        title: t('whitelist.not.tips'),
        status: 'warning',
        position: 'top',
        duration: 3000,
      });
    }
    const path = USER_LINKS[title];
    const active = location.pathname === path;
    if (hideMenu && (title === 'quick-area.nft.create' || title === 'quick-area.collections')) {
      return (
        <Box
          textAlign="center"
          linkProps={{
            paddingX: 4,
            display: 'block',
          }}
          color={'gray'}
          // onClick={noJurisdiction}
          key={title}
        >
          {t(title)}
        </Box>
      );
    }

    return (
      <NLink
        title={title}
        path={path}
        active={active}
        bgSize="cover"
        textAlign="center"
        linkProps={{
          paddingX: 4,
          display: 'block',
        }}
        key={title}
      />
    );
  };

  // Menus
  const menus = <Stack paddingY={2}>{Object.keys(USER_LINKS).map(renderLink)}</Stack>;

  // Trigger
  const triggerContent = (
    <Stack
      direction="row"
      alignItems="center"
      cursor="pointer"
      spacing={2}
      px={2}
      // _hover={{ backgroundColor: colors.bg.light1 }}
    >
      <Avatar size="sm" src={avatar} />
      <Flex align="center">
        <Box maxWidth="120px">
          <Text fontSize="sm" fontWeight="bold" userSelect="none" isTruncated>
            {username}
          </Text>
        </Box>

        {/* <Icon
          marginLeft={0}
          marginInlineStart={0}
          as={opening ? IoMdArrowDropup : IoMdArrowDropdown}
        /> */}
      </Flex>
    </Stack>
  );

  return (
    <Popover
      placement="bottom"
      trigger="hover"
      size="sm"
      variant="menu"
      onOpen={() => setOpening(true)}
      onClose={() => setOpening(false)}
    >
      <PopoverTrigger>{triggerContent}</PopoverTrigger>
      <Portal>
        {/* TODO: Move focus property else where to have common use */}
        <PopoverContent maxWidth="200px" _focus={{ boxShadow: 'none' }}>
          <PopoverArrow />
          <PopoverBody display="flex" justifyContent="center">
            {menus}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default Login;
