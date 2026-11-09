"""
SecuTrack Database Inspector (Read-Only)
----------------------------------------
Safe, read-only utility to inspect SQLite tables, schemas, and records
for the SecuTrack Cybersecurity Risk Management System.

Safety Guarantees:
- Opens database exclusively in read-only URI mode (?mode=ro).
- Executes SELECT and PRAGMA queries only.
- Masks sensitive credentials (password hashes).
- Never modifies, drops, creates, or reseeds tables or records.
"""

import os
import sys
import sqlite3

# Determine database location relative to backend directory
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(SCRIPT_DIR, 'secutrack.db')

def get_connection():
    if not os.path.exists(DB_FILE):
        return None, f"Database file not found at: {DB_FILE}"
    try:
        # Enforce read-only mode at SQLite engine level
        conn_uri = f"file:{os.path.abspath(DB_FILE)}?mode=ro"
        conn = sqlite3.connect(conn_uri, uri=True)
        conn.row_factory = sqlite3.Row
        return conn, None
    except Exception as e:
        return None, f"Failed to open database in read-only mode: {e}"

def get_tables(conn):
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
        )
        return [row[0] for row in cursor.fetchall()], None
    except Exception as e:
        return [], str(e)

def get_table_count(conn, table_name):
    try:
        cursor = conn.cursor()
        cursor.execute(f'SELECT COUNT(*) FROM "{table_name}";')
        return cursor.fetchone()[0]
    except Exception:
        return 0

def get_table_schema(conn, table_name):
    try:
        cursor = conn.cursor()
        cursor.execute(f'PRAGMA table_info("{table_name}");')
        # cid, name, type, notnull, dflt_value, pk
        return cursor.fetchall(), None
    except Exception as e:
        return [], str(e)

def get_table_records(conn, table_name, limit=100):
    try:
        cursor = conn.cursor()
        cursor.execute(f'SELECT * FROM "{table_name}" LIMIT {limit};')
        rows = cursor.fetchall()
        cols = [desc[0] for desc in cursor.description] if cursor.description else []
        return cols, rows, None
    except Exception as e:
        return [], [], str(e)

def mask_cell(col_name, val):
    if val is None:
        return "NULL"
    s = str(val)
    # Mask password hashes or authentication secrets
    if 'password' in col_name.lower() or 'secret' in col_name.lower():
        if len(s) > 12:
            return s[:7] + "..." + " [HASH MASKED]"
        return "[PROTECTED]"
    # Clean up multi-line values for table view
    s = s.replace("\r", " ").replace("\n", " ")
    if len(s) > 36:
        return s[:33] + "..."
    return s

def format_records_table(cols, rows, max_rows=50):
    if not rows:
        return "  (No records found in this table)\n"

    # Determine column widths
    widths = {}
    for col in cols:
        widths[col] = max(len(col), 4)

    display_rows = rows[:max_rows]
    formatted_data = []
    for r in display_rows:
        row_dict = {}
        for col in cols:
            val_str = mask_cell(col, r[col])
            widths[col] = min(max(widths[col], len(val_str)), 38)
            row_dict[col] = val_str
        formatted_data.append(row_dict)

    # Build border and header
    sep = "+-" + "-+-".join("-" * widths[col] for col in cols) + "-+"
    header = "| " + " | ".join(col.ljust(widths[col])[:widths[col]] for col in cols) + " |"
    
    lines = [sep, header, sep]
    for row in formatted_data:
        line = "| " + " | ".join(row[col].ljust(widths[col])[:widths[col]] for col in cols) + " |"
        lines.append(line)
    lines.append(sep)
    
    if len(rows) > max_rows:
        lines.append(f"  ... [Showing first {max_rows} of {len(rows)} records]")
    return "\n".join(lines) + "\n"

def print_record_detail(conn, table_name, record_id):
    cursor = conn.cursor()
    # Check if 'id' exists in table
    cursor.execute(f'PRAGMA table_info("{table_name}");')
    cols = [r['name'] for r in cursor.fetchall()]
    id_col = 'id' if 'id' in cols else cols[0]
    
    cursor.execute(f'SELECT * FROM "{table_name}" WHERE "{id_col}" = ? LIMIT 1;', (record_id,))
    row = cursor.fetchone()
    if not row:
        print(f"\n[!] Record with {id_col}={record_id} not found in table '{table_name}'.\n")
        return

    print("\n" + "=" * 80)
    print(f"  RECORD DETAIL: {table_name} ({id_col} = {record_id})")
    print("=" * 80)
    for col in cols:
        val = row[col]
        if 'password' in col.lower() or 'secret' in col.lower():
            display_val = "[BCRYPT HASH PROTECTED]"
        elif val is None:
            display_val = "NULL"
        else:
            display_val = str(val)
        print(f"  {col.ljust(25)} : {display_val}")
    print("=" * 80 + "\n")

