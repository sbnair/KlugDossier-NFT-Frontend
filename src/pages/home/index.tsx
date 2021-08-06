import React, { useEffect, useState } from 'react';
import { groupBy } from 'ramda';
import { Container, Button, Center, Stack, StackDivider } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { globalStore } from 'rekv';
import store, { actions } from '../../stores/assets';
import CommLayout from '../../layouts/common';
import TypeFilter from './TypeFilter';
import Works from './Works';
import { Order, Work } from '../../types';
import {
  createClass,
  getClassById,
  mintNft,
  getCategories,
  getAllNfts,
  getAllOrders,
  createOrder,
  takeOrder,
  updateOrderPrice,
  deleteOrder,
  queryClassByAddress,
  queryNftByAddress,
} from '../../api/polka';
import { useAssetsQuery } from '../../api/query';

type ListMap = Record<string, Work[]>;

const STATUS_MAP: Record<number, string> = {
  1: 'listing',
  2: 'new',
  // 3: 'recent',
};

const groupByStatus = groupBy<Work>(({ status }) => STATUS_MAP[status]);
// const groupByStatus = (orders, assets) => {
//   const listMap = new Map();

// }

const Page = () => {
  const { data: assetsData, isLoading, error, refetch } = useAssetsQuery();
  // FIXME: Add type instead of any

  const { t } = useTranslation();

  const { filteredAssets } = store.useState('assets', 'filteredAssets');
  const { account } = globalStore.useState('account');

  const [workListMap, setWorkListMap] = useState<ListMap>(groupByStatus(filteredAssets));
  // TODO: sticky animation
  const [stickyFilter] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);

  // Update filters when mount
  useEffect(() => {
    refetch();
    actions.setFilters({ categoryId: -1, collectionId: -1, status: -1 });
  }, []);

  // Update assets store after query
  useEffect(() => {
    const assets = assetsData?.slice();

    actions.setAssets(assets ?? []);
    return () => {
      //
    };
  }, [assetsData]);

  // Update worklist after filteredAssets change
  useEffect(() => {
    setWorkListMap(groupByStatus(filteredAssets));
    return () => {
      // cleanup
    };
  }, [filteredAssets]);

  useEffect(() => {
    actions.filterAssets({
      categoryId: selectedCategoryId,
    });
    return () => {
      // cleanup
    };
  }, [selectedCategoryId]);

  // Update sticky header UI
  // useEffect(() => {
  //   const listenter = () => {
  //     if (window.pageYOffset > 80 && !stickyFilter) {
  //       setStickyFilter(true);
  //       return;
  //     }

  //     setStickyFilter(false);
  //   };

  //   window.addEventListener('scroll', listenter);
  //   return () => {
  //     window.removeEventListener('scroll', listenter);
  //   };
  // }, []);

  // Events
  const handleFilter = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  // Component
  const errorBox = (
    <Container height={300}>
      <Center flexDirection="column" height="100%">
        <Stack>
          Error on fetching data
          <StackDivider />
          <Button variant="primary" onClick={() => refetch()}>
            {t('network.retry')}
          </Button>
        </Stack>
        {/* <Text color={colors.text.gray}>{error?.message}</Text> */}
      </Center>
    </Container>
  );

  return (
    <CommLayout title="title.home">
      <TypeFilter onFilter={handleFilter} sticky={stickyFilter} />
      {error ? errorBox : <Works loading={isLoading} data={workListMap} />}
    </CommLayout>
  );
};

export default Page;
