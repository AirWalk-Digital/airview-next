/* eslint-disable */
// Menu.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import { fn } from '@storybook/test';
import React from 'react';

import type { ContentMenuProps } from './ContentMenu';
import { ContentMenu } from './ContentMenu';

export default {
  title: 'Menus/ContentMenu',
  component: ContentMenu,
  args: {
    handleContentChange: fn(),
    handlePageReset: fn(),
  },
} as Meta;

const Template: StoryFn<ContentMenuProps> = (args) => <ContentMenu {...args} />;

export const Default = Template.bind({});
Default.args = {
  content: {
    'directory1': {
      services: [{ label: 'Item 1', url: '/item1' }],
      solutions: [{ label: 'Item 2', url: '/item2' }],
      chapters: [{ label: 'Chapter 1', url: '/chapter1' }],
    },
  },
  context: {
    file: 'directory1/file1',
    collections: ['collection1', 'collection2'],
    source: 'github',
    repo: 'repo1',
    owner: 'owner',
    branch: 'main',
    path: 'services',
    reference: 'service',
    menu: {
      component: 'FullHeaderMenu',
      collection: 'providers',
    },
  },
  loading: false,
};

export const Loading = Template.bind({});
Loading.args = {
  content: {
    directory1: {
      collection1: [{ label: 'Item 1', url: '/item1' }],
      collection2: [{ label: 'Item 2', url: '/item2' }],
      chapters: [{ label: 'Chapter 1', url: '/chapter1' }],
    },
  },
  context: {
    file: 'directory1/file1',
    collections: ['collection1', 'collection2'],
    source: 'github',
    repo: 'repo1',
    owner: 'owner',
    branch: 'main',
    path: 'services',
    reference: 'service',
    menu: {
      component: 'FullHeaderMenu',
      collection: 'providers',
    },
  },
  loading: true,
};

export const EmptyContent = Template.bind({});
EmptyContent.args = {
  content: {},
  context: {
    file: '',
    collections: [],
    source: 'github',
    repo: 'repo1',
    owner: 'owner',
    branch: 'main',
    path: 'services',
    reference: 'service',
    menu: {
      component: 'FullHeaderMenu',
      collection: 'providers',
    },
  },
  loading: false,
};

export const NoCollections = Template.bind({});
NoCollections.args = {
  content: {
    directory1: {
      chapters: [{ label: 'Chapter 1', url: '/chapter1' }],
    },
  },
  context: {
    file: 'directory1/file1',
    collections: [],
    source: 'github',
    repo: 'repo1',
    owner: 'owner',
    branch: 'main',
    path: 'services',
    reference: 'service',
    menu: {
      component: 'FullHeaderMenu',
      collection: 'providers',
    },
  },
  loading: false,
};

export const MultipleCollections = Template.bind({});
MultipleCollections.args = {
  content: {
    directory1: {
      collection1: [{ label: 'Item 1', url: '/item1' }],
      collection2: [{ label: 'Item 2', url: '/item2' }],
      collection3: [{ label: 'Item 3', url: '/item3' }],
      chapters: [{ label: 'Chapter 1', url: '/chapter1' }],
    },
  },
  context: {
    file: 'directory1/file1',
    collections: ['collection1', 'collection2', 'collection3'],
    source: 'github',
    repo: 'repo1',
    owner: 'owner',
    branch: 'main',
    path: 'services',
    reference: 'service',
    menu: {
      component: 'FullHeaderMenu',
      collection: 'providers',
    },
  },
  loading: false,
};

