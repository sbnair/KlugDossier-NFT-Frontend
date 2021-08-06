import BigNumber from 'bignumber.js';
import { ReactNode } from 'react';
import { curry, apply } from 'ramda';
import { globalStore } from 'rekv';
import { createStandaloneToast } from '@chakra-ui/react';
import { t } from '../i18n';

type NumberValue = string | number;

export type toastStatus = 'success' | 'info' | 'warning' | 'error' | undefined;

export interface ToastProps {
  title?: string;
  desc: string | ReactNode;
  status?: toastStatus;
  duration?: number;
  isClosable?: boolean;
  position?: string;
}

const toastStandalone = createStandaloneToast();

export const toast = ({
  title = 'Tips',
  desc = '',
  status = 'success',
  duration = 9000,
  isClosable = true,
  position = 'bottom-right',
}: ToastProps) => {
  toastStandalone({
    position,
    title,
    description: desc,
    status,
    duration,
    isClosable,
  });
};

export const trimStr = (str: string, keep = 4) => {
  const trimed = `${str.substr(0, keep)}...${str.substr(-keep)}`;
  return trimed;
};

// Parse router query by path
export const parseQuery = (search: string) => {
  const query = search.substring(1);
  const vars = query.split('&');
  const queryMap: Record<string, string> = {};
  for (let i = 0; i < vars.length; i += 1) {
    const [key, value] = vars[i].split('=');
    queryMap[key] = value;
  }
  return queryMap;
};

// eslint-disable-next-line no-underscore-dangle
export const debounce_ = curry((immediate: boolean, fn: (...args: any[]) => any, timeMs = 1000) => {
  let timeout: NodeJS.Timeout | null;

  return (...args: any[]) => {
    const later = () => {
      timeout = null;

      if (!immediate) {
        apply(fn, args);
      }
    };

    const callNow = immediate && !timeout;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    clearTimeout(timeout!);
    timeout = setTimeout(later, timeMs);

    if (callNow) {
      apply(fn, args);
    }

    return timeout;
  };
});

export const debounceImmediate = debounce_(true);

export const debounce = debounce_(false);

// Number utils
export const toBigNumber = (n: NumberValue) => new BigNumber(String(n));

export const toFixedDecimals = (n: NumberValue, place = 8) => toBigNumber(n).toFormat(place);

export default {};
export const utf8ToHex = (s: string) => {
  const utf8encoder = new TextEncoder();
  const rb: any = utf8encoder.encode(s);
  let r = '';
  //   for (const b of rb) {
  //     r += ('0' + b.toString(16)).slice(-2);
  //   }
  rb.map((b: any) => {
    r += `0${b.toString(16).slice(-2)}`;
    return '';
  });
  return r;
};
export const hexToUtf8 = (s: string) => {
  const str = s.slice(2);
  return decodeURIComponent(
    str
      .replace(/\s+/g, '') // remove spaces
      .replace(/[0-9a-f]{2}/g, '%$&'), // add '%' before each 2 characters
  );
};

// trx log TODO add log
export const txLog = (result: any, onSuccess = (res: any) => res) => {
  console.log(`Current status is ${result.status}`);
  // toast({
  //   title: '',
  //   desc: t('trx.broadcasting'),
  //   status: 'info',
  //   duration: 8000,
  // });
  console.log(result.status, '=====');
  if (result.status.isInBlock) {
    toast({
      title: '',
      desc: t('trx.inblock'),
      status: 'info',
      duration: 8000,
    });
    console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
  } else if (result.status.isFinalized) {
    toast({
      title: '',
      desc: t('trx.finalize'),
      status: 'success',
      duration: 6000,
    });
    onSuccess(result);
    console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
  } else if (result.status.isBroadcast) {
    toast({
      title: '',
      desc: t('trx.broadcasting'),
      status: 'info',
      duration: 10000,
    });
  } else if (result.status.isInvalid) {
    toast({
      title: 'error',
      desc: t('trx.failed'),
      status: 'info',
      duration: 5000,
    });
  }
};

export const redirectConnect = (callbackUrl = '', history?: any) => {
  // toast({
  //   desc: t('account.not.detected'),
  //   status: 'waring',
  // });
  setTimeout(() => {
    history.push(`/connect?callbackUrl=${callbackUrl}`);
  }, 2000);
};
