"use client";

import { Workflow } from '@prisma/client';
import React from 'react';
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from '@/app/workflow/_components/FlowEditor';
import Topbar from '@/app/workflow/_components/topbar/Topbar';

function Editor({ workflow }: { workflow: Workflow}) {
  return (
    <ReactFlowProvider>
        <div className='flex flex-col h-full w-full overflow-hiddden'>
          <Topbar
            title='Workflow editor' 
            subtitle={workflow.name}
            workflowId={workflow.id} 
          />
            <section className='flex h-full aoverflow-auto'>
                <FlowEditor workflow={workflow} />
            </section>
        </div>
    </ReactFlowProvider>
  );
}

export default Editor