const fullContent = {
  'solutions/cloud_architecture': {
    chapters: [
      {
        label: 'Cloud Architecture Presentation',
        url: 'solutions/cloud_architecture/architecture_presentation.ppt.mdx',
      },
      {
        label: 'Test MDX',
        url: 'solutions/cloud_architecture/test.mdx',
      },
    ],
    solutions: [
      {
        label: 'CSP Landing Zones',
        url: 'solutions/cloud_landing_zones/_index.md',
      },
    ],
    designs: [
      {
        label: 'Discovery - Azure Governance Export',
        url: 'designs/discovery_azure_governance_export_l7yyys9e/_index.md',
      },
    ],
  },
  'solutions/observability': {
    chapters: [
      {
        label: 'AWS CloudWatch',
        url: 'solutions/observability/cloudwatch.md',
      },
    ],
  },
  'solutions/zero_trust_lbxs2kz4': {
    chapters: [
      {
        label: 'Zero Trust Presentation',
        url: 'solutions/zero_trust_lbxs2kz4/zta_presentation.ppt.mdx',
      },
    ],
  },
  knowledge: {},
  designs: {},
  'solutions/artificial_intelligence_coe': {
    designs: [
      {
        label: 'AI Request Routing',
        url: 'designs/ai_request_routing_lwkvef8q/_index.md',
      },
    ],
  },
  'solutions/finops': {
    designs: [
      {
        label: 'AWS Cost Analysis',
        url: 'designs/aws_cost_analysis/_index.md',
      },
      {
        label: 'AWS Usage optimisation',
        url: 'designs/aws_usage_optimisation/_index.md',
      },
      {
        label: 'Azure Cost Allocation',
        url: 'designs/azure_cost_allocation/_index.md',
      },
      {
        label: 'Azure Usage Analysis',
        url: 'designs/azure_usage_analysis/_index.md',
      },
      {
        label: 'Azure Usage optimisation',
        url: 'designs/azure_usage_optimisation/_index.md',
      },
      {
        label: 'Maturity Model',
        url: 'designs/finops_maturity_model/_index.md',
      },
    ],
    knowledge: [
      {
        label: 'Airwalk Reply FinOps Review',
        url: 'knowledge/finops_10_review/_index.md',
      },
      {
        label: 'Review',
        url: 'knowledge/finops_11_interview/_index.md',
      },
      {
        label: 'Inform',
        url: 'knowledge/finops_12_inform/_index.md',
      },
      {
        label: 'Optimise',
        url: 'knowledge/finops_13_optimise/_index.md',
      },
      {
        label: 'Deliverable',
        url: 'knowledge/finops_14_deliverable/_index.md',
      },
      {
        label: 'Airwalk Reply FinOps Centre of Excellence',
        url: 'knowledge/finops_20_coe/_index.md',
      },
    ],
  },
  'solutions/cloud_networking': {
    designs: [
      {
        label: 'AWS Endpoint Service (PrivateLink)',
        url: 'designs/aws_endpoint_service_privatelink_ld2yt8og/_index.md',
      },
      {
        label: 'Azure Private Link Services',
        url: 'designs/azure_private_link_services_ldd7nuqc/_index.md',
      },
    ],
    knowledge: [
      {
        label: 'Networking 101',
        url: 'knowledge/networking_101/_index.md',
      },
    ],
  },
  'solutions/cloud_landing_zones': {
    designs: [
      {
        label: 'AWS Landing Zone',
        url: 'designs/aws_landing_zone_lo70o5w8/_index.md',
      },
      {
        label: 'Azure Landing Zone',
        url: 'designs/azure_landing_zone/_index.md',
      },
    ],
  },
  'solutions/secure_modern_workplace': {
    designs: [
      {
        label: 'Conditional Access',
        url: 'designs/conditional_access_lqgfqwth/_index.md',
      },
      {
        label: 'Microsoft 365 DSC',
        url: 'designs/microsoft_365_dsc_l7yx1xgu/_index.md',
      },
    ],
    knowledge: [
      {
        label: 'Data Loss Prevention Exemptions',
        url: 'knowledge/data_loss_prevention_exemptions/_index.mdx',
      },
    ],
  },
  'solutions/kubernetes': {
    designs: [
      {
        label: 'AWS Landing Zone - Elastic Kubernetes Service (EKS)',
        url: 'designs/elastic_kubernetes_service_eks_ljwysr3d/_index.md',
      },
      {
        label: 'High Level Design',
        url: 'designs/high_level_design_lczbvf99/_index.md',
      },
      {
        label: 'Istio Ambient Mesh',
        url: 'designs/istio_ambient_mesh_leemxsdx/_index.md',
      },
    ],
    knowledge: [
      {
        label: 'Kubernetes - Best Practices',
        url: 'knowledge/kubernetes_best_practices_lf7c7x42/_index.md',
      },
      {
        label: 'Kubernetes - Cluster Management',
        url: 'knowledge/kubernetes_cluster_management_ledebayy/_index.md',
      },
      {
        label: 'Kubernetes - OpenTelemetry',
        url: 'knowledge/kubernetes_observability_lgc1ih9h/_index.md',
      },
      {
        label: 'Kubernetes - Pod anti-affinity',
        url: 'knowledge/kubernetes_pod_antiaffinity_lgc7g3ji/_index.md',
      },
      {
        label: 'Kubernetes - Pod Disruption Budget',
        url: 'knowledge/kubernetes_pod_disruption_budget_lgc7chow/_index.md',
      },
      {
        label: 'Kubernetes - Pod Requests and Limits',
        url: 'knowledge/kubernetes_pod_requests_and_limits_lfqkh36r/_index.md',
      },
      {
        label: 'Kubernetes - Pod Resilience',
        url: 'knowledge/kubernetes_pod_resilience_lgc7wcqj/_index.md',
      },
      {
        label: 'Kubernetes - Pod Topology Spread Constraints',
        url: 'knowledge/kubernetes_pod_topology_spread_constraints_lgc7l5cv/_index.md',
      },
      {
        label: 'Kubernetes - Probes',
        url: 'knowledge/kubernetes_probes_lgc3czs4/_index.md',
      },
      {
        label: 'Kubernetes – Supporting Infrastructure',
        url: 'knowledge/kubernetes_supporting_infrastructure_lbv02dwp/_index.md',
      },
      {
        label: 'Kubernetes - Troubleshooting',
        url: 'knowledge/kubernetes_troubleshooting_ldlwdxvq/_index.md',
      },
      {
        label: 'Kubernetes – When not to use it, and when to use it',
        url: 'knowledge/kubernetes_when_not_to_use_it_and_when_to_use_it_lbuon1bg/_index.md',
      },
      {
        label: 'Kubernetes - Workload Identity',
        url: 'knowledge/kubernetes_workload_identity_lkscw333/_index.md',
      },
      {
        label: 'Toolkit',
        url: 'knowledge/toolkit_lbup226n/_index.md',
      },
      {
        label: 'Training',
        url: 'knowledge/training_lbupaajj/_index.md',
      },
    ],
  },
  'solutions/devsecops': {
    designs: [
      {
        label: 'Github Codespaces',
        url: 'designs/github_codespaces/_index.md',
      },
    ],
    knowledge: [
      {
        label: 'AWS IAM Best Practices',
        url: 'knowledge/aws_iam_best_practices_li4gl0q8/_index.md',
      },
      {
        label: 'AWS IAM for CI/CD',
        url: 'knowledge/aws_iam_for_cicd_lj4jdslo/_index.md',
      },
      {
        label: 'Azure IAM Best Practices',
        url: 'knowledge/azure_iam_best_practices_li4gm1gv/_index.md',
      },
      {
        label: 'Cloud Security Maturity Model',
        url: 'knowledge/cloud_security_maturity_model_likalgxf/_index.md',
      },
      {
        label: 'IaC Code Review',
        url: 'knowledge/code_review_li5t4xvr/_index.md',
      },
      {
        label: 'IaC Deployment Workflow',
        url: 'knowledge/deployment_workflow_lhynwyip/_index.md',
      },
      {
        label: 'DevSecOps Maturity Model',
        url: 'knowledge/devsecops_maturity_model_likahfqe/_index.md',
      },
      {
        label: 'IaC Environment Strategy',
        url: 'knowledge/environment_strategy_lhynw9dp/_index.md',
      },
      {
        label: 'Github Best Practices',
        url: 'knowledge/github_best_practices/_index.md',
      },
      {
        label: 'IaC Image Factory',
        url: 'knowledge/iac_image_factory_lj8ksd5k/_index.md',
      },
      {
        label: 'IaC Branching Strategy',
        url: 'knowledge/infrastructure_as_code_lhynoxvg/_index.md',
      },
      {
        label: 'IaC Terraform AWS Backend State',
        url: 'knowledge/terraform_aws_backend_state_li2zif10/_index.md',
      },
      {
        label: 'IaC Terraform Azure Backend State',
        url: 'knowledge/terraform_azure_backend_state_li2zhudd/_index.md',
      },
      {
        label: 'Terraform Repository Structure',
        url: 'knowledge/terraform_repo_template/_index.md',
      },
      {
        label: 'Iac Terraform Style Guide',
        url: 'knowledge/terraform_style_guide/_index.md',
      },
      {
        label: 'Versioning Strategy',
        url: 'knowledge/versioning_and_release_lhz0d2me/_index.md',
      },
    ],
  },
  'products/airview_l6za3rlx': {
    knowledge: [
      {
        label: 'Airview AWS Deployment',
        url: 'knowledge/airview_aws_deployment_lb2krd20/_index.md',
      },
      {
        label: 'Airview Azure Deployment',
        url: 'knowledge/airview_azure_deployment/_index.md',
      },
      {
        label: 'Creating a Project in Airview',
        url: 'knowledge/airview_creating_a_project/_index.md',
      },
      {
        label: 'Convert Documents to Markdown',
        url: 'knowledge/convert_documents_to_markdown_lcypd4pf/_index.md',
      },
      {
        label: 'Creating Documentation in Airview',
        url: 'knowledge/creating_airview/_index.md',
      },
      {
        label: 'Creating Mermaid Diagrams',
        url: 'knowledge/creating_mermaid_diagrams_lbw5utwy/_index.md',
      },
      {
        label: 'Converting Drawio Diagrams',
        url: 'knowledge/drawio_conversion/_index.md',
      },
      {
        label: 'Editing Documents in Airview',
        url: 'knowledge/editing_airview/_index.md',
      },
      {
        label: 'GitFlow 101',
        url: 'knowledge/gitflow/_index.md',
      },
      {
        label: 'Writing and formatting syntax',
        url: 'knowledge/simple_markdown/_index.md',
      },
    ],
  },
  'solutions/testing_methodology_lina4sqi': {
    knowledge: [
      {
        label: 'BDD Testing with Pytest-BDD',
        url: 'knowledge/bdd_testing_with_pytestbdd_lina6avn/_index.md',
      },
      {
        label: 'Conducting Scaled Functional and Load Testing',
        url: 'knowledge/conducting_scaled_functional_and_load_testing_ljx1p8y0/_index.md',
      },
      {
        label: 'Incorporating Gherkin into the Requirements Capture Process',
        url: 'knowledge/incorporating_gherkin_into_the_requirements_capture_process_linacz8h/_index.md',
      },
    ],
  },
  'providers/microsoft_365': {
    knowledge: [
      {
        label: 'CIS CSC v8 Configuration Guide',
        url: 'knowledge/cis_csc_v8_configuration_guide_ldlg6ofn/_index.md',
      },
    ],
  },
  'solutions/event_streaming_lpikfmxl': {
    knowledge: [
      {
        label: 'CFK - Confluent Deployment',
        url: 'knowledge/confluent_deployment_lpilcby8/_index.md',
      },
      {
        label: 'CFK - Confluent K8s Services',
        url: 'knowledge/confluent_k8s_services_lpinrtaz/_index.md',
      },
      {
        label: 'CFK - AWS Subnet Tags',
        url: 'knowledge/event_streaming_aws_subnet_tags_lpio5k09/_index.md',
      },
      {
        label: 'CFK - Component Resources',
        url: 'knowledge/event_streaming_component_resources_lpioahar/_index.md',
      },
      {
        label: 'CFK - Confluent K8s CRDs',
        url: 'knowledge/event_streaming_confluent_k8s_crds_lpio3s6o/_index.md',
      },
      {
        label: 'CFK - Confluent Licensing',
        url: 'knowledge/event_streaming_confluent_licensing_lpioftba/_index.md',
      },
      {
        label: 'Event Streaming - Reference Architecture',
        url: 'knowledge/event_streaming_confluent_sample_reference_architecture_lpioi7oj/_index.md',
      },
      {
        label: 'CFK - Custom Image Registry',
        url: 'knowledge/event_streaming_custom_image_registry_lpio2b92/_index.md',
      },
      {
        label: 'CFK - Identity Management',
        url: 'knowledge/event_streaming_identity_management_lpio7ljh/_index.md',
      },
      {
        label: 'CFK - Ingress/Load Balancers',
        url: 'knowledge/event_streaming_ingressload_balancers_lpiobpxr/_index.md',
      },
      {
        label: 'CFK - Operator Architecture',
        url: 'knowledge/event_streaming_operator_architecture_lpio4kso/_index.md',
      },
      {
        label: 'CFK - RBAC',
        url: 'knowledge/event_streaming_rbac_lpio99aj/_index.md',
      },
      {
        label: 'CFK - Security',
        url: 'knowledge/event_streaming_security_lpio8fi9/_index.md',
      },
      {
        label: 'CFK - Storage',
        url: 'knowledge/event_streaming_storage_lpio6hut/_index.md',
      },
      {
        label: 'CFK - Namespace Restrictions',
        url: 'knowledge/namespace_restrictions_lpint2wn/_index.md',
      },
    ],
  },
  'solutions/service_management_l767f4w5': {
    knowledge: [
      {
        label: 'Event Streaming - Container Images',
        url: 'knowledge/event_streaming_container_images_lpiods6f/_index.md',
      },
      {
        label: 'Asset Management (Hardware)',
        url: 'knowledge/itil_asset_management_hw/_index.md',
      },
      {
        label: 'Asset Management (Software)',
        url: 'knowledge/itil_asset_management_sw/_index.md',
      },
      {
        label: 'Service Desk Function',
        url: 'knowledge/itil_service_desk_function_practice_guide/_index.md',
      },
    ],
  },
  'products/artificial_intelligence_coe': {
    knowledge: [
      {
        label: 'Generative AI Learning Pathway',
        url: 'knowledge/generative_ai_ltg8vmwl/_index.md',
      },
    ],
  },
  'services/azure_active_directory': {
    knowledge: [
      {
        label: 'Naming Conventions',
        url: 'knowledge/identity_naming_conventions/_index.md',
      },
      {
        label: 'User Creation Process',
        url: 'knowledge/o365-useraccounts/_index.md',
      },
    ],
  },
  'services/intune': {
    knowledge: [
      {
        label: 'Device Build and Prep',
        url: 'knowledge/intune-hp-build/_index.md',
      },
      {
        label: 'HP Connect',
        url: 'knowledge/intune-hp-connect/_index.md',
      },
      {
        label: 'Intune Autopilot',
        url: 'knowledge/intune_autopilot/_index.md',
      },
      {
        label: 'Intune Win32App Deployment',
        url: 'knowledge/intune_win32app_deployment/_index.md',
      },
    ],
  },
  'solutions/service_mesh_ledfva4y': {
    knowledge: [
      {
        label: 'Istio add-ons',
        url: 'knowledge/istio_addons_lee05haw/_index.md',
      },
      {
        label: 'Istio Ambient Mesh',
        url: 'knowledge/istio_ambient_mesh_leen0aj9/_index.md',
      },
      {
        label: 'Istio Configuration Guide',
        url: 'knowledge/istio_configuration_guide_ledytu5j/_index.md',
      },
      {
        label: 'Istio Installation Guide',
        url: 'knowledge/istio_installation_and_configuration_guide_ledfwtjv/_index.md',
      },
      {
        label: 'Istio Management',
        url: 'knowledge/istio_management_ledf4a89/_index.md',
      },
    ],
  },
  'services/kubernetes_ld03x76h': {
    knowledge: [
      {
        label: 'Kubernetes - Workload Identity',
        url: 'knowledge/kubernetes_workload_identity_lkscw333/_index.md',
      },
    ],
  },
  'solutions/presentations_as_code_lchkplso': {
    knowledge: [
      {
        label: 'Markdown Presentation Components',
        url: 'knowledge/markdown_presentation_components_lchkrf95/_index.md',
      },
    ],
  },
  'solutions/training_learning_and_development_ljgw4fux': {
    knowledge: [
      {
        label: 'Microsoft Enterprise Skills Initiative',
        url: 'knowledge/microsoft_enterprise_skills_initiative_ljfoonpu/_index.md',
      },
    ],
  },
  'services/teams': {
    knowledge: [
      {
        label: 'Teams Meeting Room',
        url: 'knowledge/teams_meetingroom/_index.md',
      },
    ],
  },
  'services/web_filtering': {
    knowledge: [
      {
        label: 'Device Groups & Tagging',
        url: 'knowledge/web_filtering_tagging/_index.md',
      },
    ],
  },
};

