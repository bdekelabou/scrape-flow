const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userId = "user_3Hrd5sgE4M59ExkxCl8KlAisCEl";

  const defaultDefinition = JSON.stringify({
    nodes: [
      {
        id: "node-1",
        type: "FlowScrapeNode",
        dragHandle: ".drag-handle",
        data: { type: "LAUNCH_BROWSER", inputs: { "Website Url": "https://example.com" } },
        position: { x: 100, y: 100 }
      },
      {
        id: "node-2",
        type: "FlowScrapeNode",
        dragHandle: ".drag-handle",
        data: { type: "PAGE_TO_HTML", inputs: {} },
        position: { x: 550, y: 100 }
      }
    ],
    edges: [
      {
        id: "edge-1",
        source: "node-1",
        sourceHandle: "Web page",
        target: "node-2",
        targetHandle: "Web page",
        animated: true
      }
    ],
    viewport: { x: 0, y: 0, zoom: 1 }
  });

  const workflowsToCreate = [
    {
      name: "Demo",
      description: "Demo workflow for web scraping",
      status: "PUBLISHED",
      cron: "0 * * * *",
      lastRunStatus: "FAILED",
      lastRunAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      creditsCost: 9,
      definition: defaultDefinition
    },
    {
      name: "New demo",
      description: "New demo workflow test",
      status: "PUBLISHED",
      cron: "0 * * * *",
      lastRunStatus: "COMPLETED",
      lastRunAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      creditsCost: 5,
      definition: defaultDefinition
    },
    {
      name: "Test runs",
      description: "Test runs workflow",
      status: "PUBLISHED",
      cron: "*/2 * * * *",
      lastRunStatus: "FAILED",
      lastRunAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      creditsCost: 5,
      definition: defaultDefinition
    },
    {
      name: "Test duplicate",
      description: "Duplicated workflow sample",
      status: "DRAFT",
      creditsCost: 0,
      definition: defaultDefinition
    },
    {
      name: "ToScrapeLogin",
      description: "Scrape login form demo",
      status: "DRAFT",
      creditsCost: 0,
      definition: defaultDefinition
    }
  ];

  for (const wf of workflowsToCreate) {
    await prisma.workflow.upsert({
      where: {
        name_userId: {
          name: wf.name,
          userId: userId
        }
      },
      update: {
        status: wf.status,
        cron: wf.cron || null,
        lastRunStatus: wf.lastRunStatus || null,
        lastRunAt: wf.lastRunAt || null,
        creditsCost: wf.creditsCost || 0,
        definition: wf.definition
      },
      create: {
        userId,
        name: wf.name,
        description: wf.description,
        status: wf.status,
        cron: wf.cron || null,
        lastRunStatus: wf.lastRunStatus || null,
        lastRunAt: wf.lastRunAt || null,
        creditsCost: wf.creditsCost || 0,
        definition: wf.definition
      }
    });
  }

  console.log("Successfully seeded demo workflows for user:", userId);
}

main().catch(console.error).finally(() => prisma.$disconnect());
