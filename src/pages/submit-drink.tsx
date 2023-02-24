import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "../utils/api";
import { useGetCategory } from "../hooks/useGetCategory";
import { Form } from "../components/Form";
import { useSession } from "next-auth/react";
import AccessDenied from "../components/AccessDenied";
import Spinner from "../components/Spinner";
import CreateNewCategory from "../components/CreateNewCategory";
import { useRouter } from "next/router";
import {
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import type { Drink } from "@prisma/client";

export const volumeOptions: string[] = [
  "0.03",
  "0.05",
  "0.1",
  "0.187",
  "0.2",
  "0.25",
  "0.3",
  "0.33",
  "0.35",
  "0.4",
  "0.5",
];

const typeOptions: string[] = ["Green", "Black", "Fruit", "Herb"];
const SubmitDrink: NextPage = () => {
  const createDrinkMutation = api.drinks.createDrink.useMutation();
  const categories = api.categories.getCategories.useQuery();

  const [isTagChecked, setIsTagChecked] = useState(false);
  const [isCreateNewCategoryChecked, setIsCreateNewCategoryChecked] =
    useState(false);
  const { data: sessionData, status } = useSession();

  const { register, handleSubmit, formState: errors } = useForm<Drink>();

  const mockSubmit = (data: Drink) => {
    console.log(data);
  };

  const router = useRouter();

  if (status === "loading") {
    return <Spinner />;
  }

  if (sessionData?.user?.role != "admin") {
    return <AccessDenied />;
  }

  const handleSubmitDrink = async (data: Drink) => {
    try {
      await createDrinkMutation.mutateAsync({
        title: data.title ?? "",
        price: data.price ?? "",
        tag: data.tag,
        volume: data.volume,
        type: data.type,
        description: data.description,
        categoryId: Number(data.categoryId),
      }),
        void router.push("/drinks");
    } catch (error) {
      if (typeof error === "string") {
        console.log(error);
      } else {
        console.log((error as Error).message);
      }
    }
  };

  const handleIsActive = (state: boolean) => {
    setIsCreateNewCategoryChecked(state);
  };

  return (
    <>
      <Head>
        <title>Create a drink</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container as="main">
        <Heading my="5" textAlign="center">
          Create a drink
        </Heading>

        <Form onSubmit={handleSubmit(mockSubmit)}>
          <Flex gap="2">
            <Select
              {...register("categoryId", {
                required: true,
                validate: {
                  notZero: (v) => Number(v) > 0,
                },
              })}
            >
              <option value={0}>Select a category</option>
              {(categories.data || []).map((category) => (
                <option value={category.id} key={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </Select>
            <Button
              onClick={() =>
                setIsCreateNewCategoryChecked(!isCreateNewCategoryChecked)
              }
            >
              Create New
            </Button>
          </Flex>

          {isCreateNewCategoryChecked && (
            <CreateNewCategory handleIsActive={handleIsActive} />
          )}
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              placeholder="Enter product title"
              {...register("title", {
                required: true,
                minLength: {
                  value: 3,
                  message: "Product should have minimum 3 letters",
                },
              })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Price</FormLabel>
            <Input
              placeholder="Enter price"
              inputMode="numeric"
              {...register("price", {
                required: true,
                minLength: 2,
              })}
            />
          </FormControl>

          <Select
            {...register("volume", {
              validate: {
                notZero: (v) => Number(v) > 0,
              },
            })}
          >
            <option value={0}>Select a volume</option>
            {volumeOptions.map((volume) => (
              <option value={volume} key={volume}>
                {volume}
              </option>
            ))}
          </Select>

          <Select
            {...register("type", {
              validate: {
                notZero: (v) => Number(v) !== 0,
              },
            })}
          >
            <option value={0}>Select a type</option>
            {typeOptions.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </Select>

          <FormControl>
            <FormLabel>Add tag?</FormLabel>
            <Switch onChange={() => setIsTagChecked(!isTagChecked)} mb="5" />
            {isTagChecked && (
              <Input placeholder="Enter tag" {...register("tag")} />
            )}
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea placeholder="Description" {...register("description")} />
          </FormControl>

          <Button type="submit">Create product</Button>
        </Form>
      </Container>
    </>
  );
};

export default SubmitDrink;
