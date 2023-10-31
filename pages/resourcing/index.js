// You can use this code in a separate component that's imported in your pages.
// import type { CodeBlockEditorDescriptor } from '@mdxeditor/editor';
import { ResourceTable, DemandTable }  from '@/components/resourcing'
import { useState, useEffect } from "react";
import resourcing from './resourcing.json';
import demand from './demand.json';


export default function Page() {

  return (
    <>
    <DemandTable data={demand} />

    <ResourceTable data={resourcing} />
    </>
  )
}