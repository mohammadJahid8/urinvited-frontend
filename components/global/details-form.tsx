import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Switch } from "../ui/switch";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";

import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import DateInput from "./date-input";
import LocationMap from "./location-map";
import LocationInput from "./location-input";
import Editor from "./editor";

const timeZones = [
  { value: "UTC", label: "Coordinated Universal Time" },
  { value: "GMT", label: "Greenwich Mean Time" },

  // North America
  { value: "EST", label: "Eastern Standard Time" },
  { value: "EDT", label: "Eastern Daylight Time" },
  { value: "CST", label: "Central Standard Time" },
  { value: "CDT", label: "Central Daylight Time" },
  { value: "MST", label: "Mountain Standard Time" },
  { value: "MDT", label: "Mountain Daylight Time" },
  { value: "PST", label: "Pacific Standard Time" },
  { value: "PDT", label: "Pacific Daylight Time" },
  { value: "AKST", label: "Alaska Standard Time" },
  { value: "AKDT", label: "Alaska Daylight Time" },
  { value: "HST", label: "Hawaii-Aleutian Standard Time" },
  { value: "HDT", label: "Hawaii-Aleutian Daylight Time" },
  { value: "AST", label: "Atlantic Standard Time" },
  { value: "ADT", label: "Atlantic Daylight Time" },
  { value: "NST", label: "Newfoundland Standard Time" },
  { value: "NDT", label: "Newfoundland Daylight Time" },

  // South America
  { value: "ART", label: "Argentina Time" },
  { value: "BRT", label: "Brasilia Time" },
  { value: "CLT", label: "Chile Standard Time" },
  { value: "GFT", label: "French Guiana Time" },
  { value: "PYT", label: "Paraguay Time" },
  { value: "UYT", label: "Uruguay Standard Time" },
  { value: "FKT", label: "Falkland Islands Time" },
  { value: "VET", label: "Venezuelan Standard Time" },

  // Europe
  { value: "CET", label: "Central European Time" },
  { value: "CEST", label: "Central European Summer Time" },
  { value: "EET", label: "Eastern European Time" },
  { value: "EEST", label: "Eastern European Summer Time" },
  { value: "BST", label: "British Summer Time" },
  { value: "WET", label: "Western European Time" },
  { value: "WEST", label: "Western European Summer Time" },
  { value: "MSK", label: "Moscow Standard Time" },

  // Africa
  { value: "CAT", label: "Central Africa Time" },
  { value: "EAT", label: "East Africa Time" },
  { value: "SAST", label: "South Africa Standard Time" },
  { value: "WAT", label: "West Africa Time" },

  // Asia
  { value: "IST", label: "Indian Standard Time" },
  { value: "PKT", label: "Pakistan Standard Time" },
  { value: "BST", label: "Bangladesh Standard Time" },
  { value: "MST", label: "Myanmar Standard Time" },
  { value: "ICT", label: "Indochina Time" },
  { value: "CST", label: "China Standard Time" },
  { value: "SGT", label: "Singapore Time" },
  { value: "HKT", label: "Hong Kong Time" },
  { value: "JST", label: "Japan Standard Time" },
  { value: "KST", label: "Korea Standard Time" },
  { value: "IRKT", label: "Irkutsk Time" },
  { value: "KRAT", label: "Krasnoyarsk Time" },
  { value: "OMST", label: "Omsk Time" },
  { value: "VST", label: "Vietnam Standard Time" },
  { value: "PHT", label: "Philippine Time" },

  // Australia & Pacific
  { value: "AEST", label: "Australian Eastern Standard Time" },
  { value: "AEDT", label: "Australian Eastern Daylight Time" },
  { value: "ACST", label: "Australian Central Standard Time" },
  { value: "ACDT", label: "Australian Central Daylight Time" },
  { value: "AWST", label: "Australian Western Standard Time" },
  { value: "NZST", label: "New Zealand Standard Time" },
  { value: "NZDT", label: "New Zealand Daylight Time" },
  { value: "FJT", label: "Fiji Time" },
  { value: "SBT", label: "Solomon Islands Time" },
  { value: "CHST", label: "Chamorro Standard Time" },
  { value: "TKT", label: "Tokelau Time" },
  { value: "WST", label: "Western Samoa Time" },

  // Antarctica
  { value: "ROTT", label: "Rothera Time" },
  { value: "MAWT", label: "Mawson Time" },
  { value: "VOST", label: "Vostok Time" },

  // Middle East
  { value: "IRST", label: "Iran Standard Time" },
  { value: "AST", label: "Arabia Standard Time" },
  { value: "GST", label: "Gulf Standard Time" },
  { value: "AFT", label: "Afghanistan Time" },
];

