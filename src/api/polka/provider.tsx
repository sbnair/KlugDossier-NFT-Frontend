import React, { useEffect, useMemo, useState } from 'react';
import { Center, Spinner, Button, Box, Text, Heading } from '@chakra-ui/react';
import { globalStore } from 'rekv';
import { web3Accounts, web3FromSource, web3Enable } from '@polkadot/extension-dapp';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

import { initPolkadotApi, getCategories, getWhiteList } from './index';
import store from '../../stores/categories';
import whiteListStore from '../../stores/whiteList';

import { REACT_APP_GA } from '../../constants';

interface Props {
  children: React.ReactNode;
}

const provider = ({ children }: Props) => {
  // init polkadot api
  ReactGA.initialize(REACT_APP_GA);
  const history = useHistory();
  const location = useLocation();
  // query cate
  const queryCategories = async () => {
    let categories = await getCategories();
    categories = categories.map((cat: any) => {
      return cat.metadata.name;
    });
    store.setState({ categories });
  };
  // query whitelist
  const queryWhiteList = async () => {
    const whiteList = await getWhiteList();

    whiteListStore.setState({ whiteList });
  };
  initPolkadotApi(() => {
    queryCategories();
    queryWhiteList();
  });

  const { t } = useTranslation();

  const { api, accounts = null } = globalStore.useState('api', 'accounts');
  // extension inject status

  // const accessAvailable = useMemo(() => api && injected && accounts, [api, injected, accounts]);
  const accessAvailable = useMemo(() => {
    return api;
  }, [api]);

  const initLoginStatu = async () => {
    const allInjected = await web3Enable('NFTMart');
    if (allInjected.length === 0) {
      history.push('/connect');
    } else {
      // get accounts info in extension
      const injectedAccounts = await web3Accounts();
      if (injectedAccounts.length !== 0) {
        // treat first account as signer
        history.push('/connect');
      }
    }
  };
  // Update latest header block
  useEffect(() => {
    const subscribeHead = async () => {
      if (api) {
        api.isReady.then(() => {
          api.rpc.chain.subscribeNewHeads((lastHeader: any) => {
            const blockNumber = lastHeader.number.toHuman().replace(/,/g, '');
            globalStore.setState({ blockNumber: Number(blockNumber) });
          });
        });
      }
    };

    subscribeHead();
    initLoginStatu();
  }, [api]);

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
    // console.log('page view', process.env.REACT_APP_GA, location.pathname + location.search)
  }, [location.pathname, location.search]);

  // return children;

  return (
    <>
      {accessAvailable ? (
        children
      ) : (
        <Center w="100%">
          <Spinner />
        </Center>
      )}
    </>
  );
};

export default provider;
