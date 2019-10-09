import psycopg2
from psycopg2 import sql
import psycopg2.extras
from server.database import get_connection, compose_order_by

def get_gcodes(order_by=None):
    columns = ["id", "path", "filename", "display", "absolute_path", "uploaded", "size"]
    with get_connection() as connection:
        cursor = connection.cursor(cursor_factory=psycopg2.extras.DictCursor)
        statement = sql.SQL(' ').join([
            sql.SQL("SELECT {} FROM gcodes").format(sql.SQL(', ').join([sql.Identifier(c) for c in columns])),
            compose_order_by(columns, order_by)
        ])
        cursor.execute(statement)
        data = cursor.fetchall()
        cursor.close()
        return data

def get_gcode(id):
    try:
        if isinstance(id, str):
            id = int(id, base=10)
    except ValueError:
        return None
    with get_connection() as connection:
        cursor = connection.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute("SELECT id, path, filename, display, absolute_path, uploaded, size from gcodes where id = %s", (id,))
        data = cursor.fetchone()
        cursor.close()
        return data

def add_gcode(**kwargs):
    with get_connection() as connection:
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO gcodes (path, filename, display, absolute_path, size) values (%s, %s, %s, %s, %s) RETURNING id",
            (
                kwargs["path"], kwargs["filename"], kwargs["display"], kwargs["absolute_path"], kwargs["size"]
            )
        )
        data = cursor.fetchone()
        cursor.close()
        return data[0]

def delete_gcode(id):
    try:
        if isinstance(id, str):
            id = int(id, base=10)
    except ValueError:
        pass
    with get_connection() as connection:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM gcodes WHERE id = %s", (id,))
        cursor.close()
