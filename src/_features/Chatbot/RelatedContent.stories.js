import RelatedContent from './RelatedContent';
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Chatbot/RelatedContent',
  component: RelatedContent,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: '',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    relevantDocs: {
      control: {
        type: 'object',
      },
    },
    selectedBotMessageId: {
      control: {
        type: 'select',
        options: ['bot-1712698088246', 'bot-1712698381360'],
      },
    },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    relevantDocs: [
      {
        pageContent:
          'Public Sector Impact: We proudly serve the public sector, including the Department of Levelling Up, Housing & Communities (DLUHC) and the Department of Work & Pensions (DWP), contributing to their regulatory compliance and security requirements.',
        metadata: {
          source: 'sharepoint',
          category_depth: 0,
          languages: ['eng'],
          parent_id: '53d548aa01fc3eb72da15a5be7f235e2',
          file_directory: '/tmp',
          filename: 'tmpayfj3u09',
          filetype:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          category: 'NarrativeText',
          title: 'PROC 669-2023 Change Delivey-FINAL RESPONSES.docx',
          file: 'salesteam/Bid%20Library/To%20File/PROC%20669-2023%20Change%20Delivey-FINAL%20RESPONSES.docx',
          url: 'https://airwalkconsulting.sharepoint.com/sites/salesteam/Bid%20Library/To%20File/PROC%20669-2023%20Change%20Delivey-FINAL%20RESPONSES.docx',
        },
        messageId: 'bot-1712698088246',
        docId: 'bot-1712698088246-0',
        role: 'bot',
        type: 'RelevantDocs',
      },
      {
        pageContent:
          "---\ntitle: DevSecOps\n---\n# Introduction\nDevOps has many definitions but the one that stands out is by Donovan Brown:\n\n```\nDevOps is the union of people, processes and products to enable continuous delivery of value to our end users\n```\n\nMany organisation view DevOps as a technology stack or a set of tools that must be used throughout the software delivery process. This leads to a top down approach which doesn't allow room for creativity and progression.\n\nImprovements can only be made if the starting point and regular consistent measurement techniques are applied throughout the SDLC. Tuning the delivery lifecycle can then be reviewed by analysing the trends and confirming if the desired out come is being realised or further tuning is required.\n\nThe DevOps Maturity model below is based on established practices designed to drive a higher release cadence whilst keeping risk low. It is broken down by L1 and L2 capabilities with 5 levels of maturity per topic, in line with the Capability Maturity Model. However,",
        metadata: {
          title: 'DevSecOps',
          file: 'solutions/devsecops/_index.md',
          url: 'https://mdx.airview.airwalkconsulting.io/solutions/devsecops/_index.md',
        },
        messageId: 'bot-1712698088246',
        docId: 'bot-1712698381360-0',
        role: 'bot',
        type: 'RelevantDocs',
      },
    ],
    selectedBotMessageId: 'bot-1712698088246',
  },
};
