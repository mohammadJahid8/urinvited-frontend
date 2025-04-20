import { Calendar } from "../ui/calendar";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

import { FormControl, FormMessage } from "../ui/form";

import { FormItem } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import dateFormatter from "@/utils/dateFormatter";

const DateInput = ({ field, label }: { field: any; label: string }) => (
  <FormItem className="w-full">
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-full pl-3 text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value ? dateFormatter(field.value) : <span>{label}</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Calendar
          mode="single"
          selected={
            field.value ? new Date(dateFormatter(field.value)) : undefined
          }
          onSelect={(date) => {
            const formatted = date ? format(date, "yyyy-MM-dd") : "";
            field.onChange(formatted);
          }}
          // disabled={(date) => date < new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    <FormMessage />
  </FormItem>
);

export default DateInput;
