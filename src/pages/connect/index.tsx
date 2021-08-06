import { Box, Center, Container, Heading, Button } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { globalStore } from 'rekv';
import { useHistory } from 'react-router-dom';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import Layout from '../../layouts/common';
import { t } from '../../i18n';
import walletLogo from '../../assets/polkadot.png';
import { useQuery } from '../../utils/hook';
import polkadotIcon from '../../assets/box_title_polkadot_icon.png';
import Card from '../../components/card';
import AccountList from '../../components/accountList';

const Connect: FC = () => {
  // const params = useParams<{ callbackUrl: string; }>();
  const query = useQuery();
  const callbackUrl = query.get('callbackUrl');
  const [injected, setInjected] = useState(false);
  const [injectedAccounts, setInjectedAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const history = useHistory();

  useEffect(() => {
    const initExtension = async () => {
      const allInjected = await web3Enable('NFTMart');
      if (allInjected.length === 0) {
        setInjected(false);
      } else {
        setInjected(true);
        // get accounts info in extension
        const web3InjectedAccounts = await web3Accounts();
        if (web3InjectedAccounts.length !== 0) {
          setInjectedAccounts(web3InjectedAccounts);
          // TODO add backend integration
        }
      }
    };

    initExtension();
  }, []);

  const handleClick = async (index: number) => {
    // treat first account as signer
    const injector = await web3FromSource(injectedAccounts[index].meta.source);
    globalStore.setState({
      accounts: injectedAccounts,
      account: injectedAccounts[index],
      injector,
    });
    if (callbackUrl && callbackUrl.length > 0) {
      history.push(callbackUrl);
    } else {
      history.push('/');
    }
  };

  return (
    <Layout title={'connect'}>
      <Box display="flex">
        <Container width="1180px">
          {!injected ? (
            <Center h="100vh" w="100vw">
              <Box display="flex" flexDirection="column" alignItems="center">
                <Heading as="h4" size="md">
                  {t('extension.dowload')}
                </Heading>
                <Box alt="waleet_logo" as="img" src={walletLogo} width="160px" margin="30px auto" />
                <Button
                  width="160px"
                  variant="primary"
                  onClick={() => window.open('https://polkadot.js.org/extension/', '_blank')}
                  isFullWidth
                >
                  {t('download')}
                </Button>
              </Box>
            </Center>
          ) : (
            <>
              {injectedAccounts.length > 0 ? (
                <Container paddingTop="20px" display="flex" justifyContent="center">
                  <Card
                    title={t('extension.select')}
                    icon={polkadotIcon}
                    bodyPadding={false}
                    w="790px"
                  >
                    <AccountList list={injectedAccounts} handleClick={handleClick} />
                  </Card>
                </Container>
              ) : (
                <Center h="100vh" w="100vw">
                  <Center height="100%" width="100%" flexDirection="column">
                    <Heading as="h4" size="md">
                      {t('extension.account')}
                    </Heading>
                  </Center>
                </Center>
              )}
            </>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default Connect;
