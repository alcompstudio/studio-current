import db from '../db';

export interface OrderStage {
  id: number;
  order_id: number;
  title: string;
  description?: string;
  status: string;
  deadline?: Date;
  created_at: Date;
  updated_at: Date;
}

export const OrderStageModel = {
  async findById(id: number): Promise<OrderStage | null> {
    const { rows } = await db.query('SELECT * FROM order_stages WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async findByOrderId(orderId: number): Promise<OrderStage[]> {
    const { rows } = await db.query('SELECT * FROM order_stages WHERE order_id = $1', [orderId]);
    return rows;
  },

  async create(stage: Omit<OrderStage, 'id' | 'created_at' | 'updated_at'>): Promise<OrderStage> {
    const { rows } = await db.query(
      'INSERT INTO order_stages(order_id, title, description, status, deadline) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [stage.order_id, stage.title, stage.description, stage.status, stage.deadline]
    );
    return rows[0];
  },

  async update(id: number, updates: Partial<OrderStage>): Promise<OrderStage | null> {
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
      `UPDATE order_stages SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`,
      [...values, id]
    );
    return rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const { rowCount } = await db.query('DELETE FROM order_stages WHERE id = $1', [id]);
    return rowCount > 0;
  }
};