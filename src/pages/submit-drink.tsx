import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/router";
import { TextInput } from "../components/TextInput";
import { SelectInput } from "../components/SelectInput";

export const volumeOptions: string[] = [
  "none",
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

const typeOptions: string[] = ["none", "Green", "Black", "Fruit", "Herb"];

export const categoryOptions: string[] = [
  "coffee",
  "alchoholic",
  "non-alcoholic",
  "beer",
  "wine",
  "tea",
  "juices",
  "brandy",
  "shakes",
];

const SubmitDrink: NextPage = () => {
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productVolume, setProductVolume] = useState(volumeOptions[0]);
  const [productType, setProductType] = useState(typeOptions[0]);
  const [productTag, setProductTag] = useState("");
  const [productCategory, setProductCategory] = useState(categoryOptions[0]);
  const createDrinkMutation = api.drinks.createDrink.useMutation();
  const router = useRouter();

  const handleSubmitDrink = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDrinkMutation.mutateAsync({
      title: productTitle,
      price: productPrice,
      tag: productTag,
      volume: productVolume,
      category: productCategory,
      type: productType,
    });
    void router.push("/drinks");
  };

  return (
    <>
      <Head>
        <title>Create a drink</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex h-screen flex-col items-center py-10">
        <form className="flex w-96 flex-col gap-5" onSubmit={handleSubmitDrink}>
          <h1 className="text-center text-2xl uppercase">Upload a drink</h1>
          <div className="">
            <SelectInput
              disabled={false}
              label="Category"
              onChange={(e) => setProductCategory(e.target.value)}
            >
              {categoryOptions.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </SelectInput>
            <TextInput
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              label="Product Name"
              required={true}
            />
            <TextInput
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              label="Price"
              required={true}
            />
          </div>
          <div className="max-w-sm md:max-w-md">
            <SelectInput
              disabled={false}
              label="Volume"
              onChange={(e) => setProductVolume(e.target.value)}
            >
              {volumeOptions.map((volume) => (
                <option value={volume} key={volume}>
                  {volume}
                </option>
              ))}
            </SelectInput>
            <SelectInput
              disabled={productCategory != "tea"}
              label="Type"
              onChange={(e) => setProductType(e.target.value)}
            >
              {typeOptions.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </SelectInput>
            <TextInput
              value={productTag}
              onChange={(e) => setProductTag(e.target.value)}
              label="Tag"
              required={false}
            />
          </div>

          <button className="btn-primary btn ">Submit</button>
        </form>
      </main>
    </>
  );
};

export default SubmitDrink;
