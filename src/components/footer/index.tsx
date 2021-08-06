import React from 'react';
import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import GithubLogo from '../../assets/footer_icon_github.png';
import GithubLogoHover from '../../assets/footer_icon_github_s.png';
import TwitterLogo from '../../assets/footer_icon_twitter.png';
import TwitterLogoHover from '../../assets/footer_icon_twitter_s.png';
import TelegramLogo from '../../assets/footer_icon_telegram.png';
import TelegramLogoHover from '../../assets/footer_icon_telegram_s.png';
import MediumLogo from '../../assets/footer_icon_medium.png';
import MediumLogoHover from '../../assets/footer_icon_medium_s.png';

const ICONS = [
  { icon: GithubLogo, hover: GithubLogoHover },
  { icon: TwitterLogo, hover: TwitterLogoHover },
  { icon: TelegramLogo, hover: TelegramLogoHover },
  { icon: MediumLogo, hover: MediumLogoHover },
];
const links = [
  'https://github.com/NFTT-studio',
  'https://twitter.com/NFTmartio',
  'https://t.me/NFTmart',
  'https://nftmart-io.medium.com/',
];

const ICON_LIST = ICONS.map((title, index) => ({
  src: ICONS[index].icon,
  hoverSrc: ICONS[index].hover,
  id: index,
  link: links[index],
}));

export default function Footer(props: BoxProps) {
  const { t } = useTranslation('common');

  const iconList = ICON_LIST;

  return (
    <Box
      as="footer"
      flex={1}
      display="flex"
      justifyContent="center"
      height="auto"
      backgroundColor="#373F60"
      border="1px solid #979797"
      className="page-footer"
    >
      <Flex
        display="flex"
        paddingX={6}
        justifyContent="space-around"
        flexWrap="wrap"
        paddingBottom={5}
      >
        <Box maxW="80%" minW="40%" mt="60px" mr="20px">
          <Text lineHeight="20px" fontWeight="500" fontSize="14px" color="#61688A" mb="10px">
            {t('footer.aboutus.title', { defaultValue: 'About Us' })}
          </Text>
          <Text lineHeight="30px" color="#C7CCE6" fontSize="14px">
            {t('footer.aboutus.intro', {
              defaultValue:
                'NFTMart, dedicated to an instant and inclusive coverage of everything happening in the crypto/blockchain world, delivers right trade information with professional insights and state-of-art accuracy to an international readership. ',
            })}
          </Text>
        </Box>
        <Box mt="60px" maxW="50%" minW="20%">
          <Box lineHeight="20px" color="#61688a" fontWeight="500" fontSize="14px" mb="20px">
            {t('footer.follow', { defaultValue: 'Follow Us' })}
          </Box>
          <Box mb="20px" display="flex" ml={4}>
            {iconList.map(({ id, src, hoverSrc, link }) => (
              <Box
                ml={id !== 0 ? '30px' : 0}
                role="group"
                key={src}
                onClick={() => window.open(link, '_blank')}
              >
                <Box
                  as="img"
                  alt=""
                  src={src}
                  width="32px"
                  cursor="pointer"
                  _groupHover={{ display: 'none' }}
                />
                <Box
                  as="img"
                  alt=""
                  display="none"
                  src={hoverSrc}
                  width="32px"
                  cursor="pointer"
                  _groupHover={{ display: 'block' }}
                />
              </Box>
            ))}
          </Box>
          <Box lineHeight="20px" color="#61688a" fontSize="12px">
            {t('copyright', { defaultValue: '© 2021 GUAP Limited' })}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
