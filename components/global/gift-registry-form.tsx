import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import Editor from "./editor";

const GiftRegistryForm = ({
  form,
  fields,
  append,
  remove,
}: {
  form: any;
  fields: any;
  append: any;
  remove: any;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <p>Guests can choose gifts using the registry link you provide</p>

      {fields.map((registry: any, index: number) => (
        <EachGiftRegistry
          form={form}
          key={index}
          index={index}
          remove={remove}
          registry={registry}
        />
      ))}

      <div
        className="w-full border-dashed border border-gray-300 rounded-lg py-3 text-sm flex items-center justify-center gap-2 cursor-pointer"
        onClick={() =>
          append({
            title: "",
            description: "",
            url: "",
          })
        }
      >
        <Plus className="w-4 h-4" />
        Add Another Registry
      </div>
    </div>
  );
};

export default GiftRegistryForm;

const EachGiftRegistry = ({ form, index, remove, registry }: any) => {
  return (
    <>
      <FormField
        control={form.control}
        name={`registry.${index}.title`}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2 space-y-0">
            <div className="flex items-center justify-between">
              <FormLabel className="font-bold">Title</FormLabel>
              {index > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  className=""
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
            <FormControl>
              <Input
                type="text"
                placeholder="E.g., Wedding Registry, Baby Shower  Registry"
                {...field}
              />
            </FormControl>
            <FormMessage className="mt-0" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`registry.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Description</FormLabel>
            <FormControl>
              <Editor
                value={field.value}
                onChange={(content) => field.onChange(content)}
                placeholder="Enter Description"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`registry.${index}.url`}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2 space-y-0">
            <FormLabel className="font-bold">URL</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="E.g., https://www.mystore.com/registry"
                {...field}
              />
            </FormControl>
            <FormMessage className="mt-0" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`registry.${index}.buttonText`}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2 space-y-0">
            <FormLabel className="font-bold">Button Text</FormLabel>
            <FormControl>
              <Input type="text" placeholder="E.g., Gift Registry" {...field} />
            </FormControl>
            <FormMessage className="mt-0" />
          </FormItem>
        )}
      />
    </>
  );
};
