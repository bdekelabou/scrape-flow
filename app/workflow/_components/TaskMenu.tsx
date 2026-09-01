"use client";

import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { TaskType } from '@/types/task';
import { TaskRegistry } from '@/lib/workflow/task/registry';
import { Button } from '@/components/ui/button';

export default function TaskMenu() {
  return (
    <aside className='w-[340px] min-w-[340px] max-w[340px] border-r-2
    border-separate h-full p-2 px-4 overflow-auto'>
        <Accordion
            type='multiple'
            className='w-full'
            defaultValue={["extraction", "interactions", "timing", "storage", "ai", "general"]}
        >
            <AccordionItem value='extraction'>
                <AccordionTrigger className='font-bold'>
                    Data extraction
                </AccordionTrigger>
                <AccordionContent className='flex flex-col gap-1'>
                    <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
                    <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
                    <TaskMenuBtn taskType={TaskType.EXTRACT_DATA_WITH_AI} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='interactions'>
                <AccordionTrigger className='font-bold'>
                    User interactions
                </AccordionTrigger>
                <AccordionContent className='flex flex-col gap-1'>
                    <TaskMenuBtn taskType={TaskType.FILL_INPUT} />
                    <TaskMenuBtn taskType={TaskType.CLICK_ELEMENT} />
                    <TaskMenuBtn taskType={TaskType.NAVIGATE_TO_URL} />
                    <TaskMenuBtn taskType={TaskType.SCROLL_TO_ELEMENT} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='timing'>
                <AccordionTrigger className='font-bold'>
                    Timing controls
                </AccordionTrigger>
                <AccordionContent className='flex flex-col gap-1'>
                    <TaskMenuBtn taskType={TaskType.WAIT_FOR_ELEMENT} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='storage'>
                <AccordionTrigger className='font-bold'>
                    Storage
                </AccordionTrigger>
                <AccordionContent className='flex flex-col gap-1'>
                    <TaskMenuBtn taskType={TaskType.READ_PROPERTY_FROM_JSON} />
                    <TaskMenuBtn taskType={TaskType.ADD_PROPERTY_TO_JSON} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='general'>
                <AccordionTrigger className='font-bold'>
                    General
                </AccordionTrigger>
                <AccordionContent className='flex flex-col gap-1'>
                    <TaskMenuBtn taskType={TaskType.DELIVER_VIA_WEBHOOK} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </aside>
  );
}

function TaskMenuBtn({taskType}:{taskType: TaskType}){
    const task = TaskRegistry[taskType];

    const onDragStart = (event: React.DragEvent, type: TaskType) => {
        event.dataTransfer.setData('application/reactflow', type);
        event.dataTransfer.effectAllowed = 'move';
    };
    return(
        <Button
            variant={'secondary'}
            className='flex justify-between items-center gap-2 border w-full'
            draggable
            onDragStart={event => onDragStart(event, taskType)}
        >
            <div className='flex gap-2'>
                <task.icon size={20} />
                {task.label}
            </div>
        </Button>
    );
}