const DetailsForm = ({
  form,
  fields,
  append,
  remove,
  hasEndDate,
  setHasEndDate,
  selectedLocation,
  setSelectedLocation,
}: {
  form: any;
  fields: any;
  append: any;
  remove: any;
  hasEndDate: boolean;
  setHasEndDate: (value: boolean) => void;
  selectedLocation: any;
  setSelectedLocation: (value: any) => void;
}) => {
  const [inviteDetails, setInviteDetails] = useState(false);

  return (
    <div className="flex flex-col gap-6" key={form.watch("events.0.timeZone")}>
      <FormField
        control={form.control}
        name="hostedBy"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2 space-y-0">
            <FormLabel className="font-bold">Hosted By</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter Hosted By" {...field} />
            </FormControl>
            <FormMessage className="mt-0" />
          </FormItem>
        )}
      />

      {fields.map((event: any, index: number) => (
        <EachEvent
          form={form}
          setInviteDetails={setInviteDetails}
          inviteDetails={inviteDetails}
          setHasEndDate={setHasEndDate}
          hasEndDate={hasEndDate}
          key={index}
          index={index}
          remove={remove}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          event={event}
        />
      ))}

      <div
        className="w-full border-dashed border border-gray-300 rounded-lg py-3 text-sm flex items-center justify-center gap-2 cursor-pointer"
        onClick={() =>
          append({
            title: "",
            inviteDetails: false,
            startDate: undefined,
            startTime: undefined,
            timeZone: "",
            endDate: undefined,
            endTime: undefined,
            locationName: "",
            address: "",
            showGoogleMap: false,
            virtualPlatformName: "",
            virtualUrl: "",
            when: "startDateTime",
            locationType: "in-person",
          })
        }
      >
        <Plus className="w-4 h-4" />
        Add Another Event
      </div>
    </div>
  );
};

export default DetailsForm;

