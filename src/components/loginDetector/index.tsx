import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { globalStore } from 'rekv';

import { redirectConnect } from '../../utils';

const LoginDetector = () => {
  const location = useLocation();
  const history = useHistory();
  const { accounts, account, injector } = globalStore.useState('accounts', 'account', 'injector');

  useEffect(() => {
    const flag = !accounts || accounts.length === 0 || !account || !injector;

    if (flag) {
      redirectConnect(location.pathname, history);
    }
  }, [accounts, account, injector]);

  return <></>;
};

export default LoginDetector;
