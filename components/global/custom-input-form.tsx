import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import DateInput from "./date-input";
import Editor from "./editor";

const CustomInputForm = ({
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
      {fields.map((field: any, index: number) => (
        <EachCustomInput
          form={form}
          key={index}
          index={index}
          remove={remove}
        />
      ))}

      <div
        className="w-full border-dashed border border-gray-300 rounded-lg py-3 text-sm flex items-center justify-center gap-2 cursor-pointer"
        onClick={() =>
          append({
            title: "",
            description: "",
            buttonText: "",
            buttonUrl: "",
            date: "",
            time: "",
          })
        }
      >
        <Plus className="w-4 h-4" />
        Add Another Custom Field
      </div>
    </div>
  );
};

export default CustomInputForm;

const EachCustomInput = ({ form, index, remove }: any) => {
  return (
    <>
      <FormField
        control={form.control}
        name={`customFields.${index}.title`}
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
        name={`customFields.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Description</FormLabel>
            <FormControl>
              {/* <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY as string}
                value={field.value}
                init={{
                  height: 200,
                  menubar: false,
                  branding: false,
                  statusbar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                    'fontsize textcolor',
                  ],
                  toolbar:
                    'undo redo | formatselect fontselect fontfamily fontsize | bold italic backcolor forecolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help',
                }}
                onEditorChange={(content) => field.onChange(content)}
              /> */}
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
        name={`customFields.${index}.buttonText`}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2 space-y-0">
            <FormLabel className="font-bold">Button Text</FormLabel>
            <FormControl>
              <Input type="text" placeholder="" {...field} />
            </FormControl>
            <FormMessage className="mt-0" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`customFields.${index}.buttonUrl`}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2 space-y-0">
            <FormLabel className="font-bold">Button URL</FormLabel>
            <FormControl>
              <Input
                type="url"
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
        name={`customFields.${index}.date`}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2 space-y-0">
            <FormLabel className="font-bold">Date</FormLabel>
            <FormControl>
              <DateInput field={field} label="Date" />
            </FormControl>
            <FormMessage className="mt-0" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`customFields.${index}.time`}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2 space-y-0">
            <FormLabel className="font-bold">Time</FormLabel>
            <FormControl>
              <Input type="time" placeholder="" {...field} />
            </FormControl>
            <FormMessage className="mt-0" />
          </FormItem>
        )}
      />
    </>
  );
};
