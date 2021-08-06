import React, { FC, useEffect, useState } from 'react';
import {
  Container,
  Flex,
  useClipboard,
  useToast,
  IconButton,
  Button,
  Link,
  Text,
} from '@chakra-ui/react';
import Image, { Shimmer } from 'react-shimmer';
import { globalStore } from 'rekv';
import { CopyIcon } from '@chakra-ui/icons';
import { Keyring } from '@polkadot/api';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import NavLink from '../navlink';
import Login from '../login';
import ChangeLanguage from '../changeLanguage';
import LogoSrc from '../../assets/logo.png';
import { Z_INDEXES } from '../../constants';
import { getBalance } from '../../api/polka';
import accountStore from '../../stores/account';
import Balance from '../balance';
import { txLog } from '../../utils';

export interface HeaderProps {
  sticky?: boolean;
}

const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

const Header: FC<HeaderProps> = ({ sticky }) => {
  const history = useHistory();
  const { account, api } = globalStore.useState('account', 'api');
  const { balance } = accountStore.useState('balance');
  const { i18n, t } = useTranslation();
  const { hasCopied, onCopy } = useClipboard(account ? account.address : '');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  useEffect(() => {
    if (account?.address && api) {
      api.isReady.then(() => getBalance(account.address));
    }

    return () => {
      // cleanup
    };
  }, [account?.address, api]);

  const handleCopy = () => {
    toast({
      title: 'success',
      status: 'success',
      position: 'top',
      duration: 3000,
      description: t('copy.success'),
    });
    onCopy();
  };

  // const getFaucet = () => {
  //   const faucet = async () => {
  //     setLoading(true);
  //     const ss58Format = 50;
  //     const keyring = new Keyring({ type: 'sr25519', ss58Format });
  //     const alice = keyring.addFromUri('//Alice');
  //     const res = await api.tx.balances
  //       .transfer(account.address, '2100000000000000')
  //       .signAndSend(alice, (result: any) => {
  //         txLog(result, () => {
  //           toast({
  //             title: 'success',
  //             status: 'success',
  //             position: 'top',
  //             duration: 3000,
  //             description: t('fund.success'),
  //           });
  //           getBalance(account.address);
  //           setLoading(false);
  //         });
  //       });
  //   };

  //   return (
  //     <Button isLoading={loading} m={3} size="xs" variant="outline" onClick={faucet}>
  //       Faucet
  //     </Button>
  //   );
  // };

  return (
    <Flex
      as="header"
      flex={1}
      justify="space-between"
      backgroundColor="white"
      boxShadow="md"
      height="77px"
      position={sticky ? 'fixed' : 'initial'}
      top={0}
      left={0}
      right={0}
      zIndex={Z_INDEXES.header}
    >
      {/* <Flex
        mt="2px"
        background="#FDD971"
        width="100vw"
        p="2px"
        fontSize="13px"
        justifyContent="center"
        position="fixed"
        zIndex="10"
        top="0"
      >
        <Text>{t('nav.brand')}</Text>
        {i18n.language === 'zh-CN' ? (
          <Link color="#5E7E72" href="https://mp.weixin.qq.com/s/qEF0eZKrULMBCtQQm5r50g">
            {t('nav.details')}
          </Link>
        ) : (
          <Link
            color="#5E7E72"
            href="https://nftmart-io.medium.com/new-logo-announcement-daff46b1aaf1"
          >
            {t('nav.details')}
          </Link>
        )}
      </Flex> */}
      <Container
        py={2}
        maxW={1200}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex
          justify="center"
          mr={8}
          onClick={() => {
            history.push('/');
          }}
        >
          <Image
            NativeImgProps={{ style: { height: 60, width: 'auto' } }}
            src={LogoSrc}
            fallback={<Shimmer width={120} height={22} />}
            fadeIn
          />
        </Flex>

        <Flex flex="1 1 auto">
          <NavLink />
        </Flex>

        <Flex>
          {account?.meta ? (
            <Flex
              flex="1 1 auto"
              justifyContent="flex-end"
              alignItems="center"
              height="55px"
              mr={4}
            >
              <Login username={formatAddress(account.address)} avatar={account.meta.avatar} />
              <IconButton
                size="xs"
                variant="outline"
                m={2}
                aria-label="Add to friends"
                icon={<CopyIcon />}
                onClick={() => handleCopy()}
              />
              <Balance balance={balance} />
              {/* {getFaucet()} */}
            </Flex>
          ) : (
            <Flex>
              <Button
                as="a"
                variant="ghost"
                ml={4}
                onClick={() => {
                  history.push('/connect');
                }}
              >
                {t('login')}
              </Button>
            </Flex>
          )}
          <ChangeLanguage />
        </Flex>
      </Container>
    </Flex>
  );
};

export default Header;