def inspect_table_view(conn, table_name):
    while True:
        total_records = get_table_count(conn, table_name)
        schema, err_schema = get_table_schema(conn, table_name)
        cols, rows, err_rows = get_table_records(conn, table_name)

        print("\n" + "=" * 80)
        print(f"  SECUTRACK DATABASE INSPECTOR :: TABLE [{table_name.upper()}]")
        print("=" * 80)
        print(f"  Database Path: {DB_FILE} (Read-Only)")
        print(f"  Total Records: {total_records}")
        print("-" * 80)

        # Print Schema
        print("\n-- TABLE SCHEMA --")
        if err_schema:
            print(f"  [!] Error reading schema: {err_schema}")
        else:
            print(f"  {'#':<4} {'COLUMN NAME':<25} {'DATA TYPE':<18} {'NOT NULL':<10} {'PRIMARY KEY':<12} {'DEFAULT'}")
            print("  " + "-" * 76)
            for idx, col in enumerate(schema, 1):
                col_name = col['name']
                col_type = col['type'] or 'TEXT'
                notnull = "Yes" if col['notnull'] else "No"
                pk = "Yes (PK)" if col['pk'] else "No"
                dflt = str(col['dflt_value']) if col['dflt_value'] is not None else "None"
                print(f"  {idx:<4} {col_name:<25} {col_type:<18} {notnull:<10} {pk:<12} {dflt}")

        # Print Records
        print(f"\n-- EXISTING RECORDS ({min(len(rows), 50)} of {total_records}) --")
        if err_rows:
            print(f"  [!] Error fetching records: {err_rows}")
        else:
            print(format_records_table(cols, rows))

        print("-" * 80)
        print("Options:")
        print("  [V <id>] View single record in full vertical detail (e.g. 'v 1')")
        print("  [B]      Back to table menu")
        print("  [Q]      Exit inspector")
        print("-" * 80)

        try:
            choice = input("Enter choice: ").strip()
        except (KeyboardInterrupt, EOFError):
            return False

        if not choice or choice.lower() == 'b':
            return True
        elif choice.lower() == 'q':
            return False
        elif choice.lower().startswith('v'):
            parts = choice.split()
            if len(parts) >= 2:
                rec_id = parts[1]
                print_record_detail(conn, table_name, rec_id)
                input("Press [Enter] to continue...")
            else:
                print("\n[!] Please specify a record ID (e.g. 'v 1').")
                input("Press [Enter] to continue...")
        else:
            print(f"\n[!] Unrecognized option '{choice}'.")
            input("Press [Enter] to continue...")

def main():
    conn, err = get_connection()
    if err:
        print("\n" + "=" * 80)
        print("  SECUTRACK DATABASE INSPECTOR :: ERROR")
        print("=" * 80)
        print(f"\n[ERROR] {err}\n")
        print("Please ensure the SecuTrack backend database has been initialized.")
        print("=" * 80 + "\n")
        sys.exit(1)

    try:
        while True:
            tables, err_tables = get_tables(conn)
            if err_tables:
                print(f"\n[ERROR] Failed to query database tables: {err_tables}\n")
                break

            if not tables:
                print(f"\n[!] Database at {DB_FILE} is accessible but contains no user tables.\n")
                break

            print("\n" + "=" * 80)
            print("  SECUTRACK DATABASE INSPECTOR (READ-ONLY)")
            print("=" * 80)
            print(f"  Database Engine: SQLite 3")
            print(f"  Database File:   {DB_FILE}")
            print(f"  Access Mode:     Strict Read-Only (?mode=ro)")
            print(f"  Total Tables:    {len(tables)}")
            print("=" * 80)
            print("\nAvailable Database Tables:")
            for idx, table in enumerate(tables, 1):
                count = get_table_count(conn, table)
                print(f"  [{idx}] {table:<22} ({count} records)")
            print("\n  [0] Exit Inspector")
            print("-" * 80)

            try:
                choice = input(f"Select a table number (1-{len(tables)}) or 0 to exit: ").strip()
            except (KeyboardInterrupt, EOFError):
                break

            if choice in ('0', 'q', 'Q', 'exit'):
                break

            if not choice.isdigit():
                print(f"\n[!] Invalid input '{choice}'. Please enter a number between 1 and {len(tables)}.")
                input("Press [Enter] to continue...")
                continue

            num = int(choice)
            if num < 1 or num > len(tables):
                print(f"\n[!] Table selection out of range. Please choose between 1 and {len(tables)}.")
                input("Press [Enter] to continue...")
                continue

            selected_table = tables[num - 1]
            should_continue = inspect_table_view(conn, selected_table)
            if not should_continue:
                break

    finally:
        if conn:
            conn.close()
    
    print("\nExiting SecuTrack Database Inspector. Goodbye.\n")

if __name__ == '__main__':
    main()

