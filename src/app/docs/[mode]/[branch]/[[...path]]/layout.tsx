import { notFound } from "next/navigation";
import { Metadata } from 'next'
import { siteConfig } from '@/config';

export const metadata: Metadata = {
  title: {
    template: `${siteConfig.title} | %s`,
    default: siteConfig.title, // a default is required when creating a template
  },
}
export default function Layout({
  view,
  // edit,
  // print,
  index,
  params
}: {
  view: React.ReactNode
  // edit: React.ReactNode
  // print: React.ReactNode
  index: React.ReactNode
  // mode = 'view' | 'edit' | 'print'
  // branch: string

  params: { mode: 'view' | 'edit' | 'print', branch: string, path: string[] };

}) {

  if (params.path.length === 1) {
    // it's an index page
    return index;
  }

  switch (params.mode) {
    case 'view':
      return view;
  //   case 'edit':
  //     return edit;
  //   case 'print':
  //     return print;
  }
  return notFound();
}