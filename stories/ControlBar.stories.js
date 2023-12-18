import React, { useState } from "react";
import Button from "@mui/material/Button";
import { ControlBarComponent as ControlBar } from "@/components/appbar/ControlBarComponent";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "App Bar/ControlBar",
  component: ControlBar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
};

const dummyCollection = {
  source: "github",
  repo: "airwalk_patterns",
  owner: "airwalk-digital",
  branch: "main",
  base_branch: "main",
  path: "providers",
  reference: "provider",
  collections: ["services"],
};

const branches = [
  {
    name: "main",
    commit: {
      sha: "53bfd8457509778140caa47b01c6476d661f1b34",
      url: "https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/53bfd8457509778140caa47b01c6476d661f1b34",
    },
    protected: true,
  },
  {
    name: "branch-1",
    commit: {
      sha: "53bfd8457509778140caa47b01c6476d661f1b34",
      url: "https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/53bfd8457509778140caa47b01c6476d661f1b34",
    },
    protected: false,
  },
  {
    name: "branch-2",
    commit: {
      sha: "09a01dc4e148c35412d3a6a00a384930a41b813b",
      url: "https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/09a01dc4e148c35412d3a6a00a384930a41b813b",
    },
    protected: false,
  },
  {
    name: "branch-3",
    commit: {
      sha: "7080423b89568b0427cb781f8b753f52fbc394e0",
      url: "https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/7080423b89568b0427cb781f8b753f52fbc394e0",
    },
    protected: false,
  },
];

function dummyFunction() {}

export const Simple = {
  args: {
    open: true,
    top: 0,
    handleEdit: dummyFunction,
    handleRefresh: dummyFunction,
    handlePrint: dummyFunction,
    handleAdd: dummyFunction,
    onCollectionUpdate: dummyFunction,
    handlePresentation: dummyFunction,
    collection: dummyCollection,
    branches: branches,
    // branch: "main",
  },
};




export const FullDemo = () => {

  const [collection, setCollection] = useState(dummyCollection);


  function dummyFunction() {}
 
    
  function onCollectionUpdate(collection) {
    setCollection(collection);
  }
  
  return (
    <div>
      <ControlBar
        open={true}
        top={0}
        handleEdit={dummyFunction}
        handleRefresh={dummyFunction}
        handlePrint={dummyFunction}
        handleAdd={dummyFunction}
        handlePresentation={dummyFunction}
        onCollectionUpdate={onCollectionUpdate}
        collection={collection}
        branches={branches}
      />
      
      <div style={{position: "absolute", top: "100px"}}>Collection: {JSON.stringify(collection)}</div>
    </div>
  );
};
