import React, { FC, useEffect, useState } from 'react';
import { Box, Center, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { globalStore } from 'rekv';
import { useQuery } from 'react-query';

import store, { actions } from '../../stores/assets';
import cateStore from '../../stores/categories';

import Alert from './Alert';

import HistoryEventCard from './HisotryEventCard';
import PriceHistoryCard from './PriceHistoryCard';

import PurchaseCard from './PurchaseCard';
import DetailContainer from './DetailContainer';
import ImageCard from './ImageCard';
import IntroCard from './IntroCard';
import MetaCard from './MetaCard';
import ClassInfo from './AboutCard';

import PurchaseModal from './PurchaseModal';
import SalesSettingModal from './SalesSettingModal';

import { getNft, getOrder, deleteOrder, takeOrder, getBalance } from '../../api/polka';
import { useMyAssetsQuery, useMyCollectionsQuery } from '../../api/query';
import { toFixedDecimals, redirectConnect } from '../../utils';
import { parseMoneyText } from '../../utils/fomart';
import { PINATA_SERVER } from '../../constants';
import NotFound from '../notFound';
import colors from '../../themes/colors';
import { useLogin } from '../../utils/useLogin';

const Detail: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const { login } = useLogin();
  const params = useParams<{ classId: string; tokenId: string }>();
  const { classId, tokenId } = params;
  const location = useLocation();
  const history = useHistory();
  const { account } = globalStore.useState('account');

  const { categories } = cateStore.useState('categories');
  // const { data: assetsResponse } = GetItems({ id: Number(params?.token) ?? -1, pageSize: 1 });

  const [cancelLoading, setCancelLoading] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  const { selectedAsset } = store.useState('selectedAsset');

  const { refetch: refetchMyAssets } = useMyAssetsQuery(account ? account.address : '');
  const { refetch: refetchMyCollections } = useMyCollectionsQuery(account ? account.address : '');

  const isOwner = account && selectedAsset && selectedAsset.owner === account.address;
  // const { data: collectionsResponse } = GetCollections({
  //   id: selectedAsset?.classId,
  //   pageSize: 1,
  // });

  // useEffect(() => {
  //   const assets = assetsResponse?.assets?.assets ?? [];
  //   if (!selectedAsset && assets[0]) {
  //     actions.selectAsset(assets[0]);
  //   }

  //   return () => {
  //     //
  //   };
  // }, [assetsResponse]);

  // useEffect(() => {
  //   const collections = collectionsResponse?.collections?.collections ?? [];
  //   if (!categoryName && collections[0]) {
  //     setCategoryName(collections[0].name);
  //   }
  // }, [collectionsResponse]);
  const fetchData = async (cid = '', tid = '') => {
    if (+cid < 0 || +tid < 0) return;
    const res = await getNft(cid, tid);
    if (!res) {
      return;
    }
    const order = await getOrder(cid, tid, res.owner);
    res.order = order;
    // eslint-disable-next-line consistent-return
    return res;
  };

  const { data: detailData, isLoading: assetLoading, refetch: refetchDetail } = useQuery(
    ['QUERY_DETAIL', classId, tokenId],
    () => fetchData(classId, tokenId),
  );

  useEffect(() => {
    if (detailData) {
      actions.selectAsset(detailData);
    }

    // Clear data when page gone
    return () => {
      // actions.selectAsset(null);
    };
  }, [detailData]);

  if (!selectedAsset) {
    if (assetLoading) {
      return (
        <Box height="100vh" width="100vw">
          <Center height="100%">
            <Stack alignItems="center" spacing={6}>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
              <Text color={colors.text.gray}>{t('detail.loading-text')}</Text>
            </Stack>
          </Center>
        </Box>
      );
    }

    if (!detailData) {
      return (
        <NotFound
          title={t('not-found.asset.title')}
          subtitle={t('not-found.asset.subtitle')}
          description={t('not-found.asset.description')}
        />
      );
    }

    return null;
  }

  // Events
  const handlePurchaseClose = () => {
    setPurchaseOpen(false);
  };

  const handleCancelOrder = () => {
    setCancelLoading(true);
    const delParams = {
      address: account.address,
      ownerAddress: selectedAsset.owner,
      classId,
      tokenId,
      cb: {
        success: () => {
          toast({
            title: 'success',
            status: 'success',
            position: 'top',
            duration: 3000,
            description: t('detail.cancel.success'),
          });
          refetchDetail();
          refetchMyAssets();
          refetchMyCollections();
          getBalance(account.address);
          setCancelLoading(false);
        },
        error: (error: string) => {
          toast({
            title: 'success',
            status: 'error',
            position: 'top',
            duration: 3000,
            description: error,
          });
          setCancelLoading(false);
        },
      },
    };
    deleteOrder(delParams);
  };

  const handlePurchaseConfirm = (setLoading: any) => {
    setLoading(true);
    const price = selectedAsset.order.price.split(' ');
    const purchaseParams = {
      address: account.address,
      ownerAddress: selectedAsset.owner,
      classId,
      tokenId,
      price: price[0],
      cb: {
        success: () => {
          toast({
            title: 'success',
            status: 'success',
            position: 'top',
            duration: 3000,
            description: t('detail.purchase.success'),
          });
          refetchDetail();
          refetchMyAssets();
          refetchMyCollections();
          getBalance(account.address);
          setLoading(false);
          setPurchaseOpen(false);
        },
        error: (error: string) => {
          toast({
            title: 'success',
            status: 'error',
            position: 'top',
            duration: 3000,
            description: error,
          });
          setLoading(false);
        },
      },
    };
    takeOrder(purchaseParams);
  };

  const handleSettingClose = () => {
    setSettingOpen(false);
  };

  const handleSettingConfirm = (success: boolean) => {
    // refetch data
    if (success) {
      refetchDetail();
      refetchMyAssets();
      refetchMyCollections();
      getBalance(account.address);
    }
  };

  const handlePurchase = () => {
    const callbackUrl = location.pathname;
    if (login) {
      setPurchaseOpen(true);
    } else {
      redirectConnect(callbackUrl, history);
    }
  };
  let price = '';
  if (selectedAsset.order) {
    // price =
    //   typeof selectedAsset.order.price === 'number'
    //     ? toFixedDecimals(selectedAsset.order.price, 8)
    //     : selectedAsset.order.price

    const { value, unit } = parseMoneyText(selectedAsset.order.price);
    price = value.toFixed(2) + unit;
  }

  return (
    <Box marginTop="77px" width="100%">
      <Helmet title={t('title.detail', { name: selectedAsset.name })} />
      {selectedAsset.order && isOwner && (
        <Alert
          order={selectedAsset.order}
          categories={categories}
          // onDestroy={handleDestroy}
          onSetting={() => setSettingOpen(true)}
        />
      )}

      <DetailContainer
        left={
          <>
            {selectedAsset.metadata && selectedAsset.metadata.url && (
              <ImageCard
                src={`${PINATA_SERVER}${selectedAsset.metadata.url}` ?? 'image placeholder'}
              />
            )}
            {selectedAsset.metadata && (
              <IntroCard
                description={selectedAsset.metadata.description ?? t('detail.no-description')}
              />
            )}
            <MetaCard metadata={selectedAsset.metadata ?? {}} />
            {selectedAsset.class && selectedAsset.class.metadata && (
              <ClassInfo about={selectedAsset.class ?? t('detail.no-about')} />
            )}
          </>
        }
        right={
          <>
            <PurchaseCard
              category={categoryName}
              name={selectedAsset.metadata.name}
              price={price}
              onPurchase={() => handlePurchase()}
              order={selectedAsset.order}
              asset={selectedAsset}
              onSetting={() => setSettingOpen(true)}
              onCancel={handleCancelOrder}
              cancelLoading={cancelLoading}
              isOwner={account && selectedAsset.owner === account.address}
            />
            {/* <IntroCard description={selectedAsset.description ?? t('detail.no-description')} /> */}
            {/* <MetaCard metadata={selectedAsset.metadata ?? t('detail.no-metadata')} />
            <ClassInfo about={selectedAsset.class ?? t('detail.no-about')} /> */}
            <PriceHistoryCard />
            <HistoryEventCard />
          </>
        }
      />

      <PurchaseModal
        item={selectedAsset}
        count={1}
        category={categoryName}
        open={purchaseOpen}
        onClose={handlePurchaseClose}
        onConfirm={handlePurchaseConfirm}
      />

      <SalesSettingModal
        open={settingOpen}
        onClose={handleSettingClose}
        onAfterConfirm={handleSettingConfirm}
        categories={categories}
        classId={classId}
        tokenId={tokenId}
      />
    </Box>
  );
};

export default Detail;
