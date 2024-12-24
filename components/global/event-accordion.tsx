import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function EventAccordion({ items }: { items: any[] }) {
  return (
    <Accordion
      type='multiple'
      defaultValue={['item-0', 'item-1']}
      className='w-full border border-[#E5E5E6] rounded-md'
    >
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className='border-none'
        >
          <AccordionTrigger className='flex justify-between items-center p-4 bg-[#F3F4F9] rounded-t-md py-2'>
            <span className='font-semibold'>{item.trigger}</span>
          </AccordionTrigger>
          <AccordionContent className='p-4'>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
