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
        <div className='mx-auto w-1/2 '>
        <h1 className='animate-typing overflow-hidden whitespace-nowrap mx-10 mt-10 w-fit'>What can we help you with?</h1>
        </div>
         <div className="grid mt-20  mx-auto gap-2 w-1/2">
      <Textarea placeholder="Type your message here." className=""/>
      <Button>Send message</Button>
    </div>
          <Accordion type="single" collapsible className=" mt-20 mx-auto p-4 text-decoration-none lg:w-1/2 md:w-fit">
            <AccordionItem value="item-1 text-decoration-none">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent className="p-4">
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent className="p-4">
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent className="p-4">
                Yes. It's animated by default, but you can disable it if you prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          </div>
        )
      }
   

export default FAQs