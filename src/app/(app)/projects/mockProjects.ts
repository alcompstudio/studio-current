// src/app/(app)/projects/mockProjects.ts
import type { Project } from "@/lib/types";

// Mock project data (can be expanded)
export const mockProjects: Project[] = [
  { id: "proj_1", name: "E-commerce Platform Revamp", description: "Complete overhaul of the existing online store.", status: "In Progress", clientName: "RetailCo", budget: 15000, currency: "USD", createdAt: new Date(2023, 10, 1), updatedAt: new Date(), clientId: "client_1" },
  { id: "proj_2", name: "Mobile Banking App", description: "Develop a native mobile app for iOS and Android.", status: "Planning", clientName: "FinTech Solutions", budget: 25000, currency: "USD", createdAt: new Date(2023, 9, 15), updatedAt: new Date(), clientId: "client_2" },
  { id: "proj_3", name: "Content Marketing Strategy", description: "Create a 6-month content plan and initial articles.", status: "Completed", clientName: "Startup Hub", budget: 5000, currency: "EUR", createdAt: new Date(2023, 8, 20), updatedAt: new Date(2023, 11, 5), clientId: "client_3" },
  { id: "proj_4", name: "Cloud Migration Assessment", description: "Analyze current infrastructure and propose cloud solutions.", status: "In Progress", clientName: "Enterprise Corp", budget: 8000, currency: "USD", createdAt: new Date(2023, 11, 1), updatedAt: new Date(), clientId: "client_4" },
  { id: "proj_5", name: "Social Media Campaign", description: "Run a targeted ad campaign on Facebook and Instagram.", status: "On Hold", clientName: "Local Cafe", budget: 2000, currency: "USD", createdAt: new Date(2023, 7, 10), updatedAt: new Date(), clientId: "client_5" },
  { id: "proj_6", name: "Internal HR Portal", description: "Build a web portal for employee management.", status: "In Progress", clientName: "Manufacturing Inc.", budget: 18000, currency: "EUR", createdAt: new Date(2023, 10, 25), updatedAt: new Date(), clientId: "client_6" },
  { id: "proj_7", name: "Data Analytics Dashboard", description: "Visualize sales data using Power BI.", status: "Completed", clientName: "SalesBoost", budget: 6000, currency: "USD", createdAt: new Date(2023, 6, 5), updatedAt: new Date(2023, 10, 15), clientId: "client_7" },
  { id: "proj_8", name: "Brand Identity Design", description: "Develop a new logo, color palette, and brand guidelines.", status: "Planning", clientName: "New Venture", budget: 4500, currency: "RUB", createdAt: new Date(2023, 11, 10), updatedAt: new Date(), clientId: "client_8" },
  { id: "proj_9", name: "SEO Optimization Project", description: "Improve search engine rankings for the company website.", status: "In Progress", clientName: "Service Pro", budget: 7000, currency: "USD", createdAt: new Date(2023, 9, 5), updatedAt: new Date(), clientId: "client_9" },
  { id: "proj_10", name: "API Integration", description: "Connect third-party CRM with internal systems.", status: "On Hold", clientName: "Tech Innovate", budget: 9500, currency: "EUR", createdAt: new Date(2023, 8, 1), updatedAt: new Date(), clientId: "client_10" },
];
