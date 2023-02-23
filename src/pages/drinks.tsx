import { type NextPage } from "next";
import Head from "next/head";
import { api } from "../utils/api";
import { DrinkList } from "../components/DrinkList";
import { useState } from "react";
import { NoResults } from "../components/NoResults";
import {
  Container,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  ScaleFade,
  Select,
  SimpleGrid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Skeleton from "../components/Skeleton";

const Drinks: NextPage = () => {
  const drinks = api.drinks.getDrinks.useQuery();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [search, setSearch] = useState("");
  const { data, isLoading } = api.categories.getCategories.useQuery();

  const filteredDrinks = (drinks.data ?? [])
    .filter((drink) =>
      selectedCategory === 0 ? true : drink.categoryId === selectedCategory
    )
    .filter((drink) =>
      search != ""
        ? drink.title?.toLowerCase().includes(search.toLowerCase())
        : true
    );

  const totalProducts = filteredDrinks.length;

  return (
    <>
      <Head>
        <title>Drinks</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container as="section" maxW="6xl" mt="5">
        <Heading my="5" textAlign={{ base: "center", md: "left" }}>
          All drinks
        </Heading>
        <Grid templateColumns="repeat(6, 1fr)">
          <GridItem
            colSpan={{ base: 6, md: 3, lg: 2 }}
            as="aside"
            mr={{ base: "0", md: "3" }}
            mb={{ base: "3", md: "0" }}
            bg="blackAlpha.200"
            h={{ base: "10rem", md: "calc(100vh)" }}
            p={{ base: "3", md: "5" }}
            rounded="lg"
          >
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <MagnifyingGlassIcon className="h-6 w-6" color="gray.300" />
              </InputLeftElement>
              <Input
                id="search"
                placeholder="Enter drink name..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                variant="filled"
              />
            </InputGroup>

            <Stack mt="4">
              <FormLabel htmlFor="select-category">Select a category</FormLabel>
              <Select
                variant="filled"
                onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
                id="select-category"
              >
                <option value={0}>All</option>
                {(data || []).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </Select>
              <Stat>
                <StatLabel>Total products</StatLabel>
                <StatNumber>{totalProducts}</StatNumber>
              </Stat>
            </Stack>
          </GridItem>

          <GridItem colSpan={{ base: 6, md: 3, lg: 4 }} as="main">
            <SimpleGrid spacing="5" minChildWidth="20rem">
              {filteredDrinks.map((drink) => (
                <DrinkList key={drink.id} {...drink} />
              ))}
              {isLoading ? (
                <Skeleton />
              ) : (
                filteredDrinks.length === 0 && (
                  <ScaleFade initialScale={0.8} in unmountOnExit>
                    <NoResults />
                  </ScaleFade>
                )
              )}
            </SimpleGrid>
          </GridItem>
        </Grid>
      </Container>
    </>
  );
};

export default Drinks;
