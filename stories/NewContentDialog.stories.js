import React, { useState } from "react";
import Button from "@mui/material/Button";
import { NewContentDialog } from "@/components/appbar";
import { ControlBarComponent as ControlBar } from "@/components/appbar/ControlBarComponent";
import { toSnakeCase } from '@/lib/utils/stringUtils';
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "App Bar/NewContentDialog",
  component: NewContentDialog,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    handleAdd: { action: 'clicked' } 
    // backgroundColor: { control: 'color' },
  },
};

const testCollection = {
  source: "github",
  repo: "airwalk_patterns",
  owner: "airwalk-digital",
  base_branch: "main",
  branch: "main",
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

const dropDown = [
  {
    "label" : "page 1",
    "url" : {
    "path": "services/aws_control_tower/_index.md",
    "sha": "e1ff02d1e584db64845ad2587d0ef27c09c789b7"
    }
  },
  {
    "label" : "page 2",
    "url" : {
    "path": "services/aws_control_tower/_index.md",
    "sha": "e1ff02d1e584db64845ad2587d0ef27c09c789b7"
    }
  },
  {
    "label" : "page 3",
    "url" : {
    "path": "services/aws_control_tower/_index.md",
    "sha": "e1ff02d1e584db64845ad2587d0ef27c09c789b7"
    }
  }
]


export const DialogWithButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState({});

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = (context) => {
    setContext(JSON.stringify(context));
    setIsOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open Dialog</Button>
      <NewContentDialog
        dialogOpen={isOpen}
        handleDialog={handleClose}
        // other props you might need to pass
      />
      <div>{String(context)}</div>
    </div>
  );
};

export const WithControlBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState({});

  const [collection, setCollection] = useState(testCollection);


  function dummyFunction() {}
 
  const handleAdd = (result) => {
    setIsOpen(true);
  };
  const onContextUpdate = (collection) => {
    setCollection(collection);
  }
  const handleClose = (context) => {
    let newContent = {}
    if (context.frontmatter && context.frontmatter.title && context.frontmatter.type) {
      newContent.frontmatter = context.frontmatter
      newContent.path = context.frontmatter.type + '/' + toSnakeCase(context.frontmatter.title) + '/_index.mdx';

    }
    setContext(JSON.stringify(newContent));

    setIsOpen(false);
  };

  return (
    <div>
      <ControlBar
        open={true}
        top={0}
        handleEdit={dummyFunction}
        handleRefresh={dummyFunction}
        handlePrint={dummyFunction}
        handleAdd={handleAdd}
        handlePresentation={dummyFunction}
        onContextUpdate={onContextUpdate}
        collection={collection}
        context={context}
        branches={branches}
        // branch={"branch-1"}
      />
      <NewContentDialog
        dialogOpen={isOpen}
        handleDialog={handleClose}
        initialDropDownData={dropDown}
        // other props you might need to pass
      />
      <div style={{position: "absolute", top: "100px"}}>Result: {String(context)}</div>
    </div>
  );
};
