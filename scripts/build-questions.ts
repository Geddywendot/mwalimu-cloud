import fs from 'node:fs'
import path from 'node:path'
import type { Question } from '../src/types'

const questions: Question[] = [
  // ==========================================
  // TOPIC 1: cloud-basics (8 questions)
  // ==========================================
  {
    id: 'cloud-basics-001',
    topic_id: 'cloud-basics',
    type: 'single',
    difficulty: 'easy',
    question: 'Under the shared responsibility model, which security responsibility always remains strictly with the customer across all cloud models (IaaS, PaaS, and SaaS)?',
    options: [
      { id: 'A', text: 'Physical datacenter facilities and server hardware' },
      { id: 'B', text: 'Information and data governance, and access credentials' },
      { id: 'C', text: 'Operating system updates and security patches' },
      { id: 'D', text: 'Network hardware switches and routers' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'Customer information, data classification, and user access credentials always remain 100% the responsibility of the customer across all cloud models, including SaaS.',
    explanation_wrong: {
      'A': 'Physical datacenters and server hardware are always 100% managed by Microsoft in public cloud.',
      'C': 'Operating system patching is managed by Microsoft in PaaS and SaaS, and by the customer only in IaaS.',
      'D': 'Network hardware switches and routers in the cloud infrastructure are maintained entirely by Microsoft.'
    }
  },
  {
    id: 'cloud-basics-002',
    topic_id: 'cloud-basics',
    type: 'true_false',
    difficulty: 'easy',
    question: 'In a public cloud deployment, Microsoft shares physical security duties of the datacenter building with the customer.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'False. In a public cloud, physical datacenter security, perimeter fences, biometric doors, and camera surveillance are exclusively the responsibility of Microsoft.',
    explanation_wrong: {
      'A': 'Customers have no physical access to Microsoft datacenters and bear zero responsibility for physical building facilities.'
    }
  },
  {
    id: 'cloud-basics-003',
    topic_id: 'cloud-basics',
    type: 'multiple',
    difficulty: 'medium',
    question: 'When a company deploys an Azure Virtual Machine (IaaS), which TWO operational duties fall directly on the customer?',
    options: [
      { id: 'A', text: 'Maintaining datacenter power generators and cooling units' },
      { id: 'B', text: 'Applying security patches to the guest operating system' },
      { id: 'C', text: 'Replacing failed physical memory modules and hard drives' },
      { id: 'D', text: 'Configuring network security group firewall rules on the VM' }
    ],
    correct_option_ids: ['B', 'D'],
    explanation_correct: 'In IaaS, the customer manages the guest operating system (including OS security updates) and software configurations like network security groups.',
    explanation_wrong: {
      'A': 'Power generators and facility climate control are physical infrastructure managed entirely by Microsoft.',
      'C': 'Physical RAM and hard drive hardware failures are remediated by Microsoft datacenter technicians without customer intervention.'
    }
  },
  {
    id: 'cloud-basics-004',
    topic_id: 'cloud-basics',
    type: 'single',
    difficulty: 'medium',
    question: 'A development team deploys a custom web application on Azure App Service (PaaS). Who is responsible for patching the underlying operating system?',
    options: [
      { id: 'A', text: 'The customer system administrators' },
      { id: 'B', text: 'The third-party network internet service provider' },
      { id: 'C', text: 'Microsoft' },
      { id: 'D', text: 'Shared equally through monthly manual customer approvals' }
    ],
    correct_option_ids: ['C'],
    explanation_correct: 'In Platform as a Service (PaaS), Microsoft automatically patches, secures, and maintains the underlying operating system and web server runtimes.',
    explanation_wrong: {
      'A': 'Customer system administrators do not manage or configure operating system patches in PaaS offerings like App Service.',
      'B': 'Internet service providers only supply internet bandwidth and have no access to Azure server runtimes.',
      'D': 'Operating system patching in PaaS is fully automated by Microsoft without requiring manual customer approval workflows.'
    }
  },
  {
    id: 'cloud-basics-005',
    topic_id: 'cloud-basics',
    type: 'single',
    difficulty: 'medium',
    question: 'An enterprise migrates its corporate email to Microsoft 365 (SaaS). What is the primary operational task the company still owns?',
    options: [
      { id: 'A', text: 'Managing user identities, permissions, and mailbox data' },
      { id: 'B', text: 'Updating email server application binaries' },
      { id: 'C', text: 'Patching Windows Server on the Exchange host machines' },
      { id: 'D', text: 'Replacing faulty network cables in Microsoft datacenters' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'In SaaS, the customer retains full responsibility for managing user accounts, access permissions, identity policies, and protecting their own data.',
    explanation_wrong: {
      'B': 'Application binaries and feature releases are maintained and deployed solely by Microsoft in SaaS.',
      'C': 'The underlying Windows Server OS on Exchange hosts is managed entirely by Microsoft.',
      'D': 'Physical cabling and hardware maintenance in datacenters are completely handled by Microsoft.'
    }
  },
  {
    id: 'cloud-basics-006',
    topic_id: 'cloud-basics',
    type: 'single',
    difficulty: 'hard',
    question: 'Why does security of endpoint devices (such as laptops and smartphones connecting to Azure) always rest with the customer rather than Microsoft?',
    options: [
      { id: 'A', text: 'Because Azure does not support secure internet protocols' },
      { id: 'B', text: 'Because Microsoft only supports desktop computers running Windows 11' },
      { id: 'C', text: 'Because endpoint devices are physically owned by cloud providers' },
      { id: 'D', text: 'Because Microsoft has no physical or administrative control over user client devices' }
    ],
    correct_option_ids: ['D'],
    explanation_correct: 'Microsoft has no control over customer client hardware. Securing employee laptops and mobile phones with endpoint protection, disk encryption, and strong passcodes is strictly the customer\'s responsibility.',
    explanation_wrong: {
      'A': 'Azure natively enforces industry-standard TLS encryption protocols across all client connections.',
      'B': 'Azure supports multiple client platforms including macOS, Linux, iOS, Android, and Windows.',
      'C': 'Endpoint client devices are owned by the customer or employee, not the cloud provider.'
    }
  },
  {
    id: 'cloud-basics-007',
    topic_id: 'cloud-basics',
    type: 'true_false',
    difficulty: 'easy',
    question: 'In an on-premises private datacenter, the shared responsibility model divides duties equally between Microsoft and your internal IT team.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'False. In a traditional on-premises datacenter, there is no shared responsibility; the customer is 100% responsible for every layer from physical facilities to data.',
    explanation_wrong: {
      'A': 'Microsoft owns zero operational responsibilities in an on-premises datacenter unless Azure Arc or specific managed hardware appliances are deployed.'
    }
  },
  {
    id: 'cloud-basics-008',
    topic_id: 'cloud-basics',
    type: 'multiple',
    difficulty: 'hard',
    question: 'Which TWO elements represent areas where customer and provider responsibilities typically vary or overlap depending on the cloud service model selected?',
    options: [
      { id: 'A', text: 'Operating system installation and patching' },
      { id: 'B', text: 'Physical datacenter perimeter security' },
      { id: 'C', text: 'Network controls and firewall configurations' },
      { id: 'D', text: 'Customer data classification and access rights' }
    ],
    correct_option_ids: ['A', 'C'],
    explanation_correct: 'Operating systems and network controls vary by model: customer manages them in IaaS, while Microsoft takes on increasing management in PaaS and SaaS.',
    explanation_wrong: {
      'B': 'Physical security never varies; it is always 100% Microsoft\'s duty in public cloud.',
      'D': 'Data classification and access rights never vary; they are always 100% the customer\'s duty.'
    }
  },

  // ==========================================
  // TOPIC 2: cloud-models (8 questions)
  // ==========================================
  {
    id: 'cloud-models-001',
    topic_id: 'cloud-models',
    type: 'single',
    difficulty: 'easy',
    question: 'Which cloud deployment model provides computing resources owned and operated by a third-party provider and shared securely among multiple organizations over the public internet?',
    options: [
      { id: 'A', text: 'Private cloud' },
      { id: 'B', text: 'Internal cloud' },
      { id: 'C', text: 'Public cloud' },
      { id: 'D', text: 'Isolated edge cloud' }
    ],
    correct_option_ids: ['C'],
    explanation_correct: 'Public cloud delivers shared computing resources owned and managed by a cloud provider like Microsoft, accessible securely over the internet.',
    explanation_wrong: {
      'A': 'Private cloud infrastructure is dedicated exclusively to a single organization.',
      'B': 'Internal cloud is another term for private on-premises cloud hosting.',
      'D': 'Isolated edge cloud refers to localized edge appliances running disconnected workloads.'
    }
  },
  {
    id: 'cloud-models-002',
    topic_id: 'cloud-models',
    type: 'single',
    difficulty: 'medium',
    question: 'What is a defining financial and operational characteristic of a private cloud deployment model?',
    options: [
      { id: 'A', text: 'Zero initial capital investment in hardware servers' },
      { id: 'B', text: 'The organization has total control over physical hardware and security configuration' },
      { id: 'C', text: 'Microsoft automatically maintains and replaces physical disk drives' },
      { id: 'D', text: 'Billing is automatically calculated per second of compute execution' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'Private cloud grants the organization complete control over physical hardware, architecture, isolation, and security compliance.',
    explanation_wrong: {
      'A': 'Private clouds require substantial initial capital investment (CapEx) to purchase physical servers and storage.',
      'C': 'In a private cloud, the organization\'s staff must maintain and replace failed physical components.',
      'D': 'Per-second consumption billing is characteristic of public cloud services, not self-hosted private clouds.'
    }
  },
  {
    id: 'cloud-models-003',
    topic_id: 'cloud-models',
    type: 'single',
    difficulty: 'medium',
    question: 'A commercial bank must retain core financial transaction ledgers on physical on-premises servers to satisfy banking regulations, but wants to host its mobile banking web frontend on Azure to handle traffic spikes. Which cloud deployment model meets these requirements?',
    options: [
      { id: 'A', text: 'Hybrid cloud' },
      { id: 'B', text: 'Public cloud exclusively' },
      { id: 'C', text: 'Community cloud only' },
      { id: 'D', text: 'Private cloud exclusively' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'Hybrid cloud combines on-premises private infrastructure with public cloud resources, allowing data and services to be shared securely between them.',
    explanation_wrong: {
      'B': 'Public cloud alone would violate the regulatory requirement to keep transaction ledgers on on-premises physical servers.',
      'C': 'Community cloud is shared among organizations with common compliance interests and does not describe linking private on-premises with public Azure.',
      'D': 'Private cloud alone would prevent the bank from leveraging Azure\'s elastic public cloud capacity for web traffic spikes.'
    }
  },
  {
    id: 'cloud-models-004',
    topic_id: 'cloud-models',
    type: 'multiple',
    difficulty: 'hard',
    question: 'Which TWO statements correctly describe advantages of public cloud over private cloud deployments?',
    options: [
      { id: 'A', text: 'Organizations gain direct physical access to inspect server motherboards' },
      { id: 'B', text: 'Organizations can scale resources globally without purchasing additional physical hardware' },
      { id: 'C', text: 'Upfront capital expenditure on hardware and datacenters is eliminated' },
      { id: 'D', text: 'Legacy operating systems that violate modern security standards receive automatic custom hardware waivers' }
    ],
    correct_option_ids: ['B', 'C'],
    explanation_correct: 'Public cloud eliminates upfront capital expenditure (CapEx) and enables rapid global scaling without acquiring physical datacenter real estate.',
    explanation_wrong: {
      'A': 'Public cloud providers strictly prohibit customer physical access to datacenter floors for security reasons.',
      'D': 'Public cloud providers enforce strict virtualization and platform standards and do not grant physical hardware waivers for legacy OSes.'
    }
  },
  {
    id: 'cloud-models-005',
    topic_id: 'cloud-models',
    type: 'true_false',
    difficulty: 'easy',
    question: 'Deploying workloads to a public cloud requires an organization to purchase server racks and datacenter real estate as capital expenditure.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'False. Public cloud operates on an operational expenditure (OpEx) model where the cloud provider owns the physical buildings and servers.',
    explanation_wrong: {
      'A': 'Purchasing server racks and physical datacenter real estate is required for private clouds, not public cloud.'
    }
  },
  {
    id: 'cloud-models-006',
    topic_id: 'cloud-models',
    type: 'true_false',
    difficulty: 'medium',
    question: 'In a hybrid cloud model, an organization can maintain operational connectivity between on-premises datacenters and Azure through secure VPN or ExpressRoute connections.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'True. Hybrid cloud setups routinely rely on site-to-site VPNs or dedicated Azure ExpressRoute circuits to securely interconnect on-premises and cloud resources.',
    explanation_wrong: {
      'B': 'Encrypted network tunnels or dedicated physical links are standard prerequisites for hybrid cloud architectures.'
    }
  },
  {
    id: 'cloud-models-007',
    topic_id: 'cloud-models',
    type: 'single',
    difficulty: 'easy',
    question: 'If a company has a business mandate requiring complete control over physical server brand selection, maintenance windows, and physical facility security, which deployment model must it choose?',
    options: [
      { id: 'A', text: 'SaaS cloud' },
      { id: 'B', text: 'Public cloud' },
      { id: 'C', text: 'Shared tenant cloud' },
      { id: 'D', text: 'Private cloud' }
    ],
    correct_option_ids: ['D'],
    explanation_correct: 'Only a private cloud affords total control over the procurement, maintenance, physical security, and architectural choices of server hardware.',
    explanation_wrong: {
      'A': 'SaaS is a software delivery model where the customer manages no hardware or infrastructure whatsoever.',
      'B': 'Public cloud providers make all physical server and facility decisions autonomously.',
      'C': 'Shared tenant environments prevent individual customers from dictating underlying physical hardware.'
    }
  },
  {
    id: 'cloud-models-008',
    topic_id: 'cloud-models',
    type: 'multiple',
    difficulty: 'hard',
    question: 'A retail firm uses a private cloud for regional warehouse logistics and Azure for customer-facing e-commerce. Which TWO statements accurately reflect this setup?',
    options: [
      { id: 'A', text: 'The organization is operating a hybrid cloud architecture' },
      { id: 'B', text: 'All warehouse logistics databases become public internet endpoints automatically' },
      { id: 'C', text: 'The organization can eliminate all internal IT staff immediately' },
      { id: 'D', text: 'The organization maintains operational flexibility to run workloads where they are most cost-effective and compliant' }
    ],
    correct_option_ids: ['A', 'D'],
    explanation_correct: 'Combining private datacenter workloads with public cloud creates a hybrid cloud, giving the company maximum flexibility for performance and compliance.',
    explanation_wrong: {
      'B': 'Private warehouse logistics databases remain inside the private network and are never exposed publicly.',
      'C': 'Hybrid cloud requires IT staff to administer on-premises servers, network links, and cloud configurations.'
    }
  },

  // ==========================================
  // TOPIC 3: cloud-pricing (8 questions)
  // ==========================================
  {
    id: 'cloud-pricing-001',
    topic_id: 'cloud-pricing',
    type: 'single',
    difficulty: 'easy',
    question: 'How does Capital Expenditure (CapEx) differ from Operational Expenditure (OpEx)?',
    options: [
      { id: 'A', text: 'CapEx is spent on monthly cloud subscriptions; OpEx is spent on purchasing buildings' },
      { id: 'B', text: 'CapEx requires large upfront spending on physical assets; OpEx covers ongoing service costs with no upfront fees' },
      { id: 'C', text: 'CapEx is billed per second of computing time; OpEx requires 5-year hardware leases' },
      { id: 'D', text: 'CapEx is deducted on business taxes in a single year; OpEx is depreciated over decades' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'CapEx involves upfront financial investment in physical equipment that depreciates over time. OpEx represents ongoing operational expenses billed as services are consumed.',
    explanation_wrong: {
      'A': 'This is reversed; cloud subscriptions are OpEx, while purchasing physical buildings is CapEx.',
      'C': 'Per-second compute billing is OpEx, whereas long-term physical hardware leases are CapEx.',
      'D': 'In accounting, CapEx depreciates over multiple years, whereas OpEx can be deducted in the current tax year.'
    }
  },
  {
    id: 'cloud-pricing-002',
    topic_id: 'cloud-pricing',
    type: 'single',
    difficulty: 'easy',
    question: 'Which of the following best defines the consumption-based pricing model in Azure?',
    options: [
      { id: 'A', text: 'Users pay only for the compute and storage resources they actively consume' },
      { id: 'B', text: 'Customers pay a mandatory fixed yearly license regardless of usage volume' },
      { id: 'C', text: 'Pricing is determined solely by the number of employees registered at the company' },
      { id: 'D', text: 'Users pay upfront for 10 years of unlimited datacenter electricity' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'Under a consumption-based pricing model, organizations pay only for the cloud resources they actively use, stopping payments when resources are deleted.',
    explanation_wrong: {
      'B': 'Mandatory fixed yearly licensing describes traditional software models, not consumption-based cloud pricing.',
      'C': 'Consumption pricing measures resource utilization (CPU, memory, storage, bandwidth), not overall company headcount.',
      'D': 'Datacenter electricity is factored into operational usage fees and is never purchased 10 years in advance by cloud users.'
    }
  },
  {
    id: 'cloud-pricing-003',
    topic_id: 'cloud-pricing',
    type: 'multiple',
    difficulty: 'medium',
    question: 'When an Azure Virtual Machine is stopped and placed in the "Deallocated" state, which TWO billing outcomes occur?',
    options: [
      { id: 'A', text: 'Charges for attached managed OS disks stop immediately' },
      { id: 'B', text: 'Compute processor and memory allocation charges stop immediately' },
      { id: 'C', text: 'Storage charges for attached managed disks continue to accrue' },
      { id: 'D', text: 'All networking and IP allocations are permanently erased from the subscription' }
    ],
    correct_option_ids: ['B', 'C'],
    explanation_correct: 'In the Deallocated state, compute processor charges halt, but storage charges for attached virtual disks continue because data persistence is maintained.',
    explanation_wrong: {
      'A': 'Storage disks continue to incur charges because Azure reserves the disk capacity for your data.',
      'D': 'Reserved IP addresses and virtual network configs remain intact until explicitly deleted.'
    }
  },
  {
    id: 'cloud-pricing-004',
    topic_id: 'cloud-pricing',
    type: 'single',
    difficulty: 'easy',
    question: 'Why is the OpEx model particularly advantageous for early-stage technology startups?',
    options: [
      { id: 'A', text: 'It guarantees that cloud costs will never exceed \$10 per month' },
      { id: 'B', text: 'It gives startups free access to unlimited physical hardware forever' },
      { id: 'C', text: 'It forces competitors to disclose their source code publicly' },
      { id: 'D', text: 'It allows startups to launch products without risking massive upfront capital on server hardware' }
    ],
    correct_option_ids: ['D'],
    explanation_correct: 'OpEx eliminates large upfront capital barriers, enabling startups to pay as they go and scale costs in alignment with actual customer growth.',
    explanation_wrong: {
      'A': 'Cloud costs depend on usage volume and can exceed \$10 if resource utilization increases.',
      'B': 'Cloud providers do not provide unlimited physical hardware for free.',
      'C': 'Cloud billing models have no relation to public source code disclosure.'
    }
  },
  {
    id: 'cloud-pricing-005',
    topic_id: 'cloud-pricing',
    type: 'true_false',
    difficulty: 'easy',
    question: 'In Azure, inbound network data transfers entering Azure datacenters from the internet are billed at high per-gigabyte rates.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'False. Inbound data transfers (ingress) into Azure datacenters are free. Charges apply primarily to outbound data transfers (egress) leaving Azure.',
    explanation_wrong: {
      'A': 'Inbound data transfer into Azure datacenters is always free of bandwidth charges.'
    }
  },
  {
    id: 'cloud-pricing-006',
    topic_id: 'cloud-pricing',
    type: 'true_false',
    difficulty: 'medium',
    question: 'In serverless computing with Azure Functions, you are billed only for the execution time and memory consumed while your code actively runs.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'True. In the consumption tier of Azure Functions, compute billing is calculated strictly on event executions and execution duration in milliseconds, with zero charge when idle.',
    explanation_wrong: {
      'B': 'Serverless consumption plans do not charge an ongoing idle baseline fee when code is not executing.'
    }
  },
  {
    id: 'cloud-pricing-007',
    topic_id: 'cloud-pricing',
    type: 'single',
    difficulty: 'hard',
    question: 'An enterprise has predictable database workloads running continuously 24/7 all year. Which Azure pricing strategy provides significant cost discounts compared to standard pay-as-you-go rates?',
    options: [
      { id: 'A', text: 'Spot Virtual Machines with high eviction thresholds' },
      { id: 'B', text: 'Daily pay-as-you-go billing with automated shutdown scripts' },
      { id: 'C', text: 'Azure Reservations with a one-year or three-year commitment' },
      { id: 'D', text: 'Moving database workloads to free trial subscriptions' }
    ],
    correct_option_ids: ['C'],
    explanation_correct: 'Azure Reservations allow organizations to commit to one or three years of predictable compute capacity in exchange for up to 72% cost savings.',
    explanation_wrong: {
      'A': 'Spot VMs can be evicted at any moment when Azure needs capacity, making them unsuitable for continuous production databases.',
      'B': 'Shutting down production databases daily disrupts continuous 24/7 business operations.',
      'D': 'Free trial subscriptions have strict spending limits and are intended for testing, not enterprise production workloads.'
    }
  },
  {
    id: 'cloud-pricing-008',
    topic_id: 'cloud-pricing',
    type: 'multiple',
    difficulty: 'medium',
    question: 'Which TWO factors directly impact the ongoing cost of deploying an Azure Virtual Machine?',
    options: [
      { id: 'A', text: 'The specific Azure region where the VM is deployed' },
      { id: 'B', text: 'The brand name of the physical laptop used by the administrator' },
      { id: 'C', text: 'The size tier and hardware specifications (CPU/RAM) of the VM instance' },
      { id: 'D', text: 'The programming language used to develop client mobile apps' }
    ],
    correct_option_ids: ['A', 'C'],
    explanation_correct: 'VM costs depend heavily on the geographic Azure region (due to local real estate/power costs) and the VM size tier (CPU, RAM, GPU specs).',
    explanation_wrong: {
      'B': 'The administrator\'s personal laptop brand has zero impact on Azure cloud billing meters.',
      'D': 'The programming language of client mobile apps does not determine virtual machine infrastructure costs.'
    }
  },

  // ==========================================
  // TOPIC 4: cloud-benefits (8 questions)
  // ==========================================
  {
    id: 'cloud-benefits-001',
    topic_id: 'cloud-benefits',
    type: 'single',
    difficulty: 'medium',
    question: 'What is the key technical difference between scalability and elasticity in cloud computing?',
    options: [
      { id: 'A', text: 'Scalability is automatic; elasticity requires manual server reconfiguration' },
      { id: 'B', text: 'Scalability only works for storage; elasticity only applies to virtual networks' },
      { id: 'C', text: 'Scalability is the ability to grow capacity; elasticity is the dynamic automated adjustment to demand spikes and drops' },
      { id: 'D', text: 'Scalability refers to disaster recovery; elasticity refers to data encryption' }
    ],
    correct_option_ids: ['C'],
    explanation_correct: 'Scalability is the architectural ability to handle growing workload by adding resources. Elasticity is the dynamic automation that scales resources up/out and down/in as demand fluctuates.',
    explanation_wrong: {
      'A': 'Elasticity is the automated mechanism that scales resources dynamically without human intervention.',
      'B': 'Both scalability and elasticity apply across compute, storage, databases, and application runtimes.',
      'D': 'Disaster recovery relates to reliability and fault tolerance, not scalability.'
    }
  },
  {
    id: 'cloud-benefits-002',
    topic_id: 'cloud-benefits',
    type: 'single',
    difficulty: 'easy',
    question: 'Upgrading an existing Azure Virtual Machine from 4 vCPUs and 16 GB RAM to 16 vCPUs and 64 GB RAM is an example of which scaling pattern?',
    options: [
      { id: 'A', text: 'Horizontal scaling (scaling out)' },
      { id: 'B', text: 'Vertical scaling (scaling up)' },
      { id: 'C', text: 'Geo-redundant scaling' },
      { id: 'D', text: 'Elastic clustering' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'Vertical scaling (scaling up) increases the capacity of an existing individual resource by adding more CPU, RAM, or faster disk performance.',
    explanation_wrong: {
      'A': 'Horizontal scaling (scaling out) adds additional VM instances side by side rather than resizing a single VM.',
      'C': 'Geo-redundant scaling replicates resources across distant geographical locations.',
      'D': 'Elastic clustering refers to automated multi-node orchestration, not resizing an individual VM.'
    }
  },
  {
    id: 'cloud-benefits-003',
    topic_id: 'cloud-benefits',
    type: 'single',
    difficulty: 'medium',
    question: 'Which cloud architecture benefit ensures that an application remains operational and accessible to users with minimal downtime, even when underlying hardware components fail?',
    options: [
      { id: 'A', text: 'High availability' },
      { id: 'B', text: 'Cost predictability' },
      { id: 'C', text: 'Vertical elasticity' },
      { id: 'D', text: 'Data governance' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'High availability ensures that systems remain reachable and fully operational despite local hardware or component failures, minimizing service disruption.',
    explanation_wrong: {
      'B': 'Cost predictability focuses on forecasting financial spending, not system uptime.',
      'C': 'Vertical elasticity resizes individual instances but does not guarantee continuous uptime across hardware faults.',
      'D': 'Data governance establishes organizational policies and data compliance, not infrastructure uptime.'
    }
  },
  {
    id: 'cloud-benefits-004',
    topic_id: 'cloud-benefits',
    type: 'true_false',
    difficulty: 'easy',
    question: 'Cost predictability in the cloud enables organizations to accurately estimate and forecast upcoming infrastructure expenses using tools like the Azure Pricing Calculator.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'True. Predictability allows teams to analyze telemetry, model workloads in pricing calculators, and set automated budget thresholds.',
    explanation_wrong: {
      'B': 'Predictability is one of the core recognized benefits of cloud computing, helping finance teams avoid surprise invoices.'
    }
  },
  {
    id: 'cloud-benefits-005',
    topic_id: 'cloud-benefits',
    type: 'single',
    difficulty: 'medium',
    question: 'An e-commerce website experiences a massive 500% surge in shoppers on Black Friday, which then drops back to baseline traffic by Monday morning. Which cloud capability handles this traffic automatically while minimizing unnecessary post-holiday costs?',
    options: [
      { id: 'A', text: 'Data sovereignty' },
      { id: 'B', text: 'Manual server procurement' },
      { id: 'C', text: 'Static CapEx reservation' },
      { id: 'D', text: 'Elasticity' }
    ],
    correct_option_ids: ['D'],
    explanation_correct: 'Elasticity automatically provisions additional instances to handle peak shopper traffic and de-provisions them when traffic subsides, preventing overpayment.',
    explanation_wrong: {
      'A': 'Data sovereignty ensures compliance with local national data storage laws.',
      'B': 'Manual server procurement is slow and incapable of responding to real-time online traffic fluctuations.',
      'C': 'Static CapEx reservations lock in fixed capacity and do not scale dynamically with transient consumer demand.'
    }
  },
  {
    id: 'cloud-benefits-006',
    topic_id: 'cloud-benefits',
    type: 'multiple',
    difficulty: 'hard',
    question: 'Which TWO operational actions are clear examples of horizontal scaling (scaling out)?',
    options: [
      { id: 'A', text: 'Upgrading a single database virtual machine from standard HDD to ultra-high-speed SSD' },
      { id: 'B', text: 'Adding three additional identical virtual machines to an Azure Virtual Machine Scale Set pool' },
      { id: 'C', text: 'Increasing the CPU core count on a single web server from 2 cores to 8 cores' },
      { id: 'D', text: 'Deploying two extra web app instances behind a load balancer to distribute user requests' }
    ],
    correct_option_ids: ['B', 'D'],
    explanation_correct: 'Horizontal scaling involves adding more instances of the same resource to share workload, such as expanding a scale set or web app pool.',
    explanation_wrong: {
      'A': 'Upgrading storage speed on an existing machine is vertical scaling (scaling up).',
      'C': 'Increasing CPU cores on an existing machine is vertical scaling (scaling up).'
    }
  },
  {
    id: 'cloud-benefits-007',
    topic_id: 'cloud-benefits',
    type: 'true_false',
    difficulty: 'easy',
    question: 'High availability in public cloud guarantees 100.0% zero downtime under all possible environmental and software conditions.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'False. Cloud high availability is designed for maximum uptime (typically 99.9% to 99.99% backed by SLAs), but no cloud platform guarantees 100.0% zero downtime.',
    explanation_wrong: {
      'A': 'Cloud Service Level Agreements (SLAs) never guarantee 100% uptime; catastrophic regional events or software bugs can cause brief downtime.'
    }
  },
  {
    id: 'cloud-benefits-008',
    topic_id: 'cloud-benefits',
    type: 'multiple',
    difficulty: 'medium',
    question: 'Which TWO benefits directly strengthen an enterprise\'s disaster recovery posture in Azure?',
    options: [
      { id: 'A', text: 'Replicating critical databases asynchronously to a paired geographic region' },
      { id: 'B', text: 'Restricting all cloud administrator logins to a single physical office location' },
      { id: 'C', text: 'Distributing virtual machine instances across multiple independent Availability Zones' },
      { id: 'D', text: 'Manually taking daily screenshots of server desktop screens' }
    ],
    correct_option_ids: ['A', 'C'],
    explanation_correct: 'Cross-region replication to paired regions and distributing workloads across Availability Zones provide robust resilience against datacenter and regional disasters.',
    explanation_wrong: {
      'B': 'Restricting logins to one physical office introduces a single point of failure if that office loses power or connectivity.',
      'D': 'Taking screenshots of desktop displays is not an IT disaster recovery mechanism.'
    }
  },

  // ==========================================
  // TOPIC 5: cloud-service-types (8 questions)
  // ==========================================
  {
    id: 'cloud-service-types-001',
    topic_id: 'cloud-service-types',
    type: 'single',
    difficulty: 'easy',
    question: 'A company wants to migrate an existing on-premises legacy application to Azure with minimal code modifications (lift-and-shift), requiring full administrative control over the Windows operating system and installed background services. Which cloud service category should it select?',
    options: [
      { id: 'A', text: 'Software as a Service (SaaS)' },
      { id: 'B', text: 'Infrastructure as a Service (IaaS)' },
      { id: 'C', text: 'Platform as a Service (PaaS)' },
      { id: 'D', text: 'Serverless Functions' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'IaaS (such as Azure Virtual Machines) provides direct access to the guest operating system, making it the best choice for lift-and-shift migrations with minimal changes.',
    explanation_wrong: {
      'A': 'SaaS provides pre-built applications with zero customer access to operating systems.',
      'C': 'PaaS abstracts the operating system, which may not support custom background services or legacy installers.',
      'D': 'Serverless requires refactoring code into event-driven stateless functions.'
    }
  },
  {
    id: 'cloud-service-types-002',
    topic_id: 'cloud-service-types',
    type: 'single',
    difficulty: 'medium',
    question: 'What is a core benefit of using Platform as a Service (PaaS) such as Azure App Service?',
    options: [
      { id: 'A', text: 'Customers gain root access to the physical datacenter hypervisor' },
      { id: 'B', text: 'Customers must manually install monthly security patches on the host OS' },
      { id: 'C', text: 'Developers can deploy application code without managing the underlying operating system or web server runtime' },
      { id: 'D', text: 'All data stored in the application becomes public domain automatically' }
    ],
    correct_option_ids: ['C'],
    explanation_correct: 'PaaS abstracts away infrastructure management, allowing development teams to concentrate strictly on writing and deploying application business logic.',
    explanation_wrong: {
      'A': 'Public cloud customers never receive access to physical datacenter hypervisors.',
      'B': 'Host OS patching in PaaS is handled automatically by Microsoft.',
      'D': 'Application data remains private and secure under customer access control.'
    }
  },
  {
    id: 'cloud-service-types-003',
    topic_id: 'cloud-service-types',
    type: 'single',
    difficulty: 'easy',
    question: 'Microsoft 365, Salesforce, and Dropbox are prime examples of which cloud service category?',
    options: [
      { id: 'A', text: 'Software as a Service (SaaS)' },
      { id: 'B', text: 'Infrastructure as a Service (IaaS)' },
      { id: 'C', text: 'Platform as a Service (PaaS)' },
      { id: 'D', text: 'Hardware as a Service (HaaS)' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'Software as a Service (SaaS) delivers complete, centrally hosted applications over the internet that end users consume directly.',
    explanation_wrong: {
      'B': 'IaaS provides raw virtualized compute, storage, and networking building blocks.',
      'C': 'PaaS provides application runtimes and database development platforms.',
      'D': 'Hardware as a Service is not one of the standard cloud service tiers in the AZ-900 syllabus.'
    }
  },
  {
    id: 'cloud-service-types-004',
    topic_id: 'cloud-service-types',
    type: 'single',
    difficulty: 'medium',
    question: 'Which cloud computing model executes code purely in response to external events (such as an HTTP request or queue message), scaling automatically to zero when no events occur?',
    options: [
      { id: 'A', text: 'Dedicated Virtual Machines' },
      { id: 'B', text: 'Traditional IaaS hosting' },
      { id: 'C', text: 'Bare-metal hosting' },
      { id: 'D', text: 'Serverless computing (e.g. Azure Functions)' }
    ],
    correct_option_ids: ['D'],
    explanation_correct: 'Serverless computing abstracts server infrastructure completely, running stateless code triggered by events and billing only for execution duration.',
    explanation_wrong: {
      'A': 'Dedicated VMs incur continuous hourly charges even when running idle with zero traffic.',
      'B': 'Traditional IaaS requires provisioning and maintaining persistent virtual machines.',
      'C': 'Bare-metal hosting dedicates physical hardware boxes to a customer with ongoing fixed lease fees.'
    }
  },
  {
    id: 'cloud-service-types-005',
    topic_id: 'cloud-service-types',
    type: 'true_false',
    difficulty: 'easy',
    question: 'When using an Azure Platform as a Service (PaaS) offering, the customer is required to manually apply Windows security patches to the server operating system.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'False. In PaaS, the cloud provider (Microsoft) is responsible for patching and maintaining the underlying operating system and hardware.',
    explanation_wrong: {
      'A': 'Customers only patch the operating system in IaaS, never in PaaS.'
    }
  },
  {
    id: 'cloud-service-types-006',
    topic_id: 'cloud-service-types',
    type: 'multiple',
    difficulty: 'hard',
    question: 'Which TWO comparisons between IaaS and PaaS are accurate?',
    options: [
      { id: 'A', text: 'IaaS provides greater administrative control over the operating system environment than PaaS' },
      { id: 'B', text: 'PaaS requires the customer to configure virtual network routers and switch firmware' },
      { id: 'C', text: 'PaaS generally delivers faster application deployment speed by abstracting infrastructure setup' },
      { id: 'D', text: 'IaaS automatically fixes security flaws in the customer\'s proprietary application code' }
    ],
    correct_option_ids: ['A', 'C'],
    explanation_correct: 'IaaS gives full control over OS and software stacks, whereas PaaS delivers rapid deployment by removing the burden of server management.',
    explanation_wrong: {
      'B': 'Network switches and hypervisor routing in PaaS are maintained by Microsoft.',
      'D': 'Neither IaaS nor PaaS modifies or debugs custom application code; that is always the developer\'s responsibility.'
    }
  },
  {
    id: 'cloud-service-types-007',
    topic_id: 'cloud-service-types',
    type: 'true_false',
    difficulty: 'easy',
    question: 'In a Software as a Service (SaaS) model, the customer is responsible for managing user accounts, multi-factor authentication, and data permissions.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'True. Even in SaaS, the customer owns user identity, credential security, role assignment, and access control for company data.',
    explanation_wrong: {
      'B': 'Microsoft manages the SaaS application software and infrastructure, but access governance remains with the customer.'
    }
  },
  {
    id: 'cloud-service-types-008',
    topic_id: 'cloud-service-types',
    type: 'multiple',
    difficulty: 'medium',
    question: 'Which TWO Azure services are categorized under Platform as a Service (PaaS)?',
    options: [
      { id: 'A', text: 'Azure Virtual Machines' },
      { id: 'B', text: 'Azure App Service' },
      { id: 'C', text: 'Azure Dedicated Host' },
      { id: 'D', text: 'Azure SQL Database' }
    ],
    correct_option_ids: ['B', 'D'],
    explanation_correct: 'Azure App Service (web app hosting) and Azure SQL Database (managed relational database) are both managed PaaS offerings.',
    explanation_wrong: {
      'A': 'Azure Virtual Machines is an IaaS offering.',
      'C': 'Azure Dedicated Host provides dedicated physical IaaS hardware.'
    }
  },

  // ==========================================
  // TOPIC 6: arch-regions (8 questions)
  // ==========================================
  {
    id: 'arch-regions-001',
    topic_id: 'arch-regions',
    type: 'single',
    difficulty: 'easy',
    question: 'What is an Azure Region?',
    options: [
      { id: 'A', text: 'A single physical server rack located in Microsoft headquarters' },
      { id: 'B', text: 'A geographical area containing one or more datacenters connected by a low-latency network' },
      { id: 'C', text: 'A collection of Azure subscriptions belonging to the same billing account' },
      { id: 'D', text: 'A virtual firewall that monitors incoming internet traffic' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'An Azure Region is a geographical perimeter containing one or more datacenters linked together by a dedicated low-latency regional network.',
    explanation_wrong: {
      'A': 'An individual server rack is just a tiny hardware unit within a single datacenter room.',
      'C': 'A collection of subscriptions is managed by a Management Group, not a region.',
      'D': 'A virtual firewall is a Network Security Group or Azure Firewall service.'
    }
  },
  {
    id: 'arch-regions-002',
    topic_id: 'arch-regions',
    type: 'single',
    difficulty: 'medium',
    question: 'What physical architecture distinguishes an Azure Availability Zone from an ordinary datacenter?',
    options: [
      { id: 'A', text: 'It is built underwater to ensure natural cooling efficiency' },
      { id: 'B', text: 'It connects directly to customer on-premises offices without fiber cables' },
      { id: 'C', text: 'It is located in a different continent than the rest of the region' },
      { id: 'D', text: 'It is physically separated with independent power, cooling, and networking within the region' }
    ],
    correct_option_ids: ['D'],
    explanation_correct: 'Availability Zones are physically distinct datacenter locations within a region, each equipped with independent power, climate cooling, and networking.',
    explanation_wrong: {
      'A': 'Project Natick tested underwater datacenters, but commercial Availability Zones are land-based facilities.',
      'B': 'Availability Zones connect to global networks via high-speed fiber cables.',
      'C': 'Availability Zones are always located within the same regional geographic boundary.'
    }
  },
  {
    id: 'arch-regions-003',
    topic_id: 'arch-regions',
    type: 'single',
    difficulty: 'medium',
    question: 'What is the minimum physical distance typically maintained between regions in an Azure Region Pair within the same geography?',
    options: [
      { id: 'A', text: 'At least 300 miles (approximately 480 kilometers)' },
      { id: 'B', text: 'Exactly 5 miles' },
      { id: 'C', text: 'At least 5,000 miles across oceans' },
      { id: 'D', text: 'Less than 1,000 feet' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'Azure Region Pairs are separated by at least 300 miles within the same geography to minimize the impact of regional natural disasters or power grid outages.',
    explanation_wrong: {
      'B': 'A 5-mile distance is too close; a single earthquake or hurricane would impact both regions.',
      'C': '5,000 miles is excessive; Region Pairs reside within the same geography/geopolitical boundary to respect data sovereignty.',
      'D': '1,000 feet describes buildings on the same corporate campus, not cross-region disaster pairs.'
    }
  },
  {
    id: 'arch-regions-004',
    topic_id: 'arch-regions',
    type: 'single',
    difficulty: 'hard',
    question: 'A financial institution deploys virtual machines across three Availability Zones in the East US region. Which disaster scenario does this design protect against?',
    options: [
      { id: 'A', text: 'A meteor strike destroying the entire eastern seaboard of North America' },
      { id: 'B', text: 'A statewide internet backbone severance across the entire United States' },
      { id: 'C', text: 'A catastrophic fire or power blackout destroying a single physical datacenter facility' },
      { id: 'D', text: 'A human administrator mistakenly deleting the entire Azure subscription' }
    ],
    correct_option_ids: ['C'],
    explanation_correct: 'Availability Zones protect against datacenter-level failures (such as fires, floods, or power grid cuts) within a region, since the other zones remain operational.',
    explanation_wrong: {
      'A': 'An entire regional disaster destroying the eastern seaboard requires multi-region disaster recovery (Region Pairs), not intra-region zones.',
      'B': 'Nationwide backbone severances impact all datacenters in that geographic territory.',
      'D': 'Deleting a subscription erases resources across all zones logically; zone replication does not prevent human administrative deletion.'
    }
  },
  {
    id: 'arch-regions-005',
    topic_id: 'arch-regions',
    type: 'true_false',
    difficulty: 'easy',
    question: 'Every single Azure region globally currently supports Availability Zones with three physical facilities.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'False. While Microsoft is expanding zone capabilities to all major regions, some specialized or developing regions do not support Availability Zones.',
    explanation_wrong: {
      'A': 'Availability Zones are supported in many major regions, but not universally across 100% of global regions.'
    }
  },
  {
    id: 'arch-regions-006',
    topic_id: 'arch-regions',
    type: 'multiple',
    difficulty: 'medium',
    question: 'Which TWO capabilities are supported by deploying an application across an Azure Region Pair?',
    options: [
      { id: 'A', text: 'Automated 100% free compute execution on all secondary servers' },
      { id: 'B', text: 'Sequential Azure platform updates where only one region in the pair is updated at a time' },
      { id: 'C', text: 'Cross-region geo-replication for business continuity and disaster recovery' },
      { id: 'D', text: 'Automatic exemption from all national data protection laws' }
    ],
    correct_option_ids: ['B', 'C'],
    explanation_correct: 'Region Pairs provide sequenced platform updates to prevent widespread disruption and enable geo-redundant replication for disaster recovery.',
    explanation_wrong: {
      'A': 'Compute resources running in secondary paired regions are billed at standard regional rates.',
      'D': 'Deploying across region pairs does not exempt organizations from legal or compliance obligations.'
    }
  },
  {
    id: 'arch-regions-007',
    topic_id: 'arch-regions',
    type: 'true_false',
    difficulty: 'easy',
    question: 'Data residency and legal sovereignty requirements in a country can dictate which specific Azure region an organization is permitted to select for storing customer records.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'True. Legal and compliance frameworks (like GDPR, POPIA, or national banking laws) often mandate that customer data must remain within national borders.',
    explanation_wrong: {
      'B': 'Compliance regulations routinely dictate permissible geographic data residency boundaries.'
    }
  },
  {
    id: 'arch-regions-008',
    topic_id: 'arch-regions',
    type: 'multiple',
    difficulty: 'hard',
    question: 'When architecting a global enterprise service on Azure, which TWO factors most strongly influence the choice of deployment regions?',
    options: [
      { id: 'A', text: 'Geographic proximity to the majority of end users to minimize network latency' },
      { id: 'B', text: 'The color scheme of the Azure portal user interface' },
      { id: 'C', text: 'The manufacturer of the employee laptop keyboards' },
      { id: 'D', text: 'Legal compliance and regional data sovereignty regulations' }
    ],
    correct_option_ids: ['A', 'D'],
    explanation_correct: 'Region selection is primarily driven by latency proximity to users, compliance/data sovereignty laws, service availability, and regional pricing.',
    explanation_wrong: {
      'B': 'The Azure portal UI theme is purely a client-side browser preference and has no relation to regions.',
      'C': 'Laptop hardware keyboard models have no bearing on cloud architecture decisions.'
    }
  },

  // ==========================================
  // TOPIC 7: arch-org (8 questions)
  // ==========================================
  {
    id: 'arch-org-001',
    topic_id: 'arch-org',
    type: 'single',
    difficulty: 'easy',
    question: 'What is the correct hierarchical order of Azure organizational management layers, from highest parent level down to individual items?',
    options: [
      { id: 'A', text: 'Subscriptions -> Management Groups -> Resources -> Resource Groups' },
      { id: 'B', text: 'Resource Groups -> Subscriptions -> Management Groups -> Resources' },
      { id: 'C', text: 'Management Groups -> Subscriptions -> Resource Groups -> Resources' },
      { id: 'D', text: 'Resources -> Resource Groups -> Subscriptions -> Management Groups' }
    ],
    correct_option_ids: ['C'],
    explanation_correct: 'The hierarchy from top to bottom is: Management Groups (top) -> Subscriptions -> Resource Groups -> Resources (individual service instances).',
    explanation_wrong: {
      'A': 'Management Groups sit above Subscriptions, not below them.',
      'B': 'Resource Groups are nested inside Subscriptions, not above them.',
      'D': 'This is the bottom-up order, not the top-down hierarchical parent order.'
    }
  },
  {
    id: 'arch-org-002',
    topic_id: 'arch-org',
    type: 'true_false',
    difficulty: 'easy',
    question: 'An individual Azure resource (such as a Virtual Machine) can belong to multiple Resource Groups simultaneously.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'False. Every Azure resource must belong to exactly one Resource Group at any given time. However, resources can be moved between groups.',
    explanation_wrong: {
      'A': 'An Azure resource can only reside in a single Resource Group.'
    }
  },
  {
    id: 'arch-org-003',
    topic_id: 'arch-org',
    type: 'true_false',
    difficulty: 'medium',
    question: 'A single Resource Group can contain resources that are physically deployed in different Azure regions.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'True. A Resource Group is a logical management container. It can contain a virtual machine in East US and a storage account in West Europe.',
    explanation_wrong: {
      'B': 'Resource Groups do not restrict member resources to a single geographic region.'
    }
  },
  {
    id: 'arch-org-004',
    topic_id: 'arch-org',
    type: 'single',
    difficulty: 'easy',
    question: 'What happens to the resources inside a Resource Group if the administrator deletes the Resource Group in the Azure portal?',
    options: [
      { id: 'A', text: 'Only the Resource Group name is removed; all resources are migrated to the root subscription' },
      { id: 'B', text: 'The resources are converted to read-only mode for 90 days' },
      { id: 'C', text: 'The deletion fails unless every resource is powered off manually' },
      { id: 'D', text: 'Every resource contained within the Resource Group is deleted' }
    ],
    correct_option_ids: ['D'],
    explanation_correct: 'Deleting a Resource Group cascades down and deletes all resources contained inside it. This enables simple cleanup of project environments.',
    explanation_wrong: {
      'A': 'Resources are not migrated to the root subscription; they are permanently deleted.',
      'B': 'Resources are not preserved in a read-only state when a group is deleted.',
      'C': 'Azure automatically orchestrates the deletion of all contained resources even if VMs are running.'
    }
  },
  {
    id: 'arch-org-005',
    topic_id: 'arch-org',
    type: 'single',
    difficulty: 'medium',
    question: 'What is the primary architectural purpose of Azure Management Groups?',
    options: [
      { id: 'A', text: 'To manage physical server rack cabling in Microsoft datacenters' },
      { id: 'B', text: 'To manage access, policy, and compliance across multiple Azure subscriptions simultaneously' },
      { id: 'C', text: 'To encrypt virtual hard drives using customer-managed cryptographic keys' },
      { id: 'D', text: 'To automatically pay monthly Azure invoices using PayPal accounts' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'Management Groups provide a governance scope above subscriptions, allowing organizations to apply policies and RBAC roles that inherit across all child subscriptions.',
    explanation_wrong: {
      'A': 'Physical datacenter cabling is handled by Microsoft technicians, not Azure governance groups.',
      'C': 'Disk encryption is managed by Azure Key Vault and disk encryption sets.',
      'D': 'Invoice billing methods are configured in the Azure billing center, not Management Groups.'
    }
  },
  {
    id: 'arch-org-006',
    topic_id: 'arch-org',
    type: 'single',
    difficulty: 'easy',
    question: 'Which Azure management construct serves as both a primary unit of billing and a security boundary for managing resources?',
    options: [
      { id: 'A', text: 'An Azure Subscription' },
      { id: 'B', text: 'A Resource Tag' },
      { id: 'C', text: 'An Availability Zone' },
      { id: 'D', text: 'A Virtual Machine Scale Set' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'An Azure Subscription links resource provisioning to a billing agreement and defines access boundaries for administrators.',
    explanation_wrong: {
      'B': 'Resource Tags are metadata labels for reporting, not billing contracts or security boundaries.',
      'C': 'Availability Zones are physical datacenter clusters, not billing agreements.',
      'D': 'Virtual Machine Scale Sets are compute resources, not subscription billing containers.'
    }
  },
  {
    id: 'arch-org-007',
    topic_id: 'arch-org',
    type: 'multiple',
    difficulty: 'medium',
    question: 'Which TWO statements correctly describe rules regarding Azure Resource Groups?',
    options: [
      { id: 'A', text: 'Resource Groups can be nested inside other Resource Groups indefinitely' },
      { id: 'B', text: 'Resources can be moved from one Resource Group to another Resource Group' },
      { id: 'C', text: 'A single resource can be placed in up to five Resource Groups at once' },
      { id: 'D', text: 'You can apply Role-Based Access Control (RBAC) at the Resource Group scope' }
    ],
    correct_option_ids: ['B', 'D'],
    explanation_correct: 'Resources can be migrated between groups, and RBAC permissions can be applied at the Resource Group level so all contained resources inherit the roles.',
    explanation_wrong: {
      'A': 'Resource Groups cannot be nested inside other Resource Groups.',
      'C': 'A resource belongs to exactly one Resource Group, not multiple.'
    }
  },
  {
    id: 'arch-org-008',
    topic_id: 'arch-org',
    type: 'multiple',
    difficulty: 'hard',
    question: 'When governance policies and RBAC permissions are assigned at the Management Group root level, which TWO statements reflect the inheritance behavior?',
    options: [
      { id: 'A', text: 'All child subscriptions under that management group inherit the policy rules' },
      { id: 'B', text: 'Policies apply only to physical datacenters located in Europe' },
      { id: 'C', text: 'Resource groups inside those subscriptions inherit the permissions and policies automatically' },
      { id: 'D', text: 'Child resources can completely reject parent policies without administrator authorization' }
    ],
    correct_option_ids: ['A', 'C'],
    explanation_correct: 'In the Azure hierarchy, rules and roles flow downwards: Management Group policies automatically cascade to child subscriptions, resource groups, and resources.',
    explanation_wrong: {
      'B': 'Management group policies apply logically across all regions encompassed by the subscriptions.',
      'D': 'Child resources cannot block or reject inherited policies unless explicit policy exemptions are granted.'
    }
  },

  // ==========================================
  // TOPIC 8: arch-compute (8 questions)
  // ==========================================
  {
    id: 'arch-compute-001',
    topic_id: 'arch-compute',
    type: 'single',
    difficulty: 'easy',
    question: 'Which Azure compute service provides virtualized on-demand Windows or Linux servers with total control over operating system configuration, software drivers, and background services?',
    options: [
      { id: 'A', text: 'Azure Logic Apps' },
      { id: 'B', text: 'Azure Virtual Machines' },
      { id: 'C', text: 'Azure Static Web Apps' },
      { id: 'D', text: 'Azure Event Grid' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'Azure Virtual Machines provide IaaS virtual computers, giving administrators complete control over OS installation, patching, and software configuration.',
    explanation_wrong: {
      'A': 'Azure Logic Apps is an automated workflow orchestration service.',
      'C': 'Azure Static Web Apps hosts pre-built HTML/CSS/JavaScript frontends without server access.',
      'D': 'Azure Event Grid is an event routing service, not a virtual machine host.'
    }
  },
  {
    id: 'arch-compute-002',
    topic_id: 'arch-compute',
    type: 'single',
    difficulty: 'medium',
    question: 'An enterprise needs to deploy a pool of identical virtual machines that automatically increases or decreases instance count in response to changing CPU usage metrics. Which service should it use?',
    options: [
      { id: 'A', text: 'Virtual Machine Scale Sets (VMSS)' },
      { id: 'B', text: 'Azure App Service Isolated Tier' },
      { id: 'C', text: 'Azure Key Vault Managed HSM' },
      { id: 'D', text: 'Azure Arc-enabled servers' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'Virtual Machine Scale Sets (VMSS) allow you to create and manage a group of identical, load-balanced VMs that scale automatically based on metric rules.',
    explanation_wrong: {
      'B': 'App Service Isolated hosts web apps, not arbitrary pools of identical customizable VMs.',
      'C': 'Azure Key Vault manages cryptographic keys and secrets, not virtual machine pools.',
      'D': 'Azure Arc registers external on-premises servers into Azure Resource Manager.'
    }
  },
  {
    id: 'arch-compute-003',
    topic_id: 'arch-compute',
    type: 'single',
    difficulty: 'medium',
    question: 'What is the main operational difference between Azure Container Instances (ACI) and Azure Kubernetes Service (AKS)?',
    options: [
      { id: 'A', text: 'ACI is only for Windows; AKS is only for Linux' },
      { id: 'B', text: 'ACI requires managing physical hardware; AKS runs serverless' },
      { id: 'C', text: 'ACI is a relational database; AKS is an object storage repository' },
      { id: 'D', text: 'ACI runs standalone containers quickly without managing orchestration; AKS provides full enterprise container orchestration' }
    ],
    correct_option_ids: ['D'],
    explanation_correct: 'ACI is a fast, serverless way to run individual container images without cluster management. AKS provides enterprise container orchestration, ingress routing, and service discovery.',
    explanation_wrong: {
      'A': 'Both ACI and AKS support both Linux and Windows containers.',
      'B': 'ACI is serverless; AKS provisions and manages Kubernetes cluster nodes.',
      'C': 'Neither ACI nor AKS is a storage or database service; both are container compute services.'
    }
  },
  {
    id: 'arch-compute-004',
    topic_id: 'arch-compute',
    type: 'single',
    difficulty: 'easy',
    question: 'A software company wants to deploy a REST API written in Node.js and a web frontend in ASP.NET Core without provisioning or managing server operating systems. Which PaaS service fits best?',
    options: [
      { id: 'A', text: 'Azure Virtual Machine Scale Sets' },
      { id: 'B', text: 'Azure Dedicated Host' },
      { id: 'C', text: 'Azure App Service' },
      { id: 'D', text: 'Azure Disk Storage' }
    ],
    correct_option_ids: ['C'],
    explanation_correct: 'Azure App Service is a fully managed PaaS offering designed specifically to host web applications, background jobs, and REST APIs without managing infrastructure.',
    explanation_wrong: {
      'A': 'VM Scale Sets is an IaaS solution where you manage operating system images.',
      'B': 'Dedicated Host provides dedicated physical IaaS servers.',
      'D': 'Disk Storage provides block storage volumes, not web application execution.'
    }
  },
  {
    id: 'arch-compute-005',
    topic_id: 'arch-compute',
    type: 'true_false',
    difficulty: 'easy',
    question: 'When using Azure Functions on a serverless Consumption Plan, you are billed for virtual machine hours even when the function receives zero requests all weekend.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'False. In a Consumption Plan, Azure Functions scale to zero when idle, resulting in zero compute charges when no events or requests are processed.',
    explanation_wrong: {
      'A': 'Serverless consumption plans do not charge for idle time when no code is executing.'
    }
  },
  {
    id: 'arch-compute-006',
    topic_id: 'arch-compute',
    type: 'single',
    difficulty: 'hard',
    question: 'Which Azure solution allows organizations to deliver virtualized multi-session Windows 11 and Windows 10 enterprise desktops to remote workers accessible from any device over the internet?',
    options: [
      { id: 'A', text: 'Azure Virtual Desktop (AVD)' },
      { id: 'B', text: 'Azure Container Registry (ACR)' },
      { id: 'C', text: 'Azure App Configuration' },
      { id: 'D', text: 'Azure Service Bus' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'Azure Virtual Desktop delivers cloud-hosted virtual desktops and remote applications, supporting multi-session Windows environments for distributed teams.',
    explanation_wrong: {
      'B': 'Azure Container Registry stores and manages Docker container images.',
      'C': 'Azure App Configuration centrally manages application settings and feature flags.',
      'D': 'Azure Service Bus is an enterprise messaging broker.'
    }
  },
  {
    id: 'arch-compute-007',
    topic_id: 'arch-compute',
    type: 'multiple',
    difficulty: 'medium',
    question: 'Which TWO scenarios represent suitable use cases for deploying Azure Kubernetes Service (AKS)?',
    options: [
      { id: 'A', text: 'Serving static plain-text blog articles with zero backend computation' },
      { id: 'B', text: 'Orchestrating a complex microservices architecture consisting of dozens of interconnected Docker containers' },
      { id: 'C', text: 'Managing automated zero-downtime rolling upgrades and self-healing across hundreds of container pods' },
      { id: 'D', text: 'Replacing physical desktop monitors and keyboards in the corporate office' }
    ],
    correct_option_ids: ['B', 'C'],
    explanation_correct: 'AKS is built for coordinating complex microservices, automated pod healing, autoscaling, and zero-downtime container deployments.',
    explanation_wrong: {
      'A': 'Plain static blogs are more efficiently hosted on Azure Storage or Azure Static Web Apps without container cluster overhead.',
      'D': 'AKS is a cloud software service and has no relation to physical office peripheral equipment.'
    }
  },
  {
    id: 'arch-compute-008',
    topic_id: 'arch-compute',
    type: 'multiple',
    difficulty: 'hard',
    question: 'Which TWO statements correctly describe the administrative boundaries between Azure Virtual Machines (IaaS) and Azure App Service (PaaS)?',
    options: [
      { id: 'A', text: 'On Azure Virtual Machines, the customer is responsible for installing security updates to the OS' },
      { id: 'B', text: 'On Azure App Service, the customer must manually manage server fan speeds' },
      { id: 'C', text: 'On Azure Virtual Machines, Microsoft automatically inspects and debugs user application code' },
      { id: 'D', text: 'On Azure App Service, Microsoft manages server hardware, OS patching, and network routing' }
    ],
    correct_option_ids: ['A', 'D'],
    explanation_correct: 'IaaS requires customer OS maintenance; PaaS offloads OS, runtime, and hardware management to Microsoft.',
    explanation_wrong: {
      'B': 'Physical fan speeds and cooling in datacenters are handled automatically by Microsoft.',
      'C': 'Microsoft never inspects or debugs customer proprietary software code on VMs.'
    }
  },

  // ==========================================
  // TOPIC 9: arch-network (8 questions)
  // ==========================================
  {
    id: 'arch-network-001',
    topic_id: 'arch-network',
    type: 'single',
    difficulty: 'easy',
    question: 'What is an Azure Virtual Network (VNet)?',
    options: [
      { id: 'A', text: 'A public domain registrar owned by Microsoft' },
      { id: 'B', text: 'A public chat room for Azure developers' },
      { id: 'C', text: 'A secure representation of your own private network in the cloud with private IP addressing' },
      { id: 'D', text: 'A physical network cable shipped to your office address' }
    ],
    correct_option_ids: ['C'],
    explanation_correct: 'An Azure Virtual Network (VNet) provides private, isolated network boundaries in the cloud, allowing resources to communicate securely using private IP addresses.',
    explanation_wrong: {
      'A': 'Domain registration is handled by DNS registrars or Azure DNS.',
      'B': 'A VNet is a networking infrastructure construct, not a developer chat application.',
      'D': 'A VNet is a virtualized cloud network construct, not a physical hardware cable.'
    }
  },
  {
    id: 'arch-network-002',
    topic_id: 'arch-network',
    type: 'single',
    difficulty: 'medium',
    question: 'How does traffic travel when two Azure Virtual Networks (VNets) are connected using VNet Peering?',
    options: [
      { id: 'A', text: 'Traffic travels across the public internet through commercial telecommunications lines' },
      { id: 'B', text: 'Traffic is routed directly across Microsoft\'s high-speed private global fiber backbone' },
      { id: 'C', text: 'Traffic must pass through an on-premises physical datacenter in Nairobi' },
      { id: 'D', text: 'Traffic is converted to unencrypted analog radio waves' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'VNet Peering routes network packets completely within Microsoft\'s private global fiber network, bypassing the public internet for high bandwidth and low latency.',
    explanation_wrong: {
      'A': 'VNet Peering avoids traversing the public internet completely.',
      'C': 'VNet Peering does not trombone through on-premises datacenters unless forced tunneling is configured.',
      'D': 'Azure network backbones use high-speed optical digital fiber links.'
    }
  },
  {
    id: 'arch-network-003',
    topic_id: 'arch-network',
    type: 'single',
    difficulty: 'hard',
    question: 'An enterprise requires a dedicated, private physical connection between its on-premises corporate headquarters and Azure with guaranteed bandwidth (up to 100 Gbps) and consistent low latency, without traversing the public internet. Which service should it implement?',
    options: [
      { id: 'A', text: 'Azure ExpressRoute' },
      { id: 'B', text: 'Azure Point-to-Site VPN' },
      { id: 'C', text: 'Public Internet Gateway' },
      { id: 'D', text: 'Azure Bastion' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'Azure ExpressRoute creates a dedicated private physical circuit between on-premises infrastructure and Azure via a connectivity provider, completely bypassing the public internet.',
    explanation_wrong: {
      'B': 'Point-to-Site VPN encrypts connections over the public internet and does not provide dedicated physical lines.',
      'C': 'Public Internet Gateways route traffic over the unpredictable public internet.',
      'D': 'Azure Bastion provides secure browser-based RDP/SSH access to VMs without public IPs.'
    }
  },
  {
    id: 'arch-network-004',
    topic_id: 'arch-network',
    type: 'single',
    difficulty: 'medium',
    question: 'Which Azure networking component acts as a virtual firewall to filter inbound and outbound traffic to network interfaces or subnets using priority-ranked security rules?',
    options: [
      { id: 'A', text: 'Azure DNS Private Zones' },
      { id: 'B', text: 'Azure Traffic Manager' },
      { id: 'C', text: 'Azure Front Door' },
      { id: 'D', text: 'Network Security Group (NSG)' }
    ],
    correct_option_ids: ['D'],
    explanation_correct: 'A Network Security Group (NSG) contains security rules that allow or deny inbound and outbound network traffic based on source/destination IP, port, and protocol.',
    explanation_wrong: {
      'A': 'Azure DNS Private Zones manage internal domain name resolution, not firewall packet filtering.',
      'B': 'Traffic Manager is a DNS-based traffic load balancer, not a firewall.',
      'C': 'Front Door is a global web application accelerator and layer 7 load balancer.'
    }
  },
  {
    id: 'arch-network-005',
    topic_id: 'arch-network',
    type: 'true_false',
    difficulty: 'easy',
    question: 'Network traffic transmitted across an Azure ExpressRoute circuit travels directly over the public internet.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'False. ExpressRoute connections do not travel over the public internet; they use a private, dedicated physical link provided by a telecommunications partner.',
    explanation_wrong: {
      'A': 'ExpressRoute is specifically designed to bypass the public internet for privacy and performance.'
    }
  },
  {
    id: 'arch-network-006',
    topic_id: 'arch-network',
    type: 'single',
    difficulty: 'medium',
    question: 'How does an Azure Private Endpoint enhance security for an Azure SQL Database or Azure Storage account?',
    options: [
      { id: 'A', text: 'It creates a public DNS record accessible to anyone on the web' },
      { id: 'B', text: 'It assigns a private IP address from your Virtual Network to the service, preventing exposure to the public internet' },
      { id: 'C', text: 'It automatically turns off database password requirements' },
      { id: 'D', text: 'It converts the database into an unmanaged virtual machine' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'Azure Private Endpoint brings Azure PaaS services inside your private VNet using a private IP address, eliminating the need for public internet endpoints.',
    explanation_wrong: {
      'A': 'Private Endpoints specifically eliminate public DNS internet access.',
      'C': 'Authentication and credentials remain mandatory when using Private Endpoints.',
      'D': 'Private Endpoints connect to managed PaaS services without converting them to VMs.'
    }
  },
  {
    id: 'arch-network-007',
    topic_id: 'arch-network',
    type: 'multiple',
    difficulty: 'medium',
    question: 'Which TWO options are valid hybrid networking solutions for securely connecting an on-premises enterprise network to an Azure Virtual Network?',
    options: [
      { id: 'A', text: 'Site-to-Site VPN Gateway' },
      { id: 'B', text: 'Unencrypted public FTP server' },
      { id: 'C', text: 'Azure ExpressRoute' },
      { id: 'D', text: 'Consumer dial-up modem bridge' }
    ],
    correct_option_ids: ['A', 'C'],
    explanation_correct: 'Site-to-Site VPN (encrypted over internet) and Azure ExpressRoute (dedicated private link) are the two primary hybrid connectivity options.',
    explanation_wrong: {
      'B': 'Unencrypted FTP exposes credentials and data across the internet and is not a secure network gateway.',
      'D': 'Dial-up modems do not provide enterprise cloud connectivity.'
    }
  },
  {
    id: 'arch-network-008',
    topic_id: 'arch-network',
    type: 'multiple',
    difficulty: 'hard',
    question: 'Which TWO statements correctly describe the technical benefits of Azure VNet Peering?',
    options: [
      { id: 'A', text: 'Traffic between peered VNets requires setting up complex public encryption certificates' },
      { id: 'B', text: 'Data between peered VNets remains entirely within Microsoft\'s private global network' },
      { id: 'C', text: 'Peered virtual networks must always be located in the exact same physical building' },
      { id: 'D', text: 'Global VNet Peering allows virtual networks in different geographical regions to connect seamlessly' }
    ],
    correct_option_ids: ['B', 'D'],
    explanation_correct: 'VNet Peering uses Microsoft\'s private backbone and supports Global VNet Peering across different geographic Azure regions.',
    explanation_wrong: {
      'A': 'Peering uses private network routing and does not require managing public encryption certificates.',
      'C': 'Global VNet Peering links virtual networks across different cities, countries, and continents.'
    }
  },

  // ==========================================
  // TOPIC 10: arch-storage (8 questions)
  // ==========================================
  {
    id: 'arch-storage-001',
    topic_id: 'arch-storage',
    type: 'single',
    difficulty: 'easy',
    question: 'Which Azure storage service is specifically designed for storing massive amounts of unstructured data such as images, videos, audio, and raw backup files?',
    options: [
      { id: 'A', text: 'Azure Blob Storage' },
      { id: 'B', text: 'Azure Table Storage' },
      { id: 'C', text: 'Azure Cosmos DB Cassandra API' },
      { id: 'D', text: 'Azure Virtual Machine RAM' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'Azure Blob Storage is an object storage solution optimized for storing massive amounts of unstructured data such as text, media, documents, and backups.',
    explanation_wrong: {
      'B': 'Table Storage stores structured NoSQL key-attribute data, not large multimedia objects.',
      'C': 'Cosmos DB is a globally distributed multi-model NoSQL database.',
      'D': 'RAM is volatile temporary computer memory, not persistent cloud storage.'
    }
  },
  {
    id: 'arch-storage-002',
    topic_id: 'arch-storage',
    type: 'single',
    difficulty: 'medium',
    question: 'Which Azure Blob Storage access tier offers the lowest storage cost per gigabyte, but requires several hours of data retrieval latency (rehydration) before files can be read?',
    options: [
      { id: 'A', text: 'Hot tier' },
      { id: 'B', text: 'Cool tier' },
      { id: 'C', text: 'Cold tier' },
      { id: 'D', text: 'Archive tier' }
    ],
    correct_option_ids: ['D'],
    explanation_correct: 'The Archive tier has the lowest storage cost but the highest data retrieval cost, and requires several hours to rehydrate dormant files back to an online tier.',
    explanation_wrong: {
      'A': 'Hot tier has the highest storage cost and sub-second retrieval latency.',
      'B': 'Cool tier is for data accessed infrequently (stored >= 30 days) with immediate online access.',
      'C': 'Cold tier is for rarely accessed data (stored >= 90 days) with immediate online access.'
    }
  },
  {
    id: 'arch-storage-003',
    topic_id: 'arch-storage',
    type: 'single',
    difficulty: 'medium',
    question: 'A healthcare clinic archives patient medical scan records that must be retained for 10 years for legal compliance, but are accessed less than once a year. What access tier should they choose to minimize storage expenses?',
    options: [
      { id: 'A', text: 'Hot access tier' },
      { id: 'B', text: 'Archive access tier' },
      { id: 'C', text: 'Premium SSD tier' },
      { id: 'D', text: 'Transient RAM cache' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'Archive tier is the most cost-effective tier for long-term historical records that can tolerate hours of retrieval latency.',
    explanation_wrong: {
      'A': 'Hot tier is intended for active data read daily, which would unnecessarily increase monthly costs.',
      'C': 'Premium SSD tier is expensive high-performance disk storage for active databases.',
      'D': 'RAM cache is volatile and does not store data persistently for 10 years.'
    }
  },
  {
    id: 'arch-storage-004',
    topic_id: 'arch-storage',
    type: 'single',
    difficulty: 'easy',
    question: 'How many synchronous copies of your data does Locally Redundant Storage (LRS) maintain within a single physical datacenter in the primary region?',
    options: [
      { id: 'A', text: '1 copy' },
      { id: 'B', text: '2 copies' },
      { id: 'C', text: '3 copies' },
      { id: 'D', text: '6 copies' }
    ],
    correct_option_ids: ['C'],
    explanation_correct: 'Locally Redundant Storage (LRS) replicates your data three times within a single physical datacenter in the primary region.',
    explanation_wrong: {
      'A': 'Azure Storage never keeps only 1 copy; minimum redundancy is 3 copies.',
      'B': '2 copies is insufficient for Azure durability standards.',
      'D': '6 copies describes Geo-Redundant Storage (GRS: 3 in primary region + 3 in secondary paired region).'
    }
  },
  {
    id: 'arch-storage-005',
    topic_id: 'arch-storage',
    type: 'true_false',
    difficulty: 'easy',
    question: 'Azure Files provides fully managed cloud file shares that can be mounted simultaneously by on-premises and cloud-hosted Windows, macOS, and Linux systems using standard SMB protocols.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'True. Azure Files offers shared folders accessible via industry-standard Server Message Block (SMB) and NFS protocols.',
    explanation_wrong: {
      'B': 'Azure Files is specifically engineered to replace or supplement legacy on-premises file servers using SMB.'
    }
  },
  {
    id: 'arch-storage-006',
    topic_id: 'arch-storage',
    type: 'single',
    difficulty: 'medium',
    question: 'How many total copies of your data are maintained across regions when using Geo-Redundant Storage (GRS)?',
    options: [
      { id: 'A', text: '3 copies in the primary region only' },
      { id: 'B', text: '6 copies total (3 copies in primary region and 3 copies in secondary paired region)' },
      { id: 'C', text: '12 copies across every continent' },
      { id: 'D', text: '2 copies' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'GRS creates six total replicas: three copies in the primary region using LRS, and three copies asynchronously replicated to a paired secondary region.',
    explanation_wrong: {
      'A': '3 copies in the primary region only is Locally Redundant Storage (LRS).',
      'C': '12 copies across every continent is not a standard redundancy option in Azure Storage.',
      'D': 'Azure Storage redundancy options maintain either 3 copies (LRS/ZRS) or 6 copies (GRS/GZRS).'
    }
  },
  {
    id: 'arch-storage-007',
    topic_id: 'arch-storage',
    type: 'multiple',
    difficulty: 'medium',
    question: 'Which TWO statements correctly describe Zone-Redundant Storage (ZRS)?',
    options: [
      { id: 'A', text: 'Data is replicated synchronously across three separate Availability Zones within the primary region' },
      { id: 'B', text: 'If a single datacenter experiences a flood or power failure, data remains accessible from the other zones' },
      { id: 'C', text: 'Data is copied to a different continent across the Atlantic Ocean' },
      { id: 'D', text: 'ZRS is only compatible with magnetic tape drives' }
    ],
    correct_option_ids: ['A', 'B'],
    explanation_correct: 'ZRS synchronizes data across three distinct Availability Zones in the primary region, providing durability against datacenter-level disasters.',
    explanation_wrong: {
      'C': 'Inter-continental replication describes geo-redundant storage, not intra-region zone redundancy.',
      'D': 'ZRS runs on enterprise solid-state and disk storage hardware, not magnetic tape.'
    }
  },
  {
    id: 'arch-storage-008',
    topic_id: 'arch-storage',
    type: 'multiple',
    difficulty: 'hard',
    question: 'Which TWO tools are commonly used to migrate or copy large volumes of file data into Azure Storage accounts?',
    options: [
      { id: 'A', text: 'AzCopy command-line utility' },
      { id: 'B', text: 'Microsoft Paint' },
      { id: 'C', text: 'Azure Storage Explorer graphical desktop app' },
      { id: 'D', text: 'Windows Media Player' }
    ],
    correct_option_ids: ['A', 'C'],
    explanation_correct: 'AzCopy (high-performance CLI) and Azure Storage Explorer (cross-platform desktop GUI) are standard tools for managing and uploading files to Azure Storage.',
    explanation_wrong: {
      'B': 'Microsoft Paint is a bitmap image drawing application.',
      'D': 'Windows Media Player is an audio/video media player.'
    }
  },

  // ==========================================
  // TOPIC 11: arch-identity (8 questions)
  // ==========================================
  {
    id: 'arch-identity-001',
    topic_id: 'arch-identity',
    type: 'single',
    difficulty: 'easy',
    question: 'What is the fundamental difference between authentication and authorization in cloud security?',
    options: [
      { id: 'A', text: 'Authentication checks what you can do; authorization verifies who you are' },
      { id: 'B', text: 'Authentication verifies identity (who you are); authorization verifies permissions (what resources you can access)' },
      { id: 'C', text: 'Authentication is only used for servers; authorization is only used for mobile phones' },
      { id: 'D', text: 'Authentication requires paying a fee; authorization is always free' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'Authentication (AuthN) confirms identity (e.g., verifying user credentials). Authorization (AuthZ) verifies permissions and access rights for that identity.',
    explanation_wrong: {
      'A': 'This statement reverses the definitions of authentication and authorization.',
      'C': 'Authentication and authorization apply across users, devices, services, and applications universally.',
      'D': 'Neither term is a billing mechanism; both are core security concepts.'
    }
  },
  {
    id: 'arch-identity-002',
    topic_id: 'arch-identity',
    type: 'single',
    difficulty: 'medium',
    question: 'Multi-Factor Authentication (MFA) requires presenting evidence from at least two different verification categories. What are those three categories?',
    options: [
      { id: 'A', text: 'Something you buy, something you sell, something you trade' },
      { id: 'B', text: 'Something you type, something you print, something you mail' },
      { id: 'C', text: 'Something you know, something you have, and something you are' },
      { id: 'D', text: 'Your username, your mother\'s name, and your favorite color' }
    ],
    correct_option_ids: ['C'],
    explanation_correct: 'MFA categories are: something you know (password/PIN), something you have (phone/token/authenticator app), and something you are (biometrics like fingerprint or face recognition).',
    explanation_wrong: {
      'A': 'Commercial commerce transactions are not identity authentication factors.',
      'B': 'Document printing methods are not security authentication factors.',
      'D': 'Username and security questions all fall into a single category: "something you know", which does not fulfill multi-factor requirements.'
    }
  },
  {
    id: 'arch-identity-003',
    topic_id: 'arch-identity',
    type: 'single',
    difficulty: 'hard',
    question: 'What are the three guiding architectural principles of the Zero Trust security model?',
    options: [
      { id: 'A', text: 'Verify explicitly, use least privilege access, and assume breach' },
      { id: 'B', text: 'Trust internal networks, disable passwords, and permit all traffic' },
      { id: 'C', text: 'Lock all doors, turn off electricity, and delete all data' },
      { id: 'D', text: 'Trust administrators, verify guests, and assume zero flaws' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'The Zero Trust model is built on three core pillars: 1. Verify explicitly (always authenticate and authorize based on all signals), 2. Use least privilege access (JIT/JEA), and 3. Assume breach.',
    explanation_wrong: {
      'B': 'Zero Trust explicitly dictates never trusting internal networks simply because of physical location.',
      'C': 'Turning off power and deleting data is not a security architecture.',
      'D': 'Zero Trust does not assume zero flaws; it explicitly assumes the network has already been breached.'
    }
  },
  {
    id: 'arch-identity-004',
    topic_id: 'arch-identity',
    type: 'single',
    difficulty: 'easy',
    question: 'Which security principle mandates that users and applications should only be granted the minimum permissions strictly necessary to complete their job tasks?',
    options: [
      { id: 'A', text: 'Maximum privilege' },
      { id: 'B', text: 'Administrative override' },
      { id: 'C', text: 'Default tenant access' },
      { id: 'D', text: 'Principle of least privilege' }
    ],
    correct_option_ids: ['D'],
    explanation_correct: 'The principle of least privilege ensures users receive only the exact permissions needed for their daily tasks, reducing the blast radius of compromised credentials.',
    explanation_wrong: {
      'A': 'Maximum privilege grants unnecessary administrative power, creating critical security vulnerabilities.',
      'B': 'Administrative override refers to bypassing controls, violating security posture.',
      'C': 'Default tenant access refers to default directory settings, not the least privilege principle.'
    }
  },
  {
    id: 'arch-identity-005',
    topic_id: 'arch-identity',
    type: 'single',
    difficulty: 'medium',
    question: 'Which Microsoft Entra ID feature uses identity signals (such as user role, geographic login location, and device compliance health) to enforce automated access policies like requiring MFA or blocking sign-ins?',
    options: [
      { id: 'A', text: 'Azure ExpressRoute Gateway' },
      { id: 'B', text: 'Conditional Access' },
      { id: 'C', text: 'Azure File Sync' },
      { id: 'D', text: 'Azure Network Watcher' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'Conditional Access evaluates real-time signals (user, location, device, application risk) to enforce automated security decisions such as prompting for MFA or blocking access.',
    explanation_wrong: {
      'A': 'ExpressRoute is a private physical networking circuit.',
      'C': 'Azure File Sync centralizes file shares on-premises, not identity policy enforcement.',
      'D': 'Network Watcher monitors virtual network packets and routing.'
    }
  },
  {
    id: 'arch-identity-006',
    topic_id: 'arch-identity',
    type: 'true_false',
    difficulty: 'easy',
    question: 'Microsoft Entra ID is an exact cloud copy of on-premises Windows Server Active Directory, using identical Kerberos and LDAP domain protocols over physical network ports.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'False. Microsoft Entra ID is a cloud-native identity service using modern web REST APIs and identity protocols like SAML, WS-Federation, OpenID Connect, and OAuth 2.0.',
    explanation_wrong: {
      'A': 'On-premises Active Directory uses Kerberos/LDAP, whereas Entra ID is a cloud identity service utilizing modern web protocols.'
    }
  },
  {
    id: 'arch-identity-007',
    topic_id: 'arch-identity',
    type: 'multiple',
    difficulty: 'medium',
    question: 'Which TWO options are valid secondary authentication verification methods in Microsoft Entra Multi-Factor Authentication?',
    options: [
      { id: 'A', text: 'A push notification approval on the Microsoft Authenticator mobile smartphone app' },
      { id: 'B', text: 'Entering the user\'s favorite childhood hobby' },
      { id: 'C', text: 'A verification code sent via SMS text message or automated voice phone call' },
      { id: 'D', text: 'Writing your primary email password on a physical sticky note' }
    ],
    correct_option_ids: ['A', 'C'],
    explanation_correct: 'Authenticator app push notifications and SMS/voice verification codes qualify as valid "something you have" secondary factors.',
    explanation_wrong: {
      'B': 'Entering a childhood hobby is a security question ("something you know") and does not qualify as a second distinct factor.',
      'D': 'Writing passwords on sticky notes is an egregious security vulnerability.'
    }
  },
  {
    id: 'arch-identity-008',
    topic_id: 'arch-identity',
    type: 'multiple',
    difficulty: 'hard',
    question: 'Which TWO concepts are foundational to the Defense in Depth security strategy implemented across Azure?',
    options: [
      { id: 'A', text: 'Relying exclusively on a single strong perimeter firewall to protect all internal servers' },
      { id: 'B', text: 'Applying multiple independent layers of security controls across physical, identity, network, and data perimeters' },
      { id: 'C', text: 'Assuming that if an attacker penetrates one defensive layer, subsequent inner layers continue to protect assets' },
      { id: 'D', text: 'Eliminating all data backups to prevent unauthorized recovery' }
    ],
    correct_option_ids: ['B', 'C'],
    explanation_correct: 'Defense in depth implements coordinated security layers (physical, identity, perimeter, network, compute, application, data) so that breach of one layer does not compromise the system.',
    explanation_wrong: {
      'A': 'Relying solely on a single perimeter firewall is the opposite of defense in depth; if that firewall is breached, internal assets are unprotected.',
      'D': 'Eliminating data backups destroys business continuity and violates data protection standards.'
    }
  },

  // ==========================================
  // TOPIC 12: gov-cost (8 questions)
  // ==========================================
  {
    id: 'gov-cost-001',
    topic_id: 'gov-cost',
    type: 'single',
    difficulty: 'medium',
    question: 'What is the primary difference between the Azure Pricing Calculator and the Total Cost of Ownership (TCO) Calculator?',
    options: [
      { id: 'A', text: 'The Pricing Calculator calculates electricity; the TCO Calculator calculates water bills' },
      { id: 'B', text: 'The Pricing Calculator is only for educational schools; the TCO Calculator is only for government' },
      { id: 'C', text: 'The Pricing Calculator estimates future monthly Azure resource spending; the TCO Calculator compares on-premises datacenter costs to Azure migration savings' },
      { id: 'D', text: 'The Pricing Calculator pays your monthly bill; the TCO Calculator audits corporate taxes' }
    ],
    correct_option_ids: ['C'],
    explanation_correct: 'The Pricing Calculator estimates prospective monthly costs for Azure services. The TCO Calculator models the financial comparison between running workloads on-premises versus in Azure.',
    explanation_wrong: {
      'A': 'Neither tool calculates municipal utility bills.',
      'B': 'Both tools are publicly accessible to all commercial, educational, and individual users.',
      'D': 'Neither tool processes invoice payments or files corporate taxes.'
    }
  },
  {
    id: 'gov-cost-002',
    topic_id: 'gov-cost',
    type: 'single',
    difficulty: 'easy',
    question: 'Which type of network data transfer is provided free of charge by Azure across all regions?',
    options: [
      { id: 'A', text: 'Inbound data transfer entering Azure datacenters from the internet (ingress)' },
      { id: 'B', text: 'Outbound data transfer leaving Azure datacenters to the public internet (egress)' },
      { id: 'C', text: 'Inter-continental data replication across paired oceanic regions' },
      { id: 'D', text: 'High-speed ExpressRoute outbound video broadcasting' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'Inbound data transfers (ingress) into Azure datacenters are completely free of charge. Azure charges primarily for outbound data transfer (egress).',
    explanation_wrong: {
      'B': 'Outbound data transfer (egress) leaving Azure datacenters is billed per gigabyte.',
      'C': 'Inter-continental data transfer incurs outbound bandwidth fees.',
      'D': 'ExpressRoute egress traffic is billed according to the configured routing plan.'
    }
  },
  {
    id: 'gov-cost-003',
    topic_id: 'gov-cost',
    type: 'true_false',
    difficulty: 'easy',
    question: 'When you apply Resource Tags to an Azure Resource Group, those tags are automatically inherited by all resources contained inside that group.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'False. Resource Tags do NOT inherit automatically from a Resource Group to child resources. To enforce tag inheritance, organizations use Azure Policy.',
    explanation_wrong: {
      'A': 'Unlike RBAC permissions, tags do not inherit down to resources automatically.'
    }
  },
  {
    id: 'gov-cost-004',
    topic_id: 'gov-cost',
    type: 'single',
    difficulty: 'easy',
    question: 'Which tool in the Azure portal allows finance managers to set financial spending thresholds and receive automated email alerts when forecasted or actual spending reaches 80% of budget?',
    options: [
      { id: 'A', text: 'Azure Monitor Log Analytics' },
      { id: 'B', text: 'Azure Network Watcher' },
      { id: 'C', text: 'Microsoft Defender for Cloud' },
      { id: 'D', text: 'Azure Cost Management + Billing' }
    ],
    correct_option_ids: ['D'],
    explanation_correct: 'Azure Cost Management + Billing allows organizations to configure spending budgets and automated budget alerts triggered by actual or forecasted thresholds.',
    explanation_wrong: {
      'A': 'Log Analytics queries technical telemetry logs, not budget email thresholds.',
      'B': 'Network Watcher monitors virtual network packets and connection health.',
      'C': 'Defender for Cloud is a cloud security posture management tool.'
    }
  },
  {
    id: 'gov-cost-005',
    topic_id: 'gov-cost',
    type: 'single',
    difficulty: 'medium',
    question: 'How can an enterprise achieve up to 72% cost savings on steady-state virtual machine workloads compared to standard pay-as-you-go rates?',
    options: [
      { id: 'A', text: 'By renaming virtual machines every 30 days' },
      { id: 'B', text: 'By committing to an Azure Reservation for a one-year or three-year term' },
      { id: 'C', text: 'By disabling all firewall security rules on the VM' },
      { id: 'D', text: 'By hosting VMs exclusively in developer free trial subscriptions' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'Azure Reservations provide substantial discounts (up to 72%) when committing to continuous compute usage over a one-year or three-year duration.',
    explanation_wrong: {
      'A': 'Renaming resources has zero impact on billing rates.',
      'C': 'Disabling firewall rules creates grave security risks and does not alter VM pricing.',
      'D': 'Free trial subscriptions have strict monetary caps and cannot host ongoing enterprise production workloads.'
    }
  },
  {
    id: 'gov-cost-006',
    topic_id: 'gov-cost',
    type: 'single',
    difficulty: 'hard',
    question: 'Why do identical Azure Virtual Machine configurations have slightly different monthly prices across different Azure regions?',
    options: [
      { id: 'A', text: 'Because land, electricity, datacenter construction, and regulatory operational costs vary by geography' },
      { id: 'B', text: 'Because Azure charges extra fees based on the user\'s nationality' },
      { id: 'C', text: 'Because Microsoft randomizes prices every morning to encourage trading' },
      { id: 'D', text: 'Because regions with colder weather receive automatic discounts on computer chips' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'Regional pricing variations reflect real-world economic differences in local real estate, electricity tariffs, labor, taxes, and datacenter construction costs.',
    explanation_wrong: {
      'B': 'Pricing is based on the selected datacenter region, not the end user\'s nationality.',
      'C': 'Azure cloud pricing is structured and published deterministically, not randomized.',
      'D': 'Weather conditions do not determine official Azure published regional rate cards.'
    }
  },
  {
    id: 'gov-cost-007',
    topic_id: 'gov-cost',
    type: 'multiple',
    difficulty: 'medium',
    question: 'Which TWO actions represent effective FinOps cost-optimization strategies in Azure?',
    options: [
      { id: 'A', text: 'Leaving development and testing virtual machines running 24/7 over the weekend' },
      { id: 'B', text: 'Deallocating or automatically shutting down non-production VMs outside business hours' },
      { id: 'C', text: 'Identifying and rightsizing underutilized virtual machines identified by Azure Advisor' },
      { id: 'D', text: 'Creating redundant storage accounts for temporary disposable text files' }
    ],
    correct_option_ids: ['B', 'C'],
    explanation_correct: 'Shutting down idle non-production VMs and following Azure Advisor rightsizing recommendations directly eliminate wasted compute expenditure.',
    explanation_wrong: {
      'A': 'Leaving test VMs running 24/7 wastes compute budgets during hours when no testing occurs.',
      'D': 'Creating redundant storage accounts for disposable files increases storage costs needlessly.'
    }
  },
  {
    id: 'gov-cost-008',
    topic_id: 'gov-cost',
    type: 'multiple',
    difficulty: 'medium',
    question: 'Which TWO use cases are enabled by applying Resource Tags (key-value metadata pairs) to Azure resources?',
    options: [
      { id: 'A', text: 'Grouping and filtering billing reports by department, environment, or cost center' },
      { id: 'B', text: 'Doubling the processor clock speed of attached virtual machines' },
      { id: 'C', text: 'Eliminating the need to purchase storage disk capacity' },
      { id: 'D', text: 'Identifying resource ownership and project association for internal cost allocation' }
    ],
    correct_option_ids: ['A', 'D'],
    explanation_correct: 'Resource Tags provide metadata for department cost tracking, chargeback reporting, environment categorizing (e.g., Environment: Production), and asset ownership.',
    explanation_wrong: {
      'B': 'Tags are metadata labels and have no physical effect on CPU clock frequency.',
      'C': 'Tags do not alter disk storage capacity requirements.'
    }
  },

  // ==========================================
  // TOPIC 13: gov-governance (8 questions)
  // ==========================================
  {
    id: 'gov-governance-001',
    topic_id: 'gov-governance',
    type: 'single',
    difficulty: 'medium',
    question: 'Which Azure governance service continuously evaluates cloud resources against corporate compliance rules and can automatically prevent the deployment of disallowed virtual machine sizes or unapproved regions?',
    options: [
      { id: 'A', text: 'Azure Cost Management' },
      { id: 'B', text: 'Azure Policy' },
      { id: 'C', text: 'Azure Traffic Manager' },
      { id: 'D', text: 'Azure Bastion' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'Azure Policy enforces organizational standards and assesses compliance at scale, allowing companies to block non-compliant deployments (e.g., Restrict Allowed Locations).',
    explanation_wrong: {
      'A': 'Cost Management monitors financial billing, but does not block non-compliant resource deployments.',
      'C': 'Traffic Manager balances network DNS requests across endpoints.',
      'D': 'Azure Bastion provides secure RDP/SSH access to VMs.'
    }
  },
  {
    id: 'gov-governance-002',
    topic_id: 'gov-governance',
    type: 'single',
    difficulty: 'hard',
    question: 'A critical production database has a CanNotDelete Resource Lock applied. An authorized administrator who holds the Owner role at the subscription level attempts to delete the database. What happens?',
    options: [
      { id: 'A', text: 'The deletion fails immediately because Resource Locks override all RBAC permissions until the lock is removed' },
      { id: 'B', text: 'The deletion succeeds immediately because the Owner role has supreme permission over locks' },
      { id: 'C', text: 'The database is moved to the recycle bin for 24 hours' },
      { id: 'D', text: 'Microsoft support is notified to manually approve the deletion' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'Resource Locks override all RBAC permissions: even a Subscription Owner cannot delete a locked resource until an administrator explicitly removes the lock.',
    explanation_wrong: {
      'B': 'Owner role permissions do not bypass Resource Locks; the lock must be deleted first.',
      'C': 'Databases without soft-delete configured are permanently dropped; Azure does not move locked resources to a recycle bin.',
      'D': 'Microsoft support does not approve or manage internal customer resource lock deletions.'
    }
  },
  {
    id: 'gov-governance-003',
    topic_id: 'gov-governance',
    type: 'single',
    difficulty: 'medium',
    question: 'What is the operational effect of applying a "ReadOnly" Resource Lock to an Azure Storage account?',
    options: [
      { id: 'A', text: 'Authorized users can read and write files, but cannot delete the account' },
      { id: 'B', text: 'The storage account is deleted after 30 days of inactivity' },
      { id: 'C', text: 'All storage account keys are permanently revoked' },
      { id: 'D', text: 'Authorized users can read the storage account, but cannot modify, update, or delete its configuration' }
    ],
    correct_option_ids: ['D'],
    explanation_correct: 'A ReadOnly lock prevents any modification, updating, or deletion of the resource, permitting authorized users only to view and read data.',
    explanation_wrong: {
      'A': 'Allowing writes while blocking deletes describes a CanNotDelete lock, not a ReadOnly lock.',
      'B': 'ReadOnly locks do not delete accounts after 30 days.',
      'C': 'Storage account keys are not revoked; access is simply restricted to read operations.'
    }
  },
  {
    id: 'gov-governance-004',
    topic_id: 'gov-governance',
    type: 'single',
    difficulty: 'medium',
    question: 'How does Azure Policy differ from Role-Based Access Control (RBAC)?',
    options: [
      { id: 'A', text: 'Azure Policy is for Linux only; RBAC is for Windows only' },
      { id: 'B', text: 'Azure Policy manages billing invoices; RBAC manages network cables' },
      { id: 'C', text: 'RBAC focuses on WHO has permission to perform actions; Azure Policy focuses on WHAT properties and configurations resources are allowed to have' },
      { id: 'D', text: 'RBAC is deprecated and has been completely replaced by Azure Policy' }
    ],
    correct_option_ids: ['C'],
    explanation_correct: 'RBAC manages user permissions (who can do what). Azure Policy evaluates resource compliance (ensuring resources comply with corporate rules regardless of who deploys them).',
    explanation_wrong: {
      'A': 'Both Azure Policy and RBAC are platform-level cloud governance mechanisms agnostic to OS.',
      'B': 'Neither tool manages invoices or physical network cabling.',
      'D': 'RBAC is active, foundational, and works in tandem with Azure Policy.'
    }
  },
  {
    id: 'gov-governance-005',
    topic_id: 'gov-governance',
    type: 'single',
    difficulty: 'easy',
    question: 'Where can corporate compliance officers download official third-party audit reports, ISO/IEC certifications, SOC reports, and regulatory compliance whitepapers detailing Microsoft\'s cloud security?',
    options: [
      { id: 'A', text: 'The Azure Pricing Calculator' },
      { id: 'B', text: 'The Service Trust Portal' },
      { id: 'C', text: 'The Azure Cloud Shell' },
      { id: 'D', text: 'The public Bing search homepage' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'The Service Trust Portal provides access to official Microsoft compliance reports, external security audits, ISO certifications, and GDPR documentation.',
    explanation_wrong: {
      'A': 'The Pricing Calculator estimates prospective cloud deployment costs.',
      'C': 'Cloud Shell is an administrative command-line terminal.',
      'D': 'The Bing homepage is a public web search engine.'
    }
  },
  {
    id: 'gov-governance-006',
    topic_id: 'gov-governance',
    type: 'single',
    difficulty: 'hard',
    question: 'Which unified data governance solution helps organizations map data estates across on-premises, multicloud, and SaaS environments, automating sensitive data discovery and lineage tracking?',
    options: [
      { id: 'A', text: 'Microsoft Purview' },
      { id: 'B', text: 'Azure Bastion' },
      { id: 'C', text: 'Azure Monitor' },
      { id: 'D', text: 'Azure Logic Apps' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'Microsoft Purview is a comprehensive data governance solution providing automated data discovery, sensitive data classification, and end-to-end data lineage.',
    explanation_wrong: {
      'B': 'Azure Bastion provides secure remote desktop connectivity to VMs.',
      'C': 'Azure Monitor collects performance metrics and operational logs, not data governance lineage.',
      'D': 'Azure Logic Apps is an automated workflow orchestration service.'
    }
  },
  {
    id: 'gov-governance-007',
    topic_id: 'gov-governance',
    type: 'true_false',
    difficulty: 'easy',
    question: 'Applying a CanNotDelete Resource Lock to an Azure Virtual Network prevents administrators from deleting the virtual network while still allowing them to deploy new subnets and resources inside it.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'True. A CanNotDelete lock allows authorized users to read and modify resource configurations, but prevents anyone from deleting the resource.',
    explanation_wrong: {
      'B': 'CanNotDelete locks specifically allow read and write operations while blocking deletion.'
    }
  },
  {
    id: 'gov-governance-008',
    topic_id: 'gov-governance',
    type: 'multiple',
    difficulty: 'medium',
    question: 'Which TWO enterprise rules are typical examples of governance policies that can be enforced using Azure Policy?',
    options: [
      { id: 'A', text: 'Prohibiting employees from eating snacks at their home computer desks' },
      { id: 'B', text: 'Restricting the deployment of new resources to only approved Azure regions (such as South Africa North and West Europe)' },
      { id: 'C', text: 'Enforcing that a specific mandatory Resource Tag (e.g. CostCenter) must be included whenever a new resource is created' },
      { id: 'D', text: 'Requiring all administrators to use an iPhone instead of an Android phone' }
    ],
    correct_option_ids: ['B', 'C'],
    explanation_correct: 'Azure Policy enforces technical resource configuration rules, such as restricting allowed geographic deployment regions and requiring mandatory tags.',
    explanation_wrong: {
      'A': 'Personal employee dining habits are outside the domain of cloud technical governance.',
      'D': 'Personal mobile phone brand preferences cannot be dictated by Azure Policy.'
    }
  },

  // ==========================================
  // TOPIC 14: gov-tools (8 questions)
  // ==========================================
  {
    id: 'gov-tools-001',
    topic_id: 'gov-tools',
    type: 'single',
    difficulty: 'easy',
    question: 'Which management tool provides an authenticated, browser-based command-line terminal directly in the Azure portal with pre-installed command tools like Azure CLI and PowerShell?',
    options: [
      { id: 'A', text: 'Windows Command Prompt on a local PC' },
      { id: 'B', text: 'Azure Cloud Shell' },
      { id: 'C', text: 'PuTTY standalone desktop client' },
      { id: 'D', text: 'Visual Studio Enterprise Edition installer' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'Azure Cloud Shell is an interactive, browser-accessible terminal that requires no local software installation, providing pre-authenticated bash and PowerShell environments.',
    explanation_wrong: {
      'A': 'Windows Command Prompt is a local desktop application that requires manual CLI installation.',
      'C': 'PuTTY is an SSH client that must be downloaded and configured locally.',
      'D': 'Visual Studio is a full integrated development environment, not a lightweight browser terminal.'
    }
  },
  {
    id: 'gov-tools-002',
    topic_id: 'gov-tools',
    type: 'true_false',
    difficulty: 'easy',
    question: 'The Azure Command-Line Interface (Azure CLI) is cross-platform and can be installed and executed on Windows, macOS, and Linux operating systems.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'True. Azure CLI is cross-platform, built with Python, and runs natively on Windows, macOS, Linux, and in containerized environments.',
    explanation_wrong: {
      'B': 'Azure CLI is cross-platform and not restricted to Windows or any single OS.'
    }
  },
  {
    id: 'gov-tools-003',
    topic_id: 'gov-tools',
    type: 'single',
    difficulty: 'medium',
    question: 'Azure Resource Manager (ARM) templates use which syntax style to deploy infrastructure as code, where you specify the desired end state of resources rather than procedural steps?',
    options: [
      { id: 'A', text: 'Imperative procedural scripting' },
      { id: 'B', text: 'Binary machine assembly language' },
      { id: 'C', text: 'Natural conversational prose' },
      { id: 'D', text: 'Declarative JSON syntax' }
    ],
    correct_option_ids: ['D'],
    explanation_correct: 'ARM templates use declarative JSON syntax, allowing you to define WHAT resources should exist without writing procedural code explaining HOW to provision them.',
    explanation_wrong: {
      'A': 'Imperative scripting (e.g. bash or procedural PowerShell) specifies step-by-step commands, unlike declarative templates.',
      'B': 'ARM templates are authored in high-level human-readable JSON or Bicep, not binary machine assembly.',
      'C': 'ARM templates adhere to strict schema-validated JSON formats, not unstructured conversational text.'
    }
  },
  {
    id: 'gov-tools-004',
    topic_id: 'gov-tools',
    type: 'single',
    difficulty: 'medium',
    question: 'What is the primary advantage of authoring Infrastructure as Code using Azure Bicep compared to traditional JSON ARM templates?',
    options: [
      { id: 'A', text: 'Bicep provides cleaner syntax, concise code, and automatic dependency management' },
      { id: 'B', text: 'Bicep templates can only be run on physical Linux mainframes' },
      { id: 'C', text: 'Bicep eliminates all Azure compute costs when deploying VMs' },
      { id: 'D', text: 'Bicep does not require an Azure subscription to provision resources' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'Azure Bicep is a domain-specific language designed to overcome the complexity of JSON ARM templates by offering clean, readable syntax and automatic dependency tracking.',
    explanation_wrong: {
      'B': 'Bicep is cross-platform and runs on any OS supporting the Azure CLI or Bicep CLI.',
      'C': 'Bicep is an authoring tool and has no impact on Azure compute pricing.',
      'D': 'Deploying Bicep templates requires an authenticated Azure subscription.'
    }
  },
  {
    id: 'gov-tools-005',
    topic_id: 'gov-tools',
    type: 'single',
    difficulty: 'hard',
    question: 'An enterprise wants to manage and govern physical Windows and Linux servers running inside its on-premises datacenters directly from the Azure portal using Azure Policy and Azure Monitor. Which service enables this capability?',
    options: [
      { id: 'A', text: 'Azure Front Door' },
      { id: 'B', text: 'Azure Cost Management Export' },
      { id: 'C', text: 'Azure Arc' },
      { id: 'D', text: 'Azure DNS Private Resolver' }
    ],
    correct_option_ids: ['C'],
    explanation_correct: 'Azure Arc bridges on-premises, edge, and multicloud environments into Azure Resource Manager, allowing non-Azure servers and Kubernetes clusters to be governed like native Azure assets.',
    explanation_wrong: {
      'A': 'Azure Front Door is a global web application delivery and load-balancing service.',
      'B': 'Cost Management Export exports financial usage data to storage blobs.',
      'D': 'DNS Private Resolver facilitates conditional DNS forwarding, not server management.'
    }
  },
  {
    id: 'gov-tools-006',
    topic_id: 'gov-tools',
    type: 'single',
    difficulty: 'medium',
    question: 'Which deployment approach describes writing a PowerShell script that contains sequential step-by-step commands (e.g. New-AzResourceGroup, then New-AzVM)?',
    options: [
      { id: 'A', text: 'Declarative approach' },
      { id: 'B', text: 'Imperative approach' },
      { id: 'C', text: 'Stateless approach' },
      { id: 'D', text: 'Zero Trust approach' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'An imperative approach defines the explicit sequence of programmatic steps the system must execute to build resources (specifying HOW).',
    explanation_wrong: {
      'A': 'A declarative approach specifies WHAT the end state should be (as in Bicep or ARM templates) without writing sequential commands.',
      'C': 'Stateless refers to application architecture without persisted session state.',
      'D': 'Zero Trust is an identity and security framework, not a deployment scripting paradigm.'
    }
  },
  {
    id: 'gov-tools-007',
    topic_id: 'gov-tools',
    type: 'multiple',
    difficulty: 'easy',
    question: 'Which TWO command-line tools can administrators install locally on their personal workstations to automate Azure resource management?',
    options: [
      { id: 'A', text: 'Azure CLI (az cmdlets)' },
      { id: 'B', text: 'Adobe Acrobat PDF Reader' },
      { id: 'C', text: 'Azure PowerShell module (Az cmdlets)' },
      { id: 'D', text: 'Spotify Desktop Player' }
    ],
    correct_option_ids: ['A', 'C'],
    explanation_correct: 'Azure CLI and the Azure Az PowerShell module are the two official command-line tools for scripting and managing Azure resources from a local terminal.',
    explanation_wrong: {
      'B': 'Adobe Acrobat is a document viewing tool.',
      'D': 'Spotify is a music streaming application.'
    }
  },
  {
    id: 'gov-tools-008',
    topic_id: 'gov-tools',
    type: 'multiple',
    difficulty: 'hard',
    question: 'Which TWO operational benefits are delivered by adopting Infrastructure as Code (IaC) with Azure Bicep or ARM templates?',
    options: [
      { id: 'A', text: 'Guaranteed 100% elimination of all monthly cloud hosting fees' },
      { id: 'B', text: 'Repeatable, consistent deployments across development, staging, and production environments' },
      { id: 'C', text: 'Disabling multi-factor authentication for all cloud developers' },
      { id: 'D', text: 'Ability to version-control infrastructure definitions inside source code repositories like Git' }
    ],
    correct_option_ids: ['B', 'D'],
    explanation_correct: 'IaC allows infrastructure blueprints to be version-controlled in Git and deployed repeatedly with consistency, preventing configuration drift.',
    explanation_wrong: {
      'A': 'Deploying infrastructure via code does not eliminate Azure resource hosting fees.',
      'C': 'IaC has no impact on MFA policies and never weakens identity security.'
    }
  },

  // ==========================================
  // TOPIC 15: gov-monitor (8 questions)
  // ==========================================
  {
    id: 'gov-monitor-001',
    topic_id: 'gov-monitor',
    type: 'single',
    difficulty: 'medium',
    question: 'Azure Advisor analyzes resource telemetry and configurations to provide actionable recommendations categorized across five architectural pillars. What are those five pillars?',
    options: [
      { id: 'A', text: 'Hardware, Software, Firmware, Middleware, Shareware' },
      { id: 'B', text: 'Reliability (High Availability), Security, Performance, Cost, and Operational Excellence' },
      { id: 'C', text: 'Marketing, Sales, Accounting, Human Resources, Legal' },
      { id: 'D', text: 'Compute, Networking, Storage, Databases, Analytics' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'Azure Advisor organizes guidance across the five pillars of the Azure Well-Architected Framework: Reliability, Security, Performance, Cost, and Operational Excellence.',
    explanation_wrong: {
      'A': 'Software classifications are not architectural evaluation pillars.',
      'C': 'Corporate business departments are not Azure Advisor technical categories.',
      'D': 'Azure service categories (Compute, Storage, etc.) describe services, not Advisor recommendation pillars.'
    }
  },
  {
    id: 'gov-monitor-002',
    topic_id: 'gov-monitor',
    type: 'single',
    difficulty: 'medium',
    question: 'How does Azure Service Health differ from the public Azure Status page?',
    options: [
      { id: 'A', text: 'Azure Service Health is only available on iOS smartphones' },
      { id: 'B', text: 'Azure Service Health requires a paid hardware consultant to read' },
      { id: 'C', text: 'Azure Service Health provides a personalized, customized view notifying you about incidents and maintenance affecting only the specific services and regions your subscription uses' },
      { id: 'D', text: 'Azure Status provides private secret reports; Service Health is public to everyone on the internet' }
    ],
    correct_option_ids: ['C'],
    explanation_correct: 'Azure Status is a public global dashboard showing platform-wide outages, while Azure Service Health provides personalized notifications tailored to your specific resources and regions.',
    explanation_wrong: {
      'A': 'Service Health is a web-based dashboard in the Azure portal accessible from any browser.',
      'B': 'Service Health is built directly into the Azure portal for free.',
      'D': 'This is reversed; Azure Status is public, while Service Health requires an authenticated login.'
    }
  },
  {
    id: 'gov-monitor-003',
    topic_id: 'gov-monitor',
    type: 'single',
    difficulty: 'easy',
    question: 'Which Azure service acts as the central hub for collecting, analyzing, and acting on telemetry data (metrics and logs) from cloud and on-premises environments?',
    options: [
      { id: 'A', text: 'Azure Monitor' },
      { id: 'B', text: 'Azure Key Vault' },
      { id: 'C', text: 'Azure DevTest Labs' },
      { id: 'D', text: 'Azure Data Box' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'Azure Monitor is the comprehensive telemetry solution that ingests metrics and activity/diagnostic logs across Azure infrastructure and applications.',
    explanation_wrong: {
      'B': 'Azure Key Vault secures cryptographic keys, certificates, and secrets.',
      'C': 'Azure DevTest Labs manages temporary developer testing environments.',
      'D': 'Azure Data Box is a physical appliance for offline bulk data migration.'
    }
  },
  {
    id: 'gov-monitor-004',
    topic_id: 'gov-monitor',
    type: 'single',
    difficulty: 'easy',
    question: 'Which query language is used within Azure Log Analytics to write queries, filter system events, and visualize diagnostic log telemetry?',
    options: [
      { id: 'A', text: 'Transact-SQL (T-SQL)' },
      { id: 'B', text: 'JavaScript Object Notation (JSON)' },
      { id: 'C', text: 'HyperText Markup Language (HTML)' },
      { id: 'D', text: 'Kusto Query Language (KQL)' }
    ],
    correct_option_ids: ['D'],
    explanation_correct: 'Log Analytics uses Kusto Query Language (KQL), an expressive, read-only query language optimized for high-performance searching across big data logs.',
    explanation_wrong: {
      'A': 'T-SQL is used for relational SQL databases, not Log Analytics log workspaces.',
      'B': 'JSON is a data interchange serialization format, not a query language.',
      'C': 'HTML is a markup language for structuring web pages.'
    }
  },
  {
    id: 'gov-monitor-005',
    topic_id: 'gov-monitor',
    type: 'single',
    difficulty: 'medium',
    question: 'A development team deploys an e-commerce website on Azure. They want to track live user request response times, detect unhandled code exceptions in real time, and monitor server page failure rates. Which feature of Azure Monitor should they enable?',
    options: [
      { id: 'A', text: 'Azure Storage Archive' },
      { id: 'B', text: 'Application Insights' },
      { id: 'C', text: 'Azure ExpressRoute Direct' },
      { id: 'D', text: 'Azure Policy Compliance Engine' }
    ],
    correct_option_ids: ['B'],
    explanation_correct: 'Application Insights is an Application Performance Monitoring (APM) feature within Azure Monitor that tracks live request rates, response times, exceptions, and user telemetry.',
    explanation_wrong: {
      'A': 'Storage Archive stores cold offline backup files.',
      'C': 'ExpressRoute Direct provides high-speed private networking connections.',
      'D': 'Azure Policy evaluates resource configuration compliance, not code runtime exceptions.'
    }
  },
  {
    id: 'gov-monitor-006',
    topic_id: 'gov-monitor',
    type: 'true_false',
    difficulty: 'easy',
    question: 'Azure Advisor can automatically identify underutilized or idle virtual machines and recommend resizing or shutting them down to reduce monthly compute spending.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correct_option_ids: ['A'],
    explanation_correct: 'True. Under its Cost pillar, Azure Advisor identifies virtual machines with low CPU or network utilization and recommends shutdown or resizing.',
    explanation_wrong: {
      'B': 'Cost optimization recommendations are one of the most prominent features of Azure Advisor.'
    }
  },
  {
    id: 'gov-monitor-007',
    topic_id: 'gov-monitor',
    type: 'multiple',
    difficulty: 'medium',
    question: 'Which TWO primary data types are ingested and analyzed by Azure Monitor?',
    options: [
      { id: 'A', text: 'Metrics (numerical values describing system aspects at a specific point in time)' },
      { id: 'B', text: 'Physical paper receipts mailed from retail hardware stores' },
      { id: 'C', text: 'Logs (structured or unstructured diagnostic events with timestamps)' },
      { id: 'D', text: 'Raw video footage from personal employee home webcams' }
    ],
    correct_option_ids: ['A', 'C'],
    explanation_correct: 'Azure Monitor is built on two core telemetry data types: Metrics (numerical time-series values like CPU %) and Logs (timestamped diagnostic event records).',
    explanation_wrong: {
      'B': 'Azure Monitor ingests digital cloud telemetry, not physical paper mail.',
      'D': 'Employee personal webcam video is not ingested by telemetry monitoring platforms.'
    }
  },
  {
    id: 'gov-monitor-008',
    topic_id: 'gov-monitor',
    type: 'multiple',
    difficulty: 'hard',
    question: 'Which TWO capabilities are provided by Azure Service Health to assist operations teams during platform maintenance?',
    options: [
      { id: 'A', text: 'Automatically buying replacement server hardware on Amazon' },
      { id: 'B', text: 'Informing teams about scheduled planned maintenance that might impact specific virtual machines' },
      { id: 'C', text: 'Sending automated alerts when an outage incident affects a cloud service in their region' },
      { id: 'D', text: 'Guaranteed prevention of all power failures across the city electrical grid' }
    ],
    correct_option_ids: ['B', 'C'],
    explanation_correct: 'Service Health provides advance notices of planned platform maintenance and real-time alerts regarding active incidents affecting your specific subscription resources.',
    explanation_wrong: {
      'A': 'Microsoft maintains its own datacenters and does not purchase hardware via third-party retail sites.',
      'D': 'Service Health provides observability and alerting; it cannot control municipal electrical power grids.'
    }
  }
]

// Output path
const outputPath = path.resolve(__dirname, '..', 'src', 'content', 'questions.json')
fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2), 'utf-8')
console.log(`Successfully generated ${questions.length} questions in ${outputPath}`)
