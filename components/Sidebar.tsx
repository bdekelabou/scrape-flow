'use client';

import { CoinsIcon, HomeIcon, Icon, Layers2Icon, ShieldCheckIcon } from 'lucide-react';
import React from 'react';

const routes = [
    {
        href: '',
        label: 'Home',
        Icon: HomeIcon,
    },
    {
        href: 'workflows',
        label: 'Workflows',
        Icon: Layers2Icon,
    }, 
    {
        href: 'credentials',
        label: 'Credentials',
        Icon: ShieldCheckIcon, 
    },
    {
        href: 'billing',
        label: 'Billing',
        Icon: CoinsIcon,
    },
];

function DesktopSidebar() {
  return (
    <div className='hidden relative md:block min-w-[280px] h-screen 
    overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 
    dark:text-foreground text-muted-foreground border-r-2 border-separate'>
        DesktopSidebar
    </div>
    );
  
}

export default DesktopSidebar;