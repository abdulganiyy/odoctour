import React, { JSX, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { type FieldConfig } from "@/types";
// import { getZipData } from '@/lib/utils';
// import EmailInput from '../email-input';
import PhoneInput from "../phone-input";
// import InputWithIcon from '../input-with-icon';
// import ButtonRadioGroup from '../button-radio-group';
import DatePicker from "../date-picker";
// import CheckboxGroup from '../checkbox-group';
// import CheckboxSingle from '../checkbox-single';
// import { MultiSelect } from 'react-multi-select-component';
import FileDropzone from "../file-dropzone";
import { debounce } from "lodash";
import PictureUpload from "../picture-upload";
import TimeSlotsInput from "../timeslots-input";

interface RenderFormFieldProps {
  field: FieldConfig;
  rhfField: any; // The field object from react-hook-form
  isDisabled?: boolean;
}

export const FormField = ({
  field,
  rhfField,
  isDisabled,
}: RenderFormFieldProps): JSX.Element | null => {
  const { setValue } = useFormContext();

  // Initialize local state and debounce outside the switch statement
  const [localValue, setLocalValue] = useState(rhfField.value || "");
  const debouncedOnChange = useRef(
    debounce((value) => rhfField.onChange({ target: { value } }), 200)
  ).current;
  // The `handleTextareaChange` function separates immediate UI updates and debounced form state updates.
  // `setLocalValue` ensures the textarea reflects user input instantly for a responsive typing experience.
  // `debouncedOnChange` (wrapped in `useRef` for stability) updates the form state after a 200ms delay,
  //  reducing unnecessary calls to `rhfField.onChange` and improving performance in larger forms.
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue); // Immediate update for local UI
    debouncedOnChange(newValue); // Debounced update for form
  };

  //   const getZipDataAndSetCityState = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
  //     const zip = e.target.value;

  //     if (zip.length === 5) {
  //       try {
  //         const zipData = await getZipData(zip);
  //         if (zipData.length) {
  //           setValue('city', zipData[0].place_name);
  //           setValue('state', zipData[0].state_abbr);
  //         }
  //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //       } catch (error) {
  //         /* fail silently, allow user to fill in city/state manually */
  //       }
  //     }
  //   };
  //   const InputComponent = field.icon ? InputWithIcon : Input;
  switch (field.type) {
    case "text":
    case "number":
    case "password":
      return (
        <Input
          //   icon={field.icon}
          className="max-h-9"
          type={field.type}
          placeholder={field.placeholder}
          disabled={isDisabled}
          {...rhfField}
          value={rhfField.value || ""}
          min={field.min}
          max={field.max}
        />
      );

    case "email":
      return (
        <Input
          className="max-h-9"
          placeholder={field.placeholder}
          disabled={isDisabled}
          {...rhfField}
          value={rhfField.value || ""}
        />
      );

    case "tel":
      return (
        <PhoneInput
          className="max-h-9"
          placeholder={field.placeholder}
          defaultCountry="NG"
          disabled={isDisabled}
          {...rhfField}
          value={rhfField.value || ""}
        />
      );

    case "textarea":
      return (
        <Textarea
          disabled={isDisabled}
          placeholder={field.placeholder}
          onChange={handleTextareaChange}
          value={localValue}
        />
      );

    case "radio":
      return (
        <RadioGroup
          onValueChange={rhfField.onChange}
          value={rhfField.value || ""}
          disabled={isDisabled}
          className="flex flex-col space-y-1"
        >
          {field.options?.map((option: any) => (
            <FormItem
              key={option?.value}
              className="flex items-center space-x-3 space-y-0"
            >
              <FormControl>
                <RadioGroupItem
                  value={option.value}
                  defaultValue={option.value || undefined}
                />
              </FormControl>
              <FormLabel className="font-normal">{option?.label}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      );

    case "select":
      return (
        <Select
          onValueChange={rhfField.onChange}
          value={rhfField.value}
          disabled={isDisabled || !field.options?.length}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue
              /* Placeholder logic if `dynamicOptionsKey` is present:
               * `options` is undefined if the dynamic options are still loading
               * `options` is null if there was an API error fetching options
               * `options` is an empty array if the dynamic options have loaded but there are no options
               * Otherwise, populate options and use default placeholder
               */
              // placeholder={
              //   field.dynamicOptionsKey
              //     ? field.options === undefined
              //       ? 'Loading...'
              //       : field.options === null
              //         ? 'Error fetching options'
              //         : !field.options?.length
              //           ? 'No options available'
              //           : field.placeholder
              //     : field.placeholder
              // }
              />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {field.options?.map((option: any) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    // case 'multi-select':
    //   return (
    //     <MultiSelect
    //       // @ts-ignore
    //       options={field.options || []}
    //       value={rhfField.value || []}
    //       onChange={rhfField.onChange}
    //       labelledBy={field.label || 'Select'}
    //       disabled={isDisabled}
    //       hasSelectAll={true}
    //       disableSearch={false}
    //       overrideStrings={{
    //         selectSomeItems: field.placeholder || 'Select All Applicable',
    //         allItemsAreSelected: 'All items are selected',
    //         selectAll: 'Select All',
    //         search: 'Search',
    //       }}
    //     />
    //   );

    // case 'checkbox':
    //   return (
    //     <CheckboxSingle
    //       description={field.checkboxLabel}
    //       value={rhfField.value || false}
    //       onChange={rhfField.onChange}
    //       // TODO: add disabled prop to CheckboxSingle
    //       // disabled={isDisabled}
    //     />
    //   );

    // case 'checkbox-group':
    //   return (
    //     <CheckboxGroup
    //       options={field.options || []}
    //       values={rhfField.value || []}
    //       onChange={rhfField.onChange}
    //       // TODO: add disabled prop to CheckboxGroup
    //       // disabled={isDisabled}
    //     />
    //   );

    // Specialized custom field types

    // case 'button-radio-group':
    //   return (
    //     <ButtonRadioGroup
    //       options={field.options || []}
    //       value={rhfField.value}
    //       onChange={rhfField.onChange}
    //       name={field.name}
    //       disabled={isDisabled}
    //     />
    //   );

    case "date":
      return (
        <DatePicker
          disabled={isDisabled}
          date={rhfField.value}
          setDate={rhfField.onChange}
          minDate={field.minDate}
          maxDate={field.maxDate}
        />
      );

    case "time":
      return (
        <Input
          type="time"
          placeholder={field.placeholder}
          disabled={isDisabled}
          {...rhfField}
          value={rhfField.value || ""}
        />
      );

    case "files":
      return (
        <FileDropzone
          name={field.name}
          files={rhfField.value || []}
          maxFiles={field.fileUploadOptions?.maxFiles || 1}
          maxSize={field.fileUploadOptions?.maxSize || 1024 * 1024 * 5}
          accept={field.fileUploadOptions?.accept}
        />
      );

    case "picture-upload":
      return (
        <PictureUpload
          name={field.name}
          file={rhfField.value || {}}
          maxSize={field.fileUploadOptions?.maxSize || 1024 * 1024 * 1}
        />
      );

    case "availability":
      return <TimeSlotsInput name={field.name} />;

    // case 'zip':
    //   return (
    //     <Input
    //       type='text'
    //       placeholder={field.placeholder}
    //       {...rhfField}
    //       value={rhfField.value || ''}
    //       onBlur={(e) => void getZipDataAndSetCityState(e)}
    //       disabled={isDisabled}
    //     />
    //   );

    // TODO: more cases

    default:
      return null;
  }
};
