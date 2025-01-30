import React from 'react'
import { ILogEntry } from './FetchService';
import { useRouter } from 'next/navigation';
import { BookPageIndex } from '@/types/BookPageIndex';
import { AppRouterInstance } from 'next/navigation';
import { Page } from '@/types/Page';


export class NavigationService {
    static navigateTo(router: AppRouterInstance, location: BookPageIndex) {
        switch (location.page) {
            case Page.Homepage:
                router.push('/');
                break;
            case Page.Entry:
                if (location.entry) {
                    router.push('/tag/' + location.entry.Id);
                }
                break;
        }
    }
}
