-- Keep in sync with src/data/topics.ts
insert into public.topics (id, domain, title, description, sort_order) values
('cloud-basics','cloud','Cloud computing and shared responsibility','What the cloud is, and who secures what.',1),
('cloud-models','cloud','Public, private and hybrid cloud','Cloud deployment models and when to use each.',2),
('cloud-pricing','cloud','Consumption-based model','CapEx vs OpEx and pay-as-you-go.',3),
('cloud-benefits','cloud','Benefits of cloud services','High availability, scalability, elasticity, reliability, predictability, security, governance.',4),
('cloud-service-types','cloud','IaaS, PaaS, SaaS and serverless','Service types and how responsibility changes.',5),
('arch-regions','architecture','Regions, region pairs and availability zones','Physical layout of Azure and resilience.',6),
('arch-org','architecture','Resources, resource groups, subscriptions and management groups','How Azure resources are organised.',7),
('arch-compute','architecture','Compute services','Virtual machines, scale sets, containers, App Service, Functions, Azure Virtual Desktop.',8),
('arch-network','architecture','Networking services','Virtual networks, peering, VPN Gateway, ExpressRoute, DNS, endpoints.',9),
('arch-storage','architecture','Storage services','Storage accounts, redundancy, access tiers, Blob, Files, Disks, migration tools.',10),
('arch-identity','architecture','Identity, access and security','Microsoft Entra ID, MFA, Conditional Access, RBAC, Zero Trust, defence in depth.',11),
('gov-cost','governance','Cost management','Cost factors, Pricing and TCO calculators, Cost Management, tags.',12),
('gov-governance','governance','Governance and compliance','Microsoft Purview, Azure Policy, resource locks, Service Trust Portal.',13),
('gov-tools','governance','Tools to manage Azure','Portal, Cloud Shell, CLI, PowerShell, Azure Arc, infrastructure as code, ARM templates.',14),
('gov-monitor','governance','Monitoring tools','Azure Advisor, Service Health, Azure Monitor, Log Analytics, alerts, Application Insights.',15)
on conflict (id) do update set title = excluded.title, description = excluded.description, sort_order = excluded.sort_order;