export const FullExample = Template.bind({});
FullExample.args = {
  content: fullContent,
  context: {
    file: 'solutions/cloud_architecture/_index.md',
    collections: ['knowledge', 'designs'],
    source: 'github',
    repo: 'repo1',
    owner: 'owner',
    branch: 'main',
    path: 'services',
    reference: 'service',
    menu: {
      component: 'FullHeaderMenu',
      collection: 'providers',
    },
  },
  loading: false,
};

const serviceContent = {
  services: {},
  'services/azure_sql_server': {
    chapters: [
      {
        label: 'Cost Optimisation',
        url: 'services/azure_sql_server/cost_optimisation.md',
      },
      {
        label: 'Cost Optimisation',
        url: 'services/azure_sql_server/cost_optimisation.md',
      },
      {
        label: 'Cost Optimisation',
        url: 'services/azure_sql_server/cost_optimisation.md',
      },
      {
        label: 'Cost Optimisation',
        url: 'services/azure_sql_server/cost_optimisation.md',
      },
      {
        label: 'Cost Optimisation',
        url: 'services/azure_sql_server/cost_optimisation.md',
      },
      {
        label: 'Cost Optimisation',
        url: 'services/azure_sql_server/cost_optimisation.md',
      },
      {
        label: 'Cost Optimisation',
        url: 'services/azure_sql_server/cost_optimisation.md',
      },
    ],
  },
  'services/aws_beanstalk': {
    chapters: [
      {
        label: 'Elastic Beanstalk',
        url: 'services/aws_beanstalk/terraform-aws-elastic-beanstalk.md',
      },
    ],
  },
  'services/aws_control_tower': {
    chapters: [
      {
        label: 'Risk',
        url: 'services/aws_control_tower/risk.md',
      },
    ],
  },
  'services/aws_dynamodb': {
    chapters: [
      {
        label: 'Risk',
        url: 'services/aws_dynamodb/risk.md',
      },
    ],
  },
  'services/aws_dynamodb/controls': {
    chapters: [
      {
        label: 'AWS DynamoDB',
        url: 'services/aws_dynamodb/controls/aws-dynamodb-security-pattern.md',
      },
      {
        label: 'Data Protection in Storage',
        url: 'services/aws_dynamodb/controls/data_at_rest.md',
      },
      {
        label: 'Data Protection in Transit',
        url: 'services/aws_dynamodb/controls/data_in_transit.md',
      },
      {
        label: 'Systems Development and Maintenance',
        url: 'services/aws_dynamodb/controls/development_and_maintenance.md',
      },
      {
        label: 'Event Logging',
        url: 'services/aws_dynamodb/controls/events.md',
      },
      {
        label: 'Identification, Authentication and Access Control',
        url: 'services/aws_dynamodb/controls/iam.md',
      },
      {
        label: 'Operational Monitoring',
        url: 'services/aws_dynamodb/controls/operational_monitoring.md',
      },
    ],
  },
  'services/aws_eks': {
    chapters: [
      {
        label: 'Risk',
        url: 'services/aws_eks/risk.md',
      },
    ],
    services: [
      {
        label: 'Ingress',
        url: 'services/ingress_ldaegppj/_index.md',
      },
    ],
  },
  'services/aws_s3/controls': {
    chapters: [
      {
        label: 'Data Protection in Storage',
        url: 'services/aws_s3/controls/data_at_rest.md',
      },
      {
        label: 'Data Protection in Transit',
        url: 'services/aws_s3/controls/data_in_transit.md',
      },
      {
        label: 'Systems Development and Maintenance',
        url: 'services/aws_s3/controls/development_and_maintenance.md',
      },
      {
        label: 'Event Logging',
        url: 'services/aws_s3/controls/events.md',
      },
      {
        label: 'Identification, Authentication and Access Control',
        url: 'services/aws_s3/controls/iam.md',
      },
      {
        label: 'Operational Monitoring',
        url: 'services/aws_s3/controls/operational_monitoring.md',
      },
      {
        label: 'Data Protection in Storage',
        url: 'services/aws_s3/controls/data_at_rest.md',
      },
      {
        label: 'Data Protection in Transit',
        url: 'services/aws_s3/controls/data_in_transit.md',
      },
      {
        label: 'Systems Development and Maintenance',
        url: 'services/aws_s3/controls/development_and_maintenance.md',
      },
      {
        label: 'Event Logging',
        url: 'services/aws_s3/controls/events.md',
      },
      {
        label: 'Identification, Authentication and Access Control',
        url: 'services/aws_s3/controls/iam.md',
      },
      {
        label: 'Operational Monitoring',
        url: 'services/aws_s3/controls/operational_monitoring.md',
      },
    ],
  },
  'services/aws_eks/controls': {
    chapters: [
      {
        label: 'Financial',
        url: 'services/aws_eks/controls/financial.md',
      },
    ],
  },
  'services/aws_networking': {
    chapters: [
      {
        label: 'VPC Design',
        url: 'services/aws_networking/vpc.md',
      },
    ],
  },
  'services/aws_s3': {
    chapters: [
      {
        label: 'AWS S3 Glacier',
        url: 'services/aws_s3/aws-s3-glacier-security-pattern.md',
      },
      {
        label: 'AWS S3',
        url: 'services/aws_s3/aws-s3-security-pattern.md',
      },
      {
        label: 'Risk',
        url: 'services/aws_s3/risk.md',
      },
    ],
  },
  'providers/aws_l70nt7y7': {
    services: [
      {
        label: 'AWS Beanstalk',
        url: 'services/aws_beanstalk/_index.md',
      },
      {
        label: 'Elastic Beanstalk',
        url: 'services/aws_beanstalk/terraform-aws-elastic-beanstalk.md',
      },
      {
        label: 'AWS CloudFront',
        url: 'services/aws_cloudfront/_index.md',
      },
      {
        label: 'AWS CloudTrail',
        url: 'services/aws_cloudtrail/_index.md',
      },
      {
        label: 'AWS CloudWatch',
        url: 'services/aws_cloudwatch/_index.md',
      },
      {
        label: 'AWS Control Tower',
        url: 'services/aws_control_tower/_index.md',
      },
      {
        label: 'AWS Cross Account Access',
        url: 'services/aws_cross_account_access/_index.md',
      },
      {
        label: 'AWS Direct Connect',
        url: 'services/aws_direct_connect/_index.md',
      },
      {
        label: 'AWS DynamoDB',
        url: 'services/aws_dynamodb/_index.md',
      },
      {
        label: 'AWS DynamoDB',
        url: 'services/aws_dynamodb/controls/aws-dynamodb-security-pattern.md',
      },
      {
        label: 'AWS EC2',
        url: 'services/aws_ec2_l70nuff2/_index.md',
      },
      {
        label: 'AWS ECR',
        url: 'services/aws_ecr/_index.md',
      },
      {
        label: 'AWS ECS',
        url: 'services/aws_ecs/_index.md',
      },
      {
        label: 'Amazon Elastic Kubernetes Service (EKS)',
        url: 'services/aws_eks/_index.md',
      },
      {
        label: 'AWS Glue',
        url: 'services/aws_glue/_index.md',
      },
      {
        label: 'AWS GuardDuty',
        url: 'services/aws_guardduty/_index.md',
      },
      {
        label: 'AWS IAM',
        url: 'services/aws_iam/_index.md',
      },
      {
        label: 'AWS Inspector',
        url: 'services/aws_inspector/_index.md',
      },
      {
        label: 'AWS Kinesis',
        url: 'services/aws_kinesis/_index.md',
      },
      {
        label: 'AWS KMS',
        url: 'services/aws_kms/_index.md',
      },
      {
        label: 'AWS Lambda',
        url: 'services/aws_lambda/_index.md',
      },
      {
        label: 'AWS Landing Zone Accelerator',
        url: 'services/aws_landing_zone_accelerator_liyo8rfz/_index.md',
      },
      {
        label: 'AWS Management Console and API inc. CLI',
        url: 'services/aws_management_console_and_api_inc_cli/_index.md',
      },
      {
        label: 'AWS Network Security Patterns',
        url: 'services/aws_networking/_index.md',
      },
      {
        label: 'AWS OIDC with GitHub Actions (openid)',
        url: 'services/aws_oidc_with_github_actions_openid_lhud0jjb/_index.md',
      },
      {
        label: 'AWS Organizations and Account',
        url: 'services/aws_organizations_and_account/_index.md',
      },
      {
        label: 'AWS RDS',
        url: 'services/aws_rds/_index.md',
      },
      {
        label: 'AWS Redshift',
        url: 'services/aws_redshift/_index.md',
      },
      {
        label: 'AWS Route53',
        url: 'services/aws_route53/_index.md',
      },
      {
        label: 'AWS S3',
        url: 'services/aws_s3/_index.md',
      },
      {
        label: 'AWS S3 Glacier',
        url: 'services/aws_s3/aws-s3-glacier-security-pattern.md',
      },
      {
        label: 'AWS S3',
        url: 'services/aws_s3/aws-s3-security-pattern.md',
      },
      {
        label: 'AWS Secret Manager',
        url: 'services/aws_secret_manager/_index.md',
      },
      {
        label: 'AWS SES',
        url: 'services/aws_ses/_index.md',
      },
      {
        label: 'AWS SNS',
        url: 'services/aws_sns/_index.md',
      },
      {
        label: 'AWS SQS',
        url: 'services/aws_sqs/_index.md',
      },
      {
        label: 'AWS SSO',
        url: 'services/aws_sso/_index.md',
      },
      {
        label: 'AWS VPC',
        url: 'services/aws_vpc/_index.md',
      },
      {
        label: 'AWS WAF and Shield',
        url: 'services/aws_waf_and_shield/_index.md',
      },
      {
        label: '<Product> Security Pattern - Template',
        url: 'services/product_security_pattern_template/_index.md',
      },
      {
        label: 'Security Pattern Status',
        url: 'services/security_pattern_status/_index.md',
      },
    ],
  },
  'providers/microsoft_365': {
    services: [
      {
        label: 'Azure Active Directory',
        url: 'services/azure_active_directory/_index.md',
      },
      {
        label: 'Microsoft 365 Defender',
        url: 'services/defender_for_o365/_index.md',
      },
      {
        label: 'Exchange Online',
        url: 'services/exchange_online/_index.md',
      },
      {
        label: 'Microsoft Intune',
        url: 'services/intune/_index.md',
      },
      {
        label: 'Microsoft PowerPlatform',
        url: 'services/m365_powerplatform/_index.md',
      },
      {
        label: 'M365 Runbook',
        url: 'services/m365_runbook/_index.md',
      },
      {
        label: 'OneDrive for Business',
        url: 'services/onedrive_for_business/_index.md',
      },
      {
        label: 'SharePoint Online',
        url: 'services/sharepoint_online/_index.md',
      },
      {
        label: 'Microsoft Teams',
        url: 'services/teams/_index.md',
      },
      {
        label: 'Microsoft 365 Web Filtering',
        url: 'services/web_filtering/_index.md',
      },
    ],
  },
  'providers/azure_l78ryc2t': {
    services: [
      {
        label: 'Security Controls - Azure AI Search',
        url: 'services/azure_ai_search/_index.mdx',
      },
      {
        label: 'Security Controls - Azure Kubernetes Service',
        url: 'services/azure_aks/_index.mdx',
      },
      {
        label: 'Security Controls - Azure API Management',
        url: 'services/azure_api_management/_index.mdx',
      },
      {
        label: 'Azure AD Application Proxy',
        url: 'services/azure_app_proxy/_index.md',
      },
      {
        label: 'Security Controls - Web App',
        url: 'services/azure_app_service/_index.mdx',
      },
      {
        label: 'Security Controls - App Service Environment',
        url: 'services/azure_app_service_environment/_index.mdx',
      },
      {
        label:
          'Security Controls - App Service plan, Linux plan, Workflow Standard, Elastic Premium',
        url: 'services/azure_app_service_plan/_index.mdx',
      },
      {
        label: 'Security Controls - Synapse Private Link Hub',
        url: 'services/azure_synapse_private_link_hub/_index.mdx',
      },
      {
        label: 'Security Controls - Virtual Machines',
        url: 'services/azure_virtual_machines/_index.mdx',
      },
      {
        label: 'Security Controls - Virtual Network',
        url: 'services/azure_virtual_network/_index.mdx',
      },
      {
        label: 'Security Controls - Azure Virtual Network Gateway',
        url: 'services/azure_virtual_network_gateway/_index.mdx',
      },
      {
        label: 'Security Controls - Virtual Machine Scale Sets',
        url: 'services/azure_vmss/_index.mdx',
      },
      {
        label: 'Azure PaaS SQL',
        url: 'services/paas_sql_leedf6q1/_index.md',
      },
    ],
  },
  'providers/kubernetes_ld3a5dnh': {
    services: [
      {
        label: 'cloud-controller-manager',
        url: 'services/cloudcontrollermanager_ld3akk8s/_index.md',
      },
      {
        label: 'Container runtime',
        url: 'services/container_runtime_ld3apdhd/_index.md',
      },
      {
        label: 'DNS',
        url: 'services/dns_ld3awqb4/_index.md',
      },
      {
        label: 'kube-apiserver',
        url: 'services/kubeapiserver_ld3ai4mk/_index.md',
      },
      {
        label: 'kube-controller-manager',
        url: 'services/kubecontrollermanager_ld3ajayp/_index.md',
      },
      {
        label: 'kubelet',
        url: 'services/kubelet_ld3aoeil/_index.md',
      },
      {
        label: 'kube-proxy',
        url: 'services/kubeproxy_ld3ap192/_index.md',
      },
      {
        label: 'kube-scheduler',
        url: 'services/kubescheduler_ld3aita5/_index.md',
      },
    ],
  },
};

export const SimpleChapters = Template.bind({});
SimpleChapters.args = {
  content: serviceContent,
  context: {
    source: 'github',
    repo: 'airwalk_patterns',
    owner: 'airwalk-digital',
    branch: 'main',
    path: 'services',
    reference: 'service',
    menu: {
      component: 'FullHeaderMenu',
      collection: 'providers',
    },
    collections: ['knowledge', 'designs'],
    file: 'services/aws_beanstalk/_index.md',
  },
  loading: false,
};
