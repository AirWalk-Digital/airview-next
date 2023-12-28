import React from "react";

import { FullHeaderMenu } from "@/components/menus";



// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Menus/FullHeaderMenu",
  component: FullHeaderMenu,
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

const menu = [
    {
      "label": "AWS",
      "url": "/providers/aws_l70nt7y7/_index.md",
      "children": {
        "services": [
          {
            "label": "AWS Account Factory for Terraform",
            "url": "/services/aws_aft/_index.md"
          },
          {
            "label": "AWS Beanstalk",
            "url": "/services/aws_beanstalk/_index.md"
          },
          {
            "label": "Elastic Beanstalk",
            "url": "/services/aws_beanstalk/terraform-aws-elastic-beanstalk.md"
          },
          {
            "label": "AWS CloudFront",
            "url": "/services/aws_cloudfront/_index.md"
          },
          {
            "label": "AWS CloudTrail",
            "url": "/services/aws_cloudtrail/_index.md"
          },
          {
            "label": "AWS CloudWatch",
            "url": "/services/aws_cloudwatch/_index.md"
          },
          {
            "label": "AWS Control Tower",
            "url": "/services/aws_control_tower/_index.md"
          },
          {
            "label": "AWS Cross Account Access",
            "url": "/services/aws_cross_account_access/_index.md"
          },
          {
            "label": "AWS Direct Connect",
            "url": "/services/aws_direct_connect/_index.md"
          },
          {
            "label": "AWS DynamoDB",
            "url": "/services/aws_dynamodb/_index.md"
          },
          {
            "label": "AWS DynamoDB",
            "url": "/services/aws_dynamodb/controls/aws-dynamodb-security-pattern.md"
          },
          {
            "label": "AWS EC2",
            "url": "/services/aws_ec2_l70nuff2/_index.md"
          },
          {
            "label": "AWS ECR",
            "url": "/services/aws_ecr/_index.md"
          },
          {
            "label": "AWS ECS",
            "url": "/services/aws_ecs/_index.md"
          },
          {
            "label": "Amazon Elastic Kubernetes Service (EKS)",
            "url": "/services/aws_eks/_index.md"
          },
          {
            "label": "AWS Glue",
            "url": "/services/aws_glue/_index.md"
          },
          {
            "label": "AWS GuardDuty",
            "url": "/services/aws_guardduty/_index.md"
          },
          {
            "label": "AWS IAM",
            "url": "/services/aws_iam/_index.md"
          },
          {
            "label": "AWS Inspector",
            "url": "/services/aws_inspector/_index.md"
          },
          {
            "label": "AWS Kinesis",
            "url": "/services/aws_kinesis/_index.md"
          },
          {
            "label": "AWS KMS",
            "url": "/services/aws_kms/_index.md"
          },
          {
            "label": "AWS Lambda",
            "url": "/services/aws_lambda/_index.md"
          },
          {
            "label": "AWS Landing Zone Accelerator",
            "url": "/services/aws_landing_zone_accelerator_liyo8rfz/_index.md"
          },
          {
            "label": "AWS Management Console and API inc. CLI",
            "url": "/services/aws_management_console_and_api_inc_cli/_index.md"
          },
          {
            "label": "AWS Network Security Patterns",
            "url": "/services/aws_networking/_index.md"
          },
          {
            "label": "AWS OIDC with GitHub Actions (openid)",
            "url": "/services/aws_oidc_with_github_actions_openid_lhud0jjb/_index.md"
          },
          {
            "label": "AWS Organizations and Account",
            "url": "/services/aws_organizations_and_account/_index.md"
          },
          {
            "label": "AWS RDS",
            "url": "/services/aws_rds/_index.md"
          },
          {
            "label": "AWS Redshift",
            "url": "/services/aws_redshift/_index.md"
          },
          {
            "label": "AWS Route53",
            "url": "/services/aws_route53/_index.md"
          },
          {
            "label": "AWS S3",
            "url": "/services/aws_s3/_index.md"
          },
          {
            "label": "AWS S3 Glacier",
            "url": "/services/aws_s3/aws-s3-glacier-security-pattern.md"
          },
          {
            "label": "AWS S3",
            "url": "/services/aws_s3/aws-s3-security-pattern.md"
          },
          {
            "label": "AWS Secret Manager",
            "url": "/services/aws_secret_manager/_index.md"
          },
          {
            "label": "AWS SES",
            "url": "/services/aws_ses/_index.md"
          },
          {
            "label": "AWS SNS",
            "url": "/services/aws_sns/_index.md"
          },
          {
            "label": "AWS SQS",
            "url": "/services/aws_sqs/_index.md"
          },
          {
            "label": "AWS SSO",
            "url": "/services/aws_sso/_index.md"
          },
          {
            "label": "AWS VPC",
            "url": "/services/aws_vpc/_index.md"
          },
          {
            "label": "AWS WAF and Shield",
            "url": "/services/aws_waf_and_shield/_index.md"
          },
          {
            "label": "<Product> Security Pattern - Template",
            "url": "/services/product_security_pattern_template/_index.md"
          },
          {
            "label": "Security Pattern Status",
            "url": "/services/security_pattern_status/_index.md"
          }
        ]
      }
    },
    {
      "label": "Azure",
      "url": "/providers/azure_l78ryc2t/_index.md",
      "children": {
        "services": [
          {
            "label": "Security Controls - Azure Kubernetes Service",
            "url": "/services/azure_aks/_index.mdx"
          },
          {
            "label": "Azure AD Application Proxy",
            "url": "/services/azure_app_proxy/_index.md"
          },
          {
            "label": "Security Controls - App Service plan, Linux plan",
            "url": "/services/azure_app_service_plan/_index.mdx"
          },
          {
            "label": "Application Gateway",
            "url": "/services/azure_application_gateway/_index.mdx"
          },
          {
            "label": "Security Controls - Application Security Groups",
            "url": "/services/azure_application_security_group/_index.mdx"
          },
          {
            "label": "Security Controls - Availability sets",
            "url": "/services/azure_availability_sets/_index.mdx"
          },
          {
            "label": "Security Controls - Azure Bastion",
            "url": "/services/azure_bastion/_index.mdx"
          },
          {
            "label": "Security Controls - Cache for Redis",
            "url": "/services/azure_cache_redis/_index.mdx"
          },
          {
            "label": "Security Controls - Common Security Controls",
            "url": "/services/azure_common_security_controls/_index.mdx"
          },
          {
            "label": "Security Controls - Communication Services",
            "url": "/services/azure_communication_services/_index.mdx"
          },
          {
            "label": "Security Controls - Container Instances",
            "url": "/services/azure_container_instance/_index.mdx"
          },
          {
            "label": "Security Controls - Azure Container Registry",
            "url": "/services/azure_container_registry/_index.mdx"
          },
          {
            "label": "Security Controls - Azure Cosmosdb NoSQL",
            "url": "/services/azure_cosmosdb_nosql/_index.mdx"
          },
          {
            "label": "Security Controls - Data Factory",
            "url": "/services/azure_data_factory/_index.mdx"
          },
          {
            "label": "Security Controls - Defender for Cloud",
            "url": "/services/azure_defender_cloud/_index.mdx"
          },
          {
            "label": "Security Controls - Disk Encryption Set",
            "url": "/services/azure_disk_encryption/_index.mdx"
          },
          {
            "label": "Azure DNS Private Resolver",
            "url": "/services/azure_dns_private_resolver/_index.md"
          },
          {
            "label": "Security Controls - Private DNS Resolver",
            "url": "/services/azure_dns_resolvers/_index.mdx"
          },
          {
            "label": "Security Controls - Event Hubs",
            "url": "/services/azure_event_hubs/_index.mdx"
          },
          {
            "label": "Security Controls - Azure ExpressRoute Circuits",
            "url": "/services/azure_expressroute_circuits/_index.mdx"
          },
          {
            "label": "Security Controls - Azure Firewall",
            "url": "/services/azure_firewall/_index.mdx"
          },
          {
            "label": "Security Controls - Azure Front Door",
            "url": "/services/azure_front_door/_index.mdx"
          },
          {
            "label": "Security Controls - Azure Function App",
            "url": "/services/azure_function_app/_index.mdx"
          },
          {
            "label": "Security Controls - Key Vault",
            "url": "/services/azure_key_vault/_index.mdx"
          },
          {
            "label": "Azure Kubernetes Service",
            "url": "/services/azure_kubernetes/_index.md"
          },
          {
            "label": "Security Controls - Azure Load Balancer",
            "url": "/services/azure_load_balancer/_index.mdx"
          },
          {
            "label": "Security Controls - Log Analytics Workspace",
            "url": "/services/azure_log_analytics_workspace/_index.mdx"
          },
          {
            "label": "Azure Machine Learning",
            "url": "/services/azure_machine_learning_lfmqfh02/_index.md"
          },
          {
            "label": "Security Controls - Managed Disks",
            "url": "/services/azure_managed_disk/_index.mdx"
          },
          {
            "label": "Azure Managed Identities",
            "url": "/services/azure_managed_identities/_index.md"
          },
          {
            "label": "Security Controls - Managed Identity",
            "url": "/services/azure_managed_identity/_index.mdx"
          },
          {
            "label": "Security Controls - Management Groups",
            "url": "/services/azure_management_groups/_index.mdx"
          },
          {
            "label": "Security Controls - NAT Gateway",
            "url": "/services/azure_nat_gateway/_index.mdx"
          },
          {
            "label": "Security Controls - Network Watcher",
            "url": "/services/azure_network_watcher/_index.mdx"
          },
          {
            "label": "Azure Network Design Patterns",
            "url": "/services/azure_networking/_index.md"
          },
          {
            "label": "Security Controls - Azure Database for PostgreSQL - Flexible Server",
            "url": "/services/azure_pgsql_flex/_index.mdx"
          },
          {
            "label": "Security Controls - Private DNS Zones",
            "url": "/services/azure_private_dns_zones/_index.mdx"
          },
          {
            "label": "Security Controls - Private Endpoint",
            "url": "/services/azure_private_endpoint/_index.mdx"
          },
          {
            "label": "Azure Private Link",
            "url": "/services/azure_private_link/_index.md"
          },
          {
            "label": "Security Controls - Proximity placement groups",
            "url": "/services/azure_proximity_placement_groups/_index.mdx"
          },
          {
            "label": "Security Controls - Azure Public DNS Zones",
            "url": "/services/azure_public_dns_zones/_index.mdx"
          },
          {
            "label": "Security Controls - Public IP Prefixes",
            "url": "/services/azure_public_ip/_index.mdx"
          },
          {
            "label": "Security Controls - Public IP Addresses",
            "url": "/services/azure_public_ipaddresses/_index.mdx"
          },
          {
            "label": "Security Controls - SQL Database",
            "url": "/services/azure_sql_db/_index.mdx"
          },
          {
            "label": "Security Controls - SQL Server",
            "url": "/services/azure_sql_server/_index.mdx"
          },
          {
            "label": "Security Controls - Storage Account",
            "url": "/services/azure_storage_account/_index.mdx"
          },
          {
            "label": "Security Controls - Stream Analytics",
            "url": "/services/azure_stream_analytics/_index.mdx"
          },
          {
            "label": "Security Controls - Subscriptions",
            "url": "/services/azure_subscriptions/_index.mdx"
          },
          {
            "label": "Security Controls - Synapse Analytics",
            "url": "/services/azure_synapse_analytics/_index.mdx"
          },
          {
            "label": "Security Controls - Synapse Private Link Hub",
            "url": "/services/azure_synapse_private_link_hub/_index.mdx"
          },
          {
            "label": "Security Controls - Virtual Machines",
            "url": "/services/azure_virtual_machines/_index.mdx"
          },
          {
            "label": "Security Controls - Virtual Network",
            "url": "/services/azure_virtual_network/_index.mdx"
          },
          {
            "label": "Security Controls - Azure Virtual Network Gateway",
            "url": "/services/azure_virtual_network_gateway/_index.mdx"
          },
          {
            "label": "Security Controls - Virtual Machine Scale Sets",
            "url": "/services/azure_vmss/_index.mdx"
          },
          {
            "label": "Azure PaaS SQL",
            "url": "/services/paas_sql_leedf6q1/_index.md"
          }
        ]
      }
    },
    {
      "label": "Kubernetes",
      "url": "/providers/kubernetes_ld3a5dnh/_index.md",
      "children": {
        "services": [
          {
            "label": "cloud-controller-manager",
            "url": "/services/cloudcontrollermanager_ld3akk8s/_index.md"
          },
          {
            "label": "Container runtime",
            "url": "/services/container_runtime_ld3apdhd/_index.md"
          },
          {
            "label": "DNS",
            "url": "/services/dns_ld3awqb4/_index.md"
          },
          {
            "label": "kube-apiserver",
            "url": "/services/kubeapiserver_ld3ai4mk/_index.md"
          },
          {
            "label": "kube-controller-manager",
            "url": "/services/kubecontrollermanager_ld3ajayp/_index.md"
          },
          {
            "label": "kubelet",
            "url": "/services/kubelet_ld3aoeil/_index.md"
          },
          {
            "label": "kube-proxy",
            "url": "/services/kubeproxy_ld3ap192/_index.md"
          },
          {
            "label": "kube-scheduler",
            "url": "/services/kubescheduler_ld3aita5/_index.md"
          }
        ]
      }
    },
    {
      "label": "Microsoft 365",
      "url": "/providers/microsoft_365/_index.md",
      "children": {
        "services": [
          {
            "label": "Azure Active Directory",
            "url": "/services/azure_active_directory/_index.md"
          },
          {
            "label": "Microsoft 365 Defender",
            "url": "/services/defender_for_o365/_index.md"
          },
          {
            "label": "Exchange Online",
            "url": "/services/exchange_online/_index.md"
          },
          {
            "label": "Microsoft Intune",
            "url": "/services/intune/_index.md"
          },
          {
            "label": "Microsoft PowerPlatform",
            "url": "/services/m365_powerplatform/_index.md"
          },
          {
            "label": "M365 Runbook",
            "url": "/services/m365_runbook/_index.md"
          },
          {
            "label": "OneDrive for Business",
            "url": "/services/onedrive_for_business/_index.md"
          },
          {
            "label": "SharePoint Online",
            "url": "/services/sharepoint_online/_index.md"
          },
          {
            "label": "Microsoft Teams",
            "url": "/services/teams/_index.md"
          },
          {
            "label": "Microsoft 365 Web Filtering",
            "url": "/services/web_filtering/_index.md"
          }
        ],
        "knowledge": [
          {
            "label": "CIS CSC v8 Configuration Guide",
            "url": "/knowledge/cis_csc_v8_configuration_guide_ldlg6ofn/_index.md"
          }
        ]
      }
    }
  ]


function dummyFunction() {}

export const Simple = {
  args: {
    open: true,
    top: 0,
    drawerWidth: 300,
    menu: menu
  },
};


