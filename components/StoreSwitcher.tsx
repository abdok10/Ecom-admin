"use client";

import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import { useState } from "react";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@lib/utils";
import { useStoreModal } from "@hooks/use-store-modal";
import { Popover, PopoverTrigger } from "@components/ui/popover";
import { Button } from "@components/ui/button";
import { PopoverContent } from "@radix-ui/react-popover";
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  stores: Store[];
}

const StoreSwitcher: React.FC<StoreSwitcherProps> = ({
  className,
  stores = [],
}) => {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedStores = stores.map((store) => ({
    label: store.name,
    value: store.id,
  }));

  const activeStore = formattedStores.find(
    (store) => store.value === params.storeId
  );

  const [open, setOpen] = useState(false);

  const onStoreSelect = (store: { label: string; value: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-[200px] justify-between", className)}
          onClick={() => setOpen(!open)}
        >
          <StoreIcon className="mr-2 size-4" />
          {activeStore?.label}
          <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedStores.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 size-4" />
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto size-4",
                      activeStore?.value === store.value ? "" : "hidden"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          <CommandSeparator />

          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
                className="text-sm"
              >
                <PlusCircle className="mr-2 size-5" />
                Create store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