const EachEvent = ({
  form,
  setHasEndDate,
  hasEndDate,
  index,
  remove,
  selectedLocation,
  setSelectedLocation,
  event,
}: any) => {
  return (
    <>
      <FormField
        control={form.control}
        name={`events.${index}.title`}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2 space-y-0">
            <div className="flex items-center justify-between">
              <FormLabel className="font-bold">
                Event Title{" "}
                {index === 0 && <span className="text-red-500">*</span>}
              </FormLabel>
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
              <Input type="text" placeholder="Enter Event Title" {...field} />
            </FormControl>
            <FormMessage className="mt-0" />
          </FormItem>
        )}
      />

      {/* Invite Details Section */}
      <FormField
        control={form.control}
        name={`events.${index}.inviteDetails`}
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2 justify-between">
              <FormLabel className="font-bold">Invite Details</FormLabel>

              <Switch
                id={`events.${index}.inviteDetails`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
            {field.value && (
              <FormControl>
                {/* <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY as string}
                  value={field.value}
                  init={{
                    height: 200,
                    menubar: false,
                    branding: false,
                    statusbar: false,
                    placeholder: "Enter Invite Details",
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                      "fontsize textcolor",
                    ],
                    toolbar:
                      "undo redo | formatselect fontselect fontfamily fontsize | bold italic backcolor forecolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help",
                  }}
                  onEditorChange={(content) => field.onChange(content)}
                /> */}
                <Editor
                  value={field.value}
                  onChange={(content) => field.onChange(content)}
                  placeholder="Enter Invite Details"
                />
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      {/* When Section */}
      <FormField
        control={form.control}
        name={`events.${index}.when`}
        render={({ field }) => (
          <div className="">
            <FormLabel className="font-bold">
              When {index === 0 && <span className="text-red-500">*</span>}
            </FormLabel>

            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="mt-2 flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="startDateTime"
                  id={`startDateTime-${index}`}
                />
                <Label
                  htmlFor={`startDateTime-${index}`}
                  className="font-normal"
                >
                  Start date and time
                </Label>
              </div>
              {field.value !== "tbd" && (
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name={`events.${index}.startDate`}
                    render={({ field }) => (
                      <DateInput field={field} label="Pick a date" />
                    )}
                  />
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name={`events.${index}.startTime`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input type="time" {...field} lang="en-US" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`events.${index}.timeZone`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Select onValueChange={field.onChange} {...field}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time zone" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeZones.map((tz) => (
                                <SelectItem key={tz.value} value={tz.value}>
                                  {tz.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Add End Date/Time or To Be Determined */}
              {field.value !== "tbd" && (
                <div className="">
                  <button
                    type="button"
                    className="text-blue-500 hover:underline font-normal"
                    onClick={() => setHasEndDate((prev: boolean) => !prev)}
                  >
                    Add end date/time (Optional)
                  </button>
                  {hasEndDate && (
                    <div className="flex gap-4 mt-2">
                      <FormField
                        control={form.control}
                        name={`events.${index}.endDate`}
                        render={({ field }) => (
                          <DateInput field={field} label="Pick a date" />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`events.${index}.endTime`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2">
                <RadioGroupItem value="tbd" id={`tbd-${index}`} />
                <Label htmlFor={`tbd-${index}`} className="font-normal">
                  To be determined
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}
      />

      {/* Location Section */}
      <FormField
        control={form.control}
        name={`events.${index}.locationType`}
        render={({ field }) => (
          <div className="">
            <FormLabel className="font-bold">
              Location {index === 0 && <span className="text-red-500">*</span>}
            </FormLabel>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="mt-2 flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="in-person" id={`in-person-${index}`} />
                <Label htmlFor={`in-person-${index}`} className="font-normal">
                  In person
                </Label>
              </div>
              <FormField
                control={form.control}
                name={`events.${index}.address`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {field.value === "in-person" && (
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name={`events.${index}.locationName`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          {/* <Input placeholder='Location Name' {...field}    /> */}
                          <LocationInput
                            setSelectedLocation={setSelectedLocation}
                            field={field}
                            form={form}
                            index={index}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <input
                    type='hidden'
                    {...form.register(`events.${index}.latLng`)}
                    value={JSON.stringify(selectedLocation)}
                  /> */}
                  <FormField
                    control={form.control}
                    name={`events.${index}.latLng`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input type="hidden" {...field} />
                        </FormControl>
                        {field.value?.lat && field.value?.lng && (
                          <LocationMap selectedLocation={field.value} />
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`events.${index}.showGoogleMap`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id={`showGoogleMap-${index}`}
                          />
                          <label
                            htmlFor={`showGoogleMap-${index}`}
                            className="font-semibold text-[13px]"
                          >
                            Show Google Map Link
                          </label>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <RadioGroupItem value="virtual" id={`virtual-${index}`} />
                <Label htmlFor={`virtual-${index}`} className="font-normal">
                  Virtual
                </Label>
              </div>
              {field.value === "virtual" && (
                <div className="flex flex-col gap-2 mt-2">
                  <FormField
                    control={form.control}
                    name={`events.${index}.virtualPlatformName`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            placeholder="Virtual Platform Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`events.${index}.virtualUrl`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input placeholder="URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </RadioGroup>
          </div>
        )}
      />
    </>
  );
};
