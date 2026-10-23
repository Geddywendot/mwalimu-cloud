import type { Domain, Topic } from '../types'

// TODO(you): verify these against the CURRENT AZ-900 study guide on Microsoft Learn.
// Outlines are updated periodically. Weights are mid-points of the published ranges, normalised to sum to 1.
export const DOMAINS: Domain[] = [
  { id: 'cloud', title: 'Describe cloud concepts', weight: 0.28 },
  { id: 'architecture', title: 'Describe Azure architecture and services', weight: 0.38 },
  { id: 'governance', title: 'Describe Azure management and governance', weight: 0.34 },
]

export const TOPICS: Topic[] = [
  { id: 'cloud-basics', domainId: 'cloud', title: 'Cloud computing and shared responsibility', description: 'What the cloud is, and who secures what.' },
  { id: 'cloud-models', domainId: 'cloud', title: 'Public, private and hybrid cloud', description: 'Cloud deployment models and when to use each.' },
  { id: 'cloud-pricing', domainId: 'cloud', title: 'Consumption-based model', description: 'CapEx vs OpEx and pay-as-you-go.' },
  { id: 'cloud-benefits', domainId: 'cloud', title: 'Benefits of cloud services', description: 'High availability, scalability, elasticity, reliability, predictability, security, governance.' },
  { id: 'cloud-service-types', domainId: 'cloud', title: 'IaaS, PaaS, SaaS and serverless', description: 'Service types and how responsibility changes.' },

  { id: 'arch-regions', domainId: 'architecture', title: 'Regions, region pairs and availability zones', description: 'Physical layout of Azure and resilience.' },
  { id: 'arch-org', domainId: 'architecture', title: 'Resources, resource groups, subscriptions and management groups', description: 'How Azure resources are organised.' },
  { id: 'arch-compute', domainId: 'architecture', title: 'Compute services', description: 'Virtual machines, scale sets, containers, App Service, Functions, Azure Virtual Desktop.' },
  { id: 'arch-network', domainId: 'architecture', title: 'Networking services', description: 'Virtual networks, peering, VPN Gateway, ExpressRoute, DNS, endpoints.' },
  { id: 'arch-storage', domainId: 'architecture', title: 'Storage services', description: 'Storage accounts, redundancy, access tiers, Blob, Files, Disks, migration tools.' },
  { id: 'arch-identity', domainId: 'architecture', title: 'Identity, access and security', description: 'Microsoft Entra ID, MFA, Conditional Access, RBAC, Zero Trust, defence in depth.' },

  { id: 'gov-cost', domainId: 'governance', title: 'Cost management', description: 'Cost factors, Pricing and TCO calculators, Cost Management, tags.' },
  { id: 'gov-governance', domainId: 'governance', title: 'Governance and compliance', description: 'Microsoft Purview, Azure Policy, resource locks, Service Trust Portal.' },
  { id: 'gov-tools', domainId: 'governance', title: 'Tools to manage Azure', description: 'Portal, Cloud Shell, CLI, PowerShell, Azure Arc, infrastructure as code, ARM templates.' },
  { id: 'gov-monitor', domainId: 'governance', title: 'Monitoring tools', description: 'Azure Advisor, Service Health, Azure Monitor, Log Analytics, alerts, Application Insights.' },
]

export const topicById = (id: string) => TOPICS.find((t) => t.id === id)
export const topicsInDomain = (domainId: string) => TOPICS.filter((t) => t.domainId === domainId)
