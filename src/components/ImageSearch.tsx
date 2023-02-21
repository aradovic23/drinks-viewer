import { useState } from "react";
import { env } from "../env/client.mjs";
import Image from "next/image";
import type { Result, UnsplashImage } from "../../typings";
import { useQuery } from "@tanstack/react-query";
import Spinner from "./Spinner";
import { Button, HStack, IconButton, Input } from "@chakra-ui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface Props {
  handleSelectedImage: (image: string) => void;
}

const ImageSearch = ({ handleSelectedImage }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const ACCESS_KEY = env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  const BASE_URL = "https://api.unsplash.com";
  const [selectedImage, setSelectedImage] = useState({ url: "", id: "" });
  const [isImageSelected, setIsImageSelected] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery<Result[], Error>(
    ["images"],
    async () => {
      const response = await fetch(
        `${BASE_URL}/search/photos?page=1&query=${searchTerm}&per_page=20&client_id=${ACCESS_KEY}`
      );
      const data = (await response.json()) as UnsplashImage;
      return data.results;
    }
  );

  const fetchRequest = async (): Promise<void> => {
    await refetch();
  };

  const onSubmitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await fetchRequest();
    setSearchTerm("");
  };

  const handleSetSelectedImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSelectedImage(selectedImage.url);
    setIsImageSelected(true);
  };

  return (
    <div>
      <HStack>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          inputMode="search"
          placeholder="Search for a image"
        />
        <IconButton
          aria-label="search"
          icon={<MagnifyingGlassIcon className="h-6 w-6" />}
          colorScheme="primary"
          onClick={onSubmitHandler}
          variant="outline"
        />
      </HStack>
      {isLoading && <Spinner />}
      {isError && <div>Error fetching data</div>}
      {!isImageSelected && (
        <div className="grid max-h-[500px] grid-cols-2 gap-3 overflow-y-auto ">
          {data?.map((image) => (
            <div key={image.id} className="relative">
              {selectedImage && (
                <Button color="primary" onClick={handleSetSelectedImage}>
                  Set
                </Button>
              )}
              <div className="relative h-52 w-full transition">
                <Image
                  onClick={() =>
                    setSelectedImage({ url: image.urls.regular, id: image.id })
                  }
                  src={image.urls.small}
                  fill
                  alt="no img"
                  className={`rounded object-cover	 ${
                    selectedImage.id === image.id
                      ? "opacity-20 hover:opacity-20"
                      : "opacity-100 hover:opacity-70"
                  }`}
                  sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                  priority
                  placeholder="empty"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSearch;
