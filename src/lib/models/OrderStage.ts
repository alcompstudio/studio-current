import db from '../db';

export interface OrderStage {
  id: string | number;
  order_id: string | number;
  title: string;
  description?: string;
  status: string;
  deadline?: Date;
  created_at: Date;
  updated_at: Date;
}

export const OrderStageModel = {
  async findById(id: string | number): Promise<OrderStage | null> {
    // Используем приведение типов в запросе, чтобы ID::text соответствовал формату из других запросов
    const [rows] = await db.sequelize.query('SELECT * FROM order_stages WHERE id::text = $1', {
      bind: [String(id)], // Явно преобразуем id в строку
      type: db.sequelize.QueryTypes.SELECT
    });
    return rows[0] || null;
  },

  async findByOrderId(orderId: string | number): Promise<OrderStage[]> {
    const [rows] = await db.sequelize.query('SELECT * FROM order_stages WHERE order_id::text = $1', {
      bind: [String(orderId)],
      type: db.sequelize.QueryTypes.SELECT
    });
    return rows;
  },

  async create(stage: Omit<OrderStage, 'id' | 'created_at' | 'updated_at'>): Promise<OrderStage> {
    const [rows] = await db.sequelize.query(
      'INSERT INTO order_stages(order_id, title, description, status, deadline) VALUES($1, $2, $3, $4, $5) RETURNING *',
      {
        bind: [stage.order_id, stage.title, stage.description, stage.status, stage.deadline],
        type: db.sequelize.QueryTypes.INSERT
      }
    );
    return rows[0];
  },

  async update(id: string | number, updates: Partial<OrderStage>): Promise<OrderStage | null> {
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
    
    values.push(id); // добавляем id в конец массива значений

    const [rows] = await db.sequelize.query(
      `UPDATE order_stages SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`,
      {
        bind: values,
        type: db.sequelize.QueryTypes.UPDATE
      }
    );
    return rows[0] || null;
  },

  async delete(id: string | number): Promise<boolean> {
    const [result] = await db.sequelize.query('DELETE FROM order_stages WHERE id = $1', {
      bind: [id],
      type: db.sequelize.QueryTypes.DELETE
    });
    return result && result.rowCount > 0;
  }
};