"use client";

import { Workflow } from '@prisma/client';
import React from 'react';
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from '@/app/workflow/_components/FlowEditor';

function Editor({ workflow }: { workflow: Workflow}) {
  return (
    <ReactFlowProvider>
        <div className='flex flex-col h-full w-full overflow-hiddden'>
            <section className='flex h-full aoverflow-auto'>
                <FlowEditor workflow={workflow} />
            </section>
        </div>
    </ReactFlowProvider>
  );
}

export default Editor