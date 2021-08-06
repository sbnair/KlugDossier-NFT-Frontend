import { useQuery } from 'react-query';
import { globalStore } from 'rekv';
import { Order, Work, Collection } from '../../types';
import {
  getAllNfts,
  getAllOrders,
  getClasses,
  queryClassByAddress,
  queryNftByAddress,
} from '../polka';
import { parseMoneyText } from '../../utils/fomart';

export * from './queryClient';

const ASSETS_QUERY = 'getAssets';
const COLLECTIONS_QUERY = 'getCollections';
const MY_COLLECTIONS_QUERY = 'getMyCollections';
const MY_ASSETS_QUERY = 'getMyAssets';

export const useAssetsQuery = () => {
  const { api } = globalStore.useState('api');

  // ----- helpers
  const updateAssetByOrder = (asset: Work, orders: Order[], blockNumber: number) => {
    const givenOrder = orders.find(
      (order) => order.classId === asset.classId && order.tokenId === asset.tokenId,
    );

    if (givenOrder) {
      const deadline = +givenOrder.deadline.replace(/,/g, '');
      if (blockNumber < deadline) {
        const categoryId = givenOrder.categoryId ? Number(givenOrder.categoryId) : -1;
        return {
          ...asset,
          status: 1,
          price: givenOrder.price,
          pledge: givenOrder.deposit,
          categoryId,
        };
      }
    }
    return { ...asset, status: 2, price: undefined, categoryId: -1, pledge: undefined };
  };

  const queryAssetsAndMap = async () => {
    let assets = await getAllNfts();
    const orders = (await getAllOrders()) as Order[];
    const blockNumber = Number(await api.query.system.number());

    if (Array.isArray(orders) && Array.isArray(assets)) {
      assets = assets.map((asset) => updateAssetByOrder(asset, orders, blockNumber));
    }

    const sortedAssets = assets.sort((a, b) => {
      // b up first if a is not listing
      if (a.status !== 1) return 1;
      // vice versa
      if (b.status !== 1) return -1;

      const { value: aPrice } = parseMoneyText(a.price!);
      const { value: bPrice } = parseMoneyText(b.price!);
      const aDps = parseFloat(aPrice.toString());
      const bDps = parseFloat(bPrice.toString());

      return aDps - bDps;
    });

    return sortedAssets;
  };

  // use query
  const { data: assetsData, isLoading, error, refetch } = useQuery<Work[]>(
    ASSETS_QUERY,
    queryAssetsAndMap,
    {
      staleTime: Infinity,
    },
  );

  return { data: assetsData, isLoading, error, refetch };
};

export const useCollectionsQuery = () => {
  const { data, isLoading, error } = useQuery<Collection[]>(COLLECTIONS_QUERY, getClasses, {
    staleTime: Infinity,
  });

  return { data, isLoading, error };
};

export const useMyCollectionsQuery = (address: string) => {
  const queryClassesAndMap = async () => {
    const classes = await queryClassByAddress({ address });
    return classes;
  };

  const { data, isLoading, error, refetch } = useQuery<Collection[]>(
    MY_COLLECTIONS_QUERY,
    queryClassesAndMap as any,
    {
      staleTime: Infinity,
    },
  );

  return { data, isLoading, error, refetch };
};

export const useMyAssetsQuery = (address: string) => {
  // helpers
  const updateAssetByOrder = (asset: Work, orders: Order[]) => {
    const givenOrder = orders.find(
      (order) => order.classId === asset.classId && order.tokenId === asset.tokenId,
    );

    if (givenOrder) {
      const categoryId = givenOrder.categoryId ? Number(givenOrder.categoryId) : 3;
      return {
        ...asset,
        status: 1,
        price: givenOrder.price,
        pledge: givenOrder.deposit,
        categoryId,
      };
    }
    return { ...asset, status: 2, price: undefined, categoryId: -1 };
  };

  const queryAssetsAndMap = async () => {
    if (!address) return [];
    let assets = (await queryNftByAddress({ address })) as Work[];
    const orders = (await getAllOrders()) as Order[];

    if (Array.isArray(orders) && Array.isArray(assets)) {
      assets = assets.map((asset) => updateAssetByOrder(asset, orders));
    }

    const sortedAssets = assets.sort((a, b) => {
      // b up first if a is not listing
      if (a.status !== 1) return 1;
      // vice versa
      if (b.status !== 1) return -1;

      const aDps = parseFloat(a.pledge!);
      const bDps = parseFloat(b.pledge!);
      return bDps - aDps;
    });

    return sortedAssets;
  };

  const { data, isLoading, error, refetch } = useQuery<Work[]>(
    [MY_ASSETS_QUERY, address],
    queryAssetsAndMap as any,
    {
      staleTime: Infinity,
    },
  );

  return { data, isLoading, error, refetch };
};
