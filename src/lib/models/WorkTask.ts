import db from '../db';

export interface WorkTask {
  id: number;
  order_id: number;
  title: string;
  description?: string;
  status: string;
  deadline?: Date;
  created_at: Date;
  updated_at: Date;
}

export const WorkTaskModel = {
  async findById(id: number): Promise<WorkTask | null> {
    const { rows } = await db.query('SELECT * FROM work_tasks WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async findByOrderId(orderId: number): Promise<WorkTask[]> {
    const { rows } = await db.query('SELECT * FROM work_tasks WHERE order_id = $1', [orderId]);
    return rows;
  },

  async create(task: Omit<WorkTask, 'id' | 'created_at' | 'updated_at'>): Promise<WorkTask> {
    const { rows } = await db.query(
      'INSERT INTO work_tasks(order_id, title, description, status, deadline) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [task.order_id, task.title, task.description, task.status, task.deadline]
    );
    return rows[0];
  },

  async update(id: number, updates: Partial<WorkTask>): Promise<WorkTask | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && key !== 'id') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) return null;

    const { rows } = await db.query(
      `UPDATE work_tasks SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`,
      [...values, id]
    );
    return rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const { rowCount } = await db.query('DELETE FROM work_tasks WHERE id = $1', [id]);
    return rowCount > 0;
  }
};