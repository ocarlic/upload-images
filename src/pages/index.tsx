import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const fetchingData = () => api.get('/api/images');

  const getNextParams = pages => {
    const { data } = pages;
    const pageParam = data.after
      ? (data.pageParam = data.after)
      : (data.pageParam = null);

    return pageParam;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchingData, {
    getNextPageParam: pages => getNextParams(pages),
  });

  const formattedData = useMemo(() => {
    const flatDataArray = data?.pages
      .map(page => {
        return page.data.data.map(image => {
          return {
            title: image.title,
            description: image.description,
            url: image.url,
            id: image.id,
            ts: image.ts,
          };
        });
      })
      .flat();
    return flatDataArray;
  }, [data]);

  return (
    <>
      {isLoading ? <Loading /> : isError && <Error />}

      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            colorScheme="orange"
          >
            {isFetchingNextPage
              ? 'Carregando...'
              : hasNextPage && 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
