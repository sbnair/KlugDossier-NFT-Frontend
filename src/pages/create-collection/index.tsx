import React, { FC, useCallback, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Container,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  Center,
  Flex,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from 'yup';
import { globalStore } from 'rekv';
import LoginDetector from '../../components/loginDetector';
import CheckWhiteList from '../../components/checkWhiteList';

import Upload from '../../components/upload';

import Layout from '../../layouts/common';
import colors from '../../themes/colors';

import { createClass, getBalance } from '../../api/polka';
import { useMyAssetsQuery, useMyCollectionsQuery } from '../../api/query';

const formLabelLayout = {
  flex: '0 0 240px',
  height: '48px',
  htmlFor: 'name',
  fontSize: '14px',
  color: colors.text.gray,
  borderBottom: '1px solid #F3F4F8',
  mb: '0',
  mr: '0',
  lineHeight: '47px',
};
const formInputLayout = {
  variant: 'flushed',
  size: 'lg',
  fontSize: '14px',
  borderBottomColor: '#F3F4F8',
};

const CreateCollection: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const { account } = globalStore.useState('account');
  const { refetch: refetchAssets } = useMyAssetsQuery(account ? account.address : '');
  const { refetch: refetchMyCollections } = useMyCollectionsQuery(account ? account.address : '');

  const create = useCallback((formValue, cb) => {
    createClass({ address: account.address, metadata: formValue, cb });
  }, []);

  const schema = Yup.object().shape({
    name: Yup.string()
      .max(20, t('create.verification.collectionName'))
      .required(t('create.verification.Required')),
    url: Yup.string().max(200).required(t('create.verification.Required')),
    externalUrl: Yup.string().matches(
      /(http|https):\/\/([\w.]+\/?)\S*/,
      t('create.verification.externalUrl'),
    ),
    description: Yup.string()
      .max(200, t('create.verification.description'))
      .required(t('create.verification.Required')),
  });

  const history = useHistory();
  const cancelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  const brr = JSON.parse(localStorage.getItem('collection'));
  const crr = brr;

  return (
    <>
      <Layout title="title.create-collection">
        <Box padding={2}>
          <Container
            width="880px"
            minHeight="100vh"
            backgroundColor="#fff"
            mt="20px"
            mb="148px"
            borderRadius="4px"
          >
            <Box
              height="48px"
              borderBottom="1px solid #E9E9F0"
              pl="20px"
              fontWeight="600"
              fontSize="16px"
              lineHeight="47px"
              color={colors.text.black}
            >
              {t('create.collection.title')}
            </Box>
            <Container p="0 20px">
              <Formik
                initialValues={{
                  name: crr ? crr.name : '',
                  // bannerUrl: '',
                  description: crr ? crr.description : '',
                  url: crr ? crr.url : '',
                  externalUrl: crr ? crr.externalUrl : '',
                }}
                onSubmit={(values, formActions) => {
                  const arr = values;
                  localStorage.setItem('collection', JSON.stringify(arr));
                  create(values, {
                    success: (err: any) => {
                      if (err.dispatchError) {
                        toast({
                          title: 'error',
                          status: 'error',
                          position: 'top',
                          duration: 3000,
                          description: t('create.create.error'),
                        });
                      } else {
                        toast({
                          title: 'success',
                          status: 'success',
                          position: 'top',
                          duration: 3000,
                        });
                        localStorage.removeItem('collection');
                        setTimeout(() => {
                          setIsOpen(true);
                          // history.push('/create');
                        }, 2000);
                      }
                      formActions.setSubmitting(false);
                      formActions.resetForm();
                      refetchAssets();
                      refetchMyCollections();
                      getBalance(account.address);
                    },
                    error: (err: any) => {
                      toast({
                        title: 'error',
                        status: 'error',
                        position: 'top',
                        duration: 3000,
                        description: err,
                      });
                      formActions.setSubmitting(false);
                      refetchAssets();
                      refetchMyCollections();
                      getBalance(account.address);
                    },
                  });
                }}
                validationSchema={schema}
              >
                {(props: FormikProps<any>) => {
                  return (
                    <Form>
                      <Field name="name">
                        {({
                          field,
                          form,
                        }: {
                          field: Record<any, unknown>;
                          form: { errors: { name: string }; touched: { name: string } };
                        }) => {
                          return (
                            <FormControl isInvalid={!!(form.errors.name && form.touched.name)}>
                              <Flex>
                                <FormLabel {...formLabelLayout} htmlFor="name">
                                  {t('create.name')}
                                </FormLabel>
                                <Input
                                  id="name"
                                  placeholder={t('create.name.collectionPlaceholder')}
                                  {...formInputLayout}
                                  {...field}
                                />
                              </Flex>
                              <FormErrorMessage pl="240px">{form.errors.name}</FormErrorMessage>
                            </FormControl>
                          );
                        }}
                      </Field>
                      <Field>
                        {({
                          field,
                          form,
                        }: {
                          field: Record<any, unknown>;
                          form: { errors: { url: string }; touched: { url: string } };
                        }) => {
                          return (
                            <FormControl isInvalid={!!(form.errors.url && form.touched.url)}>
                              <Flex>
                                <FormLabel
                                  {...formLabelLayout}
                                  p="10px 0"
                                  lineHeight="auto"
                                  height="auto"
                                >
                                  {t('create.img')}
                                </FormLabel>
                                <FormLabel
                                  mb="0"
                                  flexGrow={1}
                                  // htmlFor="url"
                                  borderBottom="1px solid #F3F4F8"
                                >
                                  <Upload
                                    id="url"
                                    mediatype="cutting"
                                    {...field}
                                    onChange={(v: any) => {
                                      props.setFieldValue('url', v);
                                    }}
                                  />
                                </FormLabel>
                              </Flex>
                              <FormErrorMessage pl="240px">{form.errors.url}</FormErrorMessage>
                            </FormControl>
                          );
                        }}
                      </Field>
                      {/* <Field name="url">
                      {({
                        field,
                        form,
                      }: {
                        field: Record<string, unknown>;
                        form: { errors: { url: string }; touched: { url: string } };
                      }) => {
                        return (
                          <FormControl isInvalid={!!(form.errors.url && form.touched.url)}>
                            <Flex>
                              <FormLabel {...formLabelLayout} htmlFor="url">
                                {t('create.url')}
                              </FormLabel>
                              <Input
                                id="url"
                                placeholder={t('create.url.placeholder')}
                                {...field}
                                {...formInputLayout}
                              />
                            </Flex>
                            <FormErrorMessage pl="240px">{form.errors.url}</FormErrorMessage>
                          </FormControl>
                        );
                      }}
                    </Field> */}
                      <Field name="externalUrl">
                        {({
                          field,
                          form,
                        }: {
                          field: Record<string, unknown>;
                          form: {
                            errors: { externalUrl: string };
                            touched: { externalUrl: string };
                          };
                        }) => {
                          return (
                            <FormControl
                              isInvalid={!!(form.errors.externalUrl && form.touched.externalUrl)}
                            >
                              <Flex>
                                <FormLabel {...formLabelLayout} htmlFor="externalUrl">
                                  {t('create.link')}
                                </FormLabel>
                                <Input
                                  id="externalUrl"
                                  placeholder={t('create.link.placeholder')}
                                  {...formInputLayout}
                                  {...field}
                                />
                              </Flex>
                              <FormErrorMessage pl="240px">
                                {form.errors.externalUrl}
                              </FormErrorMessage>
                            </FormControl>
                          );
                        }}
                      </Field>
                      <Field name="description">
                        {({
                          field,
                          form,
                        }: {
                          field: Record<string, unknown>;
                          form: {
                            errors: { description: string };
                            touched: { description: string };
                          };
                        }) => (
                          <FormControl
                            isInvalid={!!(form.errors.description && form.touched.description)}
                          >
                            <Flex>
                              <FormLabel {...formLabelLayout} height="96px" htmlFor="description">
                                {t('create.intro')}
                              </FormLabel>
                              <Textarea
                                _placeholder={{ color: colors.text.lightGray }}
                                id="description"
                                placeholder={t('create.intro.placeholder')}
                                height="96px"
                                resize="none"
                                {...formInputLayout}
                                {...field}
                              />
                            </Flex>
                            <FormErrorMessage pl="240px">
                              {form.errors.description}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Center mt="20px">
                        <Button
                          type="submit"
                          backgroundColor={colors.primary}
                          fontSize="14px"
                          color="#fff"
                          isLoading={props.isSubmitting}
                          _hover={{ backgroundColor: colors.primary }}
                          _focus={{ backgroundColor: colors.primary }}
                        >
                          {t('create.save')}
                        </Button>
                      </Center>
                    </Form>
                  );
                }}
              </Formik>
            </Container>
          </Container>
        </Box>

        <LoginDetector />
        <CheckWhiteList />
      </Layout>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>{t('create.create.success')}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{t('create.toast.success')}</AlertDialogBody>
          <AlertDialogFooter>
            <Button bg="#495FE5" color="#FFFFFF" ml={3} onClick={() => history.push('/create')}>
              {t('create.popup.confirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateCollection;
