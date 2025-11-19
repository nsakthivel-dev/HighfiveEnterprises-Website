# Database Migrations

This folder contains SQL migration scripts for the HighFive Enterprises database.

## How to Apply Migrations

### Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Open the migration file (e.g., `add_project_id_to_feedback.sql`)
4. Copy and paste the SQL content into the SQL Editor
5. Click "Run" to execute the migration
6. Verify the results in the output panel

### Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

## Migration Files

### `add_project_id_to_feedback.sql`
**Purpose:** Adds project association to feedback entries

**What it does:**
- Adds a `project_id` column to the `feedback` table
- Creates a foreign key relationship to the `projects` table
- Adds an index for better query performance
- Allows feedback to be linked to specific projects (NULL = general feedback)

**When to run:** Before deploying the project feedback feature

## Verification

After running a migration, you can verify it was successful by checking:
1. The output in the SQL Editor shows no errors
2. The new column appears in the table schema
3. The verification query at the end of each migration returns the expected results
