import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { globalStore } from 'rekv';
import store from '../../stores/whiteList';
import { t } from '../../i18n';

import { toast } from '../../utils';

const CheckWhiteList = () => {
  const location = useLocation();
  const history = useHistory();
  const { account } = globalStore.useState('account');
  const { whiteList } = store.useState('whiteList');
  useEffect(() => {
    if (!account || whiteList.length === 0) {
      return;
    }
    const flag = whiteList.indexOf(account.address);
    if (flag < 0) {
      toast({
        title: '',
        desc: t('whitelist.not.tips'),
        status: 'warning',
        duration: 5000,
        position: 'top',
      });
      history.push('/');
    }
  }, [whiteList, account]);

  return <></>;
};

export default CheckWhiteList;
