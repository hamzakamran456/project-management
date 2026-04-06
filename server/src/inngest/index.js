// import { Inngest } from "inngest";
// import prisma from "../../configs/prisma.js";

// // Create a client to send and receive events
// export const inngest = new Inngest({ id: "project-management" });

// // Inngest Function to save user data to a Database
// const syncUserCreation = inngest.createFunction(
//   {
//     id: "sync-user-from-clerk",
//     triggers: { event: "clerk/user.created" },
//   },
//   async ({ event }) => {
//     const { data } = event;
//     await prisma.user.create({
//       data: {
//         id: data.id,
//         email: data?.email_addresses?.[0]?.email_address,
//         name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
//         image: data?.image_url,
//       },
//     });
//   },
// );

// // Inngest Function to delete user from Database
// const syncUserDeletion = inngest.createFunction(
//   {
//     id: "delete-user-with-clerk",
//     triggers: { event: "clerk/user.deleted" },
//   },
//   async ({ event }) => {
//     const { data } = event;
//     await prisma.user.delete({
//       where: {
//         id: data.id,
//       },
//     });
//   },
// );

// // Inngest Function to update user data in Database
// const syncUserUpdation = inngest.createFunction(
//   {
//     id: "update-user-from-clerk",
//     triggers: { event: "clerk/user.updated" },
//   },
//   async ({ event }) => {
//     const { data } = event;
//     await prisma.user.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         email: data?.email_addresses?.[0]?.email_address,
//         name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
//         image: data?.image_url,
//       },
//     });
//   },
// );

// // Inngest Function to save workspace data to a Database
// const syncWorkspaceCreation = inngest.createFunction(
//   { id: "sync-workspace-from-clerk" },
//   { event: "clerk/organization.created" },
//   async ({ event }) => {
//     const data = event;
//     await prisma.workspace.create({
//       data: {
//         id: data.id,
//         name: data.name,
//         slug: data.slug,
//         ownerId: data.created_by,
//         image_url: data.image_url,
//       },
//     });

//     // Add creator as Admin member
//     await prisma.workspaceMember.create({
//       data: {
//         userId: data.created_by,
//         workspaceId: data.id,
//         role: "ADMIN",
//       },
//     });
//   },
// );

// // Inngest Function to update workspace data  to a Database
// const syncWorkspaceUpdation = inngest.createFunction(
//   { id: "update-workspace-from-clerk" },
//   { event: "clerk/organization.updated" },
//   async ({ event }) => {
//     const { data } = event;
//     await prisma.workspace.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         name: data.name,
//         slug: data.slug,
//         image_url: data.image_url,
//       },
//     });
//   },
// );

// // Inngest Function to delete workspace data from a Database
// const syncWorkspaceDeletion = inngest.createFunction(
//   { id: "delete-workspace-from-clerk" },
//   { event: "clerk/organization.deleted" },
//   async ({ event }) => {
//     const { data } = event;
//     await prisma.workspace.delete({
//       where: {
//         id: data.id,
//       },
//     });
//   },
// );

// // Inngest Function to save workspace member data to a Database
// const syncWorkspaceMemberCreation = inngest.createFunction(
//   { id: "sync-workspace-member-from-clerk" },
//   { event: "clerk/organizationInvitation.accepted" },
//   async ({ event }) => {
//     const { data } = event;
//     await prisma.workspaceMember.created({
//       data: {
//         userId: data.user_id,
//         workspaceId: data.organization_id,
//         role: String(data.role_name).toLowerCase(),
//       },
//     });
//   },
// );

// // Create an empty array where we'll export future Inngest functions
// export const functions = [
//   syncUserCreation,
//   syncUserDeletion,
//   syncUserUpdation,
//   syncWorkspaceCreation,
//   syncWorkspaceDeletion,
//   syncWorkspaceMemberCreation,
//   syncWorkspaceUpdation,
// ];

import { Inngest } from "inngest";
import prisma from "../../configs/prisma.js";

// Create Inngest client
export const inngest = new Inngest({ id: "project-management" });

