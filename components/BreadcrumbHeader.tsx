'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from 'next/navigation';
import React from 'react'
import { MobileSidebar } from "./Sidebar";

function BreadcrumbHeader() {
    const pathname = usePathname();
    const paths = pathname == "/" ? [''] : pathname?.split('/');
  return (
    <div className='flex items-center flex-start'>
        <MobileSidebar /> 
        <Breadcrumb>
            <BreadcrumbList>
                {paths.map((path, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbItem>
                            <BreadcrumbLink className='capitalize' href={'/${path}'}>
                                {path == '' ? 'Home' : path}
                            </BreadcrumbLink>
                        </BreadcrumbItem> 
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    </div>
  )
}

export default BreadcrumbHeader