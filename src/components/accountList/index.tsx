import React, { useState, useEffect } from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Box, Text, Divider } from '@chakra-ui/react';
import iconSelect from '../../assets/icon_select.png';
import colors from '../../themes/colors';

import { getBalance } from '../../api/polka';
import Balance, { BalanceType, renderBalanceText } from '../balance';

interface AccountProps {
  account: InjectedAccountWithMeta;
  handleClick: (index: number) => Promise<void>;
  index: number;
  length: number;
  balanceArr: BalanceType[] | undefined;
}

const Account = ({ account, handleClick, index, length, balanceArr }: AccountProps) => {
  const { address, meta } = account;
  const { name } = meta;
  const balance = balanceArr && balanceArr[index];

  return (
    <>
      <Box
        key={address}
        height="80px"
        padding="20px"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => handleClick(index)}
        cursor="pointer"
      >
        <Box display="inline-block">
          <Text fontWeight="medium">{name}</Text>
          <Text color={colors.text.gray}>{address}</Text>
        </Box>
        {balance && <Box display="inline-block">{renderBalanceText(balance?.free)}</Box>}
        <Box display="inline-block" as="img" src={iconSelect} w="32px" h="32px" />
      </Box>
      {index !== length - 1 && <Divider></Divider>}
    </>
  );
};

interface AccountListProps {
  list: InjectedAccountWithMeta[];
  handleClick: (index: number) => Promise<void>;
}

const AccountList = ({ list, handleClick }: AccountListProps) => {
  const [balanceArr, setBalanceArr] = useState<BalanceType[]>();

  useEffect(() => {
    const resArr: BalanceType[] = [];
    const fetchBalances = async () => {
      await Promise.all(
        list.map(async (account) => {
          const res = await getBalance(account.address);
          resArr.push(res.toHuman());
        }),
      );
      setBalanceArr(resArr);
    };
    fetchBalances();
  }, [list]);

  return list.map((account, index) => (
    <Account
      key={index}
      account={account}
      handleClick={handleClick}
      balanceArr={balanceArr}
      index={index}
      length={list.length}
    />
  ));
};

export default AccountList;
