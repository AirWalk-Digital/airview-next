import { Tile } from '@/components/buttons'
import { WrapTheme } from './mdx/utils/mdxify';
import { StoryObj, Meta } from '@storybook/react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

const meta: Meta<typeof Tile> = {
  title: 'MDX/Components/Tile',
  component: Tile,
  tags: ['autodocs'],
  argTypes: {
    name: { control: { type: 'text' } },
    url : { control: { type: 'text' } },
    image: { control: { type: 'text' } },
    description: { control: { type: 'text' } },
    isHero: { control: { type: 'boolean' } },
  },
  decorators: [
    (Story, context) => (
      <WrapTheme>
        <Story />
      </WrapTheme>
    ),
], 
};
export default meta;

type Story = StoryObj<typeof Tile>;

export const Primary: Story = {
  args: {
    name: 'Tile here.............',
    url: 'https://www.google.com',
    image: '/hero/architecture.png',
    }
  };

export const WithDescription: Story = {
  args: {
    name: 'Cloud Architecture',
    url: '',
    image: '/hero/architecture.png',
    description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
    }
  };

export const HeroImage: Story = {
  args: {
    name: 'Lizards',
    url: 'https://www.google.com',
    image: '/hero/lizards.png',
    description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
    isHero: true
    }
  };


export const NoImage: Story = {
  args: {
    name: 'Lizards',
    url: 'https://www.google.com',
    // image: '/hero/hero1.png',
    description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
    }
  };
  
export const TitleOnly: Story = {
  args: {
    name: 'Lizards...............',
    // url: 'https://www.google.com',
    // image: '/hero/hero1.png',
    // description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
    }
  };


export const MultiLineTitle: Story = {
  args: {
    name: 'Lizards are a widespread group of squamate reptiles',
    // url: 'https://www.google.com',
    // image: '/hero/hero1.png',
    // description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
    }
  };

  const dummyTiles = Array.from({ length: 10 }, (_, i) => ({
      frontmatter: {
        title: `Tile ${i + 1}`,
        hero: i < 3, // Set the first 3 tiles as hero
        image: i < 1 ? null : (i < 4 ? 'hero/hero1.png' : null),
        description: [0, 2, 5].includes(i) ? `Lorum ipsum   Random description ${Math.random()}` : null,
      },
      file: `file${i + 1}.md`,
  }));


  const dummyTiles2 = Array.from({ length: 10 }, (_, i) => ({
    frontmatter: {
      title: `Tile ${i + 1}`
    },
    file: `file${i + 1}.md`,
  }));


const dummyTiles3 = [
  {
    "file": "solutions/aws_aft/_index.md",
    "frontmatter": {
      "title": "AWS Account Factory for Terraform",
      "accelerator": "url of associated IaC module(s) (github/ado link)",
      "linked_patterns": [
        "list of linked patterns (directory name)"
      ]
    }
  },
  {
    "file": "solutions/cloud_architecture/_index.md",
    "frontmatter": {
      "title": "Cloud Architecture"
    }
  },
  {
    "file": "solutions/cloud_migrations_lf9hu27a/_index.md",
    "frontmatter": {
      "external_repo": null,
      "external_owner": null,
      "external_path": null,
      "git_provider": null,
      "title": "Cloud Migrations"
    }
  },
  {
    "file": "solutions/cloud_networking/_index.md",
    "frontmatter": {
      "title": "Cloud Networking"
    }
  },
  {
    "file": "solutions/deployment_architecture/_index.md",
    "frontmatter": {
      "title": "Deployment Architecture"
    }
  },
  {
    "file": "solutions/devsecops/_index.md",
    "frontmatter": {
      "title": "DevSecOps"
    }
  },
  {
    "file": "solutions/event_streaming_lpikfmxl/_index.md",
    "frontmatter": {
      "external_repo": null,
      "external_owner": null,
      "external_path": null,
      "git_provider": null,
      "title": "Event Streaming"
    }
  },
  {
    "file": "solutions/finops/_index.md",
    "frontmatter": {
      "external_repo": null,
      "external_owner": null,
      "external_path": null,
      "git_provider": null,
      "title": "FinOps"
    }
  },
  {
    "file": "solutions/istio_ambient_mesh_leemxsdx/_index.md",
    "frontmatter": {
      "external_repo": null,
      "external_owner": null,
      "external_path": null,
      "git_provider": null,
      "title": "Istio Ambient Mesh"
    }
  },
  {
    "file": "solutions/kubernetes/_index.md",
    "frontmatter": {
      "title": "Kubernetes"
    }
  },
  {
    "file": "solutions/observability/_index.md",
    "frontmatter": {
      "date": "2019-06-24T10:28:42.000Z",
      "title": "Observability"
    }
  },
  {
    "file": "solutions/operating_model/_index.md",
    "frontmatter": {
      "title": "Operating Model"
    }
  },
  {
    "file": "solutions/policy_and_controls_engine_lbv0wliz/_index.md",
    "frontmatter": {
      "external_repo": null,
      "external_owner": null,
      "external_path": null,
      "git_provider": null,
      "title": "Policy and Controls Engine"
    }
  },
  {
    "file": "solutions/presentations_as_code_lchkplso/_index.md",
    "frontmatter": {
      "external_repo": null,
      "external_owner": null,
      "external_path": null,
      "git_provider": null,
      "title": "Presentations as Code"
    }
  },
  {
    "file": "solutions/secure_modern_workplace/_index.md",
    "frontmatter": {
      "external_repo": null,
      "external_owner": null,
      "external_path": null,
      "git_provider": null,
      "title": "Secure Modern Workplace"
    }
  },
  {
    "file": "solutions/service_management_l767f4w5/_index.md",
    "frontmatter": {
      "title": "Service Management"
    }
  },
  {
    "file": "solutions/testing_methodology_lina4sqi/_index.md",
    "frontmatter": {
      "external_repo": null,
      "external_owner": null,
      "external_path": null,
      "git_provider": null,
      "title": "Testing Methodology"
    }
  },
  {
    "file": "solutions/training_learning_and_development_ljgw4fux/_index.md",
    "frontmatter": {
      "external_repo": null,
      "external_owner": null,
      "external_path": null,
      "git_provider": null,
      "title": "Training, Learning and Development"
    }
  },
  {
    "file": "solutions/zero_trust_lbxs2kz4/_index.md",
    "frontmatter": {
      "external_repo": null,
      "external_owner": null,
      "external_path": null,
      "git_provider": null,
      "title": "Zero Trust"
    }
  }
]

const Template = (args, context) => {

  return (
    <Container maxWidth="lg" sx={{ maxHeight: '100vh', mt: '2%' }}>

    <Grid container spacing={2} alignItems="stretch">
    {args.tiles ? (
      args.tiles.map((c, i) => (
        <Tile
          key={i}
          name={c?.frontmatter?.title}
          url={c?.file}
          isHero={c?.frontmatter?.hero}
          image={
            c?.frontmatter?.hero && c?.frontmatter?.image != null
              ? `/${c.frontmatter.image}`
              : c?.frontmatter?.hero
              ? '/generic-solution.png'
              : null
          }
          description={c?.frontmatter?.description}
          
        />
      ))) : (
      <div>...loading</div>
    )}
  </Grid>
    </Container>
  );
};

export const MultipleTiles = Template.bind({});
MultipleTiles.args = {
  tiles: dummyTiles,
};

export const MultipleTitleOnlyTiles = Template.bind({});
MultipleTitleOnlyTiles.args = {
  tiles: dummyTiles2,
};

export const RandomTiles = Template.bind({});
RandomTiles.args = {
  tiles: dummyTiles3,
};