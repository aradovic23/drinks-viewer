import Image from "next/image";
import type { FC } from "react";
import { useState } from "react";
import classnames from "classnames";
import Link from "next/link";
import { api } from "../utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { useGetCategory } from "../hooks/useGetCategory";
import { InfoIcon } from "./InfoIcon";
import { Modal } from "./Modal";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";

export type Drink = {
  title: string;
  id: string;
  price: string;
  volume?: string | null;
  tag?: string | null;
  type?: string | null;
  description?: string | null;
  categoryId?: number | null;
};

const typeBadgeBackgroundColor: { [index: string]: string } = {
  none: "badge badge-error ",
  Green: "bg-green-400",
  Black: "bg-slate-400",
  Fruit: "bg-red-400",
  Herb: "bg-yellow-400",
};

const typeBadgeStyle =
  "rounded-md px-1 py-0.5 text-xs text-black uppercase font-medium";

export const DrinkList: FC<Drink> = ({
  title,
  price,
  id,
  volume,
  type,
  categoryId,
  tag,
  description,
}) => {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const drinks = api.drinks.getDrinks.useQuery();

  const { mutate: deleteDrink } = api.drinks.deleteDrink.useMutation({
    async onSuccess() {
      void queryClient.invalidateQueries({ queryKey: ["drink"] });
      await drinks.refetch();
    },
    onError(error) {
      console.log(error);
    },
  });

  const onDeleteHandler = (id: string) => {
    if (window.confirm("Are you sure")) {
      deleteDrink({ id });
    }
  };

  const handleShowModal = (state: boolean) => {
    setShowModal(state);
  };

  const { category, isError } = useGetCategory(categoryId ?? 1) ?? "";
  const { data: sessionData } = useSession();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1, y: [0, 7, 0] }}
      transition={{ ease: "easeOut", duration: 0.5 }}
      exit={{ opacity: 0, scale: 0 }}
      className="flex max-h-52 flex-col gap-2 overflow-hidden rounded-lg bg-base-300"
    >
      <figure className="relative h-24 rounded-t-lg">
        {isError ? (
          <p>Error loading the image...</p>
        ) : (
          <Image
            src={category?.url ?? ""}
            alt="image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
            priority
            placeholder="empty"
          />
        )}

        {tag && (
          <div className="absolute top-2 right-2 z-30 rounded-md bg-yellow-500 px-1 py-0.5 text-xs font-medium uppercase text-black">
            {tag}
          </div>
        )}
        <div className="absolute h-full w-full bg-gradient-to-t from-base-300"></div>
        <div className="absolute top-10 left-5 flex h-full w-full items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="card-title truncate text-white">{title}</h2>
              {type && type != "none" && (
                <div
                  className={classnames(
                    typeBadgeBackgroundColor[type],
                    typeBadgeStyle
                  )}
                >
                  {type}
                </div>
              )}
            </div>
            <div className="text-sm font-bold">{price} RSD</div>
          </div>
        </div>
      </figure>

      <div className="flex flex-col gap-4 divide-y divide-solid divide-slate-400/10 rounded-lg p-5">
        <div className="card-actions flex justify-between pt-2">
          <div className="flex gap-2">
            {category && (
              <div className="text-sm uppercase">{category.categoryName}</div>
            )}
            {volume && volume != "none" && (
              <div className="text-sm font-bold">{volume}</div>
            )}
          </div>
          <div className="flex gap-2">
            {sessionData?.user?.role === "admin" && (
              <>
                <Link href={`/drink/${id}`}>
                  <EditIcon />
                </Link>
                <DeleteIcon
                  onClick={() => {
                    onDeleteHandler(id);
                  }}
                />
              </>
            )}
            {category?.categoryName.toLowerCase() === "cocktails" && (
              <InfoIcon onClick={() => setShowModal(!showModal)} />
            )}
            <AnimatePresence>
              {showModal && (
                <Modal
                  description={description ?? ""}
                  title={title}
                  handleShowModal={handleShowModal}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
