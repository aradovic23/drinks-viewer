import { Button, Center, Heading, Text, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';

const AccessDenied = () => {
  return (
    <>
      <Head>
        <title>Access Denied</title>
      </Head>
      <Center h="calc(100vh)">
        <VStack spacing="3">
          <Heading>Access denied</Heading>
          <Text>You are not signed in or you don&apos;t have admin permissions</Text>
        </VStack>
      </Center>
    </>
  );
};

export default AccessDenied;
