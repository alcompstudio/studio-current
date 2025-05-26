-- Создание таблицы order_stages
CREATE TABLE IF NOT EXISTS order_stages (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50),
  deadline TIMESTAMP,
  sequence INTEGER,
  color VARCHAR(7),
  work_type VARCHAR(50),
  estimated_price NUMERIC(10, 2),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_stages_order_id ON order_stages(order_id);

-- Создание таблицы order_stage_options
CREATE TABLE IF NOT EXISTS order_stage_options (
  id SERIAL PRIMARY KEY,
  order_stage_id INTEGER NOT NULL REFERENCES order_stages(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_calculable BOOLEAN DEFAULT FALSE,
  included_in_price BOOLEAN DEFAULT TRUE,
  calculation_formula VARCHAR(255),
  plan_units NUMERIC(10, 2),
  unit_divider NUMERIC(10, 2),
  price_per_unit NUMERIC(10, 2),
  calculated_plan_price NUMERIC(10, 2),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_stage_options_order_stage_id ON order_stage_options(order_stage_id);
