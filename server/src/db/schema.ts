import {
    pgEnum,
    pgTable,
    uuid,
    varchar,
    index,
    timestamp,
    boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

/* ================= ENUMS ================= */

export const UserRole = pgEnum("user_role", ["USER", "ADMIN"]);

export const FilePermissionType = pgEnum("file_permission_type", [
    "PUBLIC",
    "PRIVATE",
    "RESTRICTED",
]);

export const FileType = pgEnum("file_type", [
    "IMAGE",
    "DOCUMENT",
    "VIDEO",
    "AUDIO",
    "OTHER",
]);

/* ================= USERS ================= */

export const users = pgTable(
    "users",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        username: varchar("username", { length: 255 }).notNull(),
        email: varchar("email", { length: 255 }).notNull().unique(),
        password: varchar("password", { length: 255 }).notNull(),

        role: UserRole("role").notNull().default("USER"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => {
        return {
            emailIndex: index("users_email_idx").on(table.email),
        };
    }
);

/* ================= FOLDERS ================= */

export const folders = pgTable(
    "folders",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        name: varchar("name", { length: 255 }).notNull(),

        ownerId: uuid("owner_id")
            .notNull()
            .references(() => users.id),

        parentId: uuid("parent_id").references(():any => folders.id),

        permission: FilePermissionType("permission")
            .notNull()
            .default("PRIVATE"),

        // soft delete
        isDeleted: boolean("is_deleted").default(false),
        deletedAt: timestamp("deleted_at"),

        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => {
        return {
            ownerIdx: index("folders_owner_idx").on(table.ownerId),
            parentIdx: index("folders_parent_idx").on(table.parentId),
        };
    }
);

/* ================= FILES ================= */

export const files = pgTable(
    "files",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        name: varchar("name", { length: 255 }).notNull(),

        ownerId: uuid("owner_id")
            .notNull()
            .references(() => users.id),

        folderId: uuid("folder_id").references(() => folders.id),

        permission: FilePermissionType("permission")
            .notNull()
            .default("PRIVATE"),

        fileType: FileType("file_type").notNull().default("OTHER"),

        // metadata
        size: varchar("size", { length: 50 }),
        mimeType: varchar("mime_type", { length: 100 }),
        storagePath: varchar("storage_path", { length: 500 }).notNull(),

        // soft delete
        isDeleted: boolean("is_deleted").default(false),
        deletedAt: timestamp("deleted_at"),

        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => {
        return {
            ownerIdx: index("files_owner_idx").on(table.ownerId),
            folderIdx: index("files_folder_idx").on(table.folderId),
        };
    }
);


/* ================= USERS RELATIONS ================= */

export const usersRelations = relations(users, ({ many }) => ({
    folders: many(folders),
    files: many(files),
}));

/* ================= FOLDERS RELATIONS ================= */

export const foldersRelations = relations(folders, ({ one, many }) => ({
    owner: one(users, {
        fields: [folders.ownerId],
        references: [users.id],
    }),

    parent: one(folders, {
        fields: [folders.parentId],
        references: [folders.id],
        relationName: "folderHierarchy",
    }),

    children: many(folders, {
        relationName: "folderHierarchy",
    }),

    files: many(files),
}));

/* ================= FILES RELATIONS ================= */

export const filesRelations = relations(files, ({ one }) => ({
    owner: one(users, {
        fields: [files.ownerId],
        references: [users.id],
    }),

    folder: one(folders, {
        fields: [files.folderId],
        references: [folders.id],
    }),
}));