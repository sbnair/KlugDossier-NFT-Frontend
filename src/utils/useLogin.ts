import { useLocation, useHistory } from 'react-router-dom';
import { globalStore } from 'rekv';

export const useLogin = () => {
  const { accounts, account, injector } = globalStore.useState('accounts', 'account', 'injector');

  const flag = !accounts || accounts.length === 0 || !account || !injector;

  if (flag) {
    return { login: false };
  }
  return { login: true };
};

export default {};