/* =========================
   USER FUNCTIONS
========================= */

// Create / Sync User
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      await prisma.user.upsert({
        where: { id: data.id },
        update: {
          email: data?.email_addresses?.[0]?.email_address || "",
          name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
          image: data?.image_url,
        },
        create: {
          id: data.id,
          email: data?.email_addresses?.[0]?.email_address || "",
          name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
          image: data?.image_url,
        },
      });

      console.log("User synced:", data.id);
    } catch (err) {
      console.error("User creation error:", err);
      throw err;
    }
  },
);

// Delete User
const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      await prisma.user.deleteMany({
        where: { id: data.id },
      });

      console.log("User deleted:", data.id);
    } catch (err) {
      console.error("User deletion error:", err);
      throw err;
    }
  },
);

// Update User
const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      await prisma.user.updateMany({
        where: { id: data.id },
        data: {
          email: data?.email_addresses?.[0]?.email_address || "",
          name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
          image: data?.image_url,
        },
      });

      console.log("User updated:", data.id);
    } catch (err) {
      console.error("User update error:", err);
      throw err;
    }
  },
);

/* =========================
   WORKSPACE FUNCTIONS
========================= */

// Create Workspace
const syncWorkspaceCreation = inngest.createFunction(
  {
    id: "sync-workspace-from-clerk",
    triggers: [{ event: "clerk/organization.created" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      await prisma.workspace.upsert({
        where: { id: data.id },
        update: {
          name: data.name,
          slug: data.slug,
          image_url: data.image_url,
        },
        create: {
          id: data.id,
          name: data.name,
          slug: data.slug,
          ownerId: data.created_by,
          image_url: data.image_url,
        },
      });

      // Add creator as admin
      await prisma.workspaceMember.upsert({
        where: {
          userId_workspaceId: {
            userId: data.created_by,
            workspaceId: data.id,
          },
        },
        update: {},
        create: {
          userId: data.created_by,
          workspaceId: data.id,
          role: "ADMIN",
        },
      });

      console.log("Workspace created:", data.id);
    } catch (err) {
      console.error("Workspace creation error:", err);
      throw err;
    }
  },
);

// Update Workspace
const syncWorkspaceUpdation = inngest.createFunction(
  {
    id: "update-workspace-from-clerk",
    triggers: [{ event: "clerk/organization.updated" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      await prisma.workspace.updateMany({
        where: { id: data.id },
        data: {
          name: data.name,
          slug: data.slug,
          image_url: data.image_url,
        },
      });

      console.log("Workspace updated:", data.id);
    } catch (err) {
      console.error("Workspace update error:", err);
      throw err;
    }
  },
);

// Delete Workspace
const syncWorkspaceDeletion = inngest.createFunction(
  {
    id: "delete-workspace-from-clerk",
    triggers: [{ event: "clerk/organization.deleted" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      await prisma.workspace.deleteMany({
        where: { id: data.id },
      });

      console.log("Workspace deleted:", data.id);
    } catch (err) {
      console.error("Workspace deletion error:", err);
      throw err;
    }
  },
);

/* =========================
   WORKSPACE MEMBER
========================= */

const syncWorkspaceMemberCreation = inngest.createFunction(
  {
    id: "sync-workspace-member-from-clerk",
    triggers: [{ event: "clerk/organizationInvitation.accepted" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      await prisma.workspaceMember.upsert({
        where: {
          userId_workspaceId: {
            userId: data.user_id,
            workspaceId: data.organization_id,
          },
        },
        update: {
          role: String(data.role_name).toUpperCase(),
        },
        create: {
          userId: data.user_id,
          workspaceId: data.organization_id,
          role: String(data.role_name).toUpperCase(),
        },
      });

      console.log("Workspace member added:", data.user_id);
    } catch (err) {
      console.error("Workspace member error:", err);
      throw err;
    }
  },
);

/* =========================
   EXPORT ALL FUNCTIONS
========================= */

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  syncWorkspaceCreation,
  syncWorkspaceUpdation,
  syncWorkspaceDeletion,
  syncWorkspaceMemberCreation,
];
