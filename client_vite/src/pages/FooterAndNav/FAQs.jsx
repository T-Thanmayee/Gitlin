import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import { Textarea } from "@/components/ui/textarea"
  import { Button } from "@/components/ui/button"
  
function FAQs() {
  return (
  
       <div>
         <div className="grid w-1/2 mt-10  mx-auto gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
          <Accordion type="single" collapsible className="w-1/2 mt-20 mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It's animated by default, but you can disable it if you prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          </div>
        )
      }
   

export default FAQs