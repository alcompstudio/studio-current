ALTER TABLE order_stage_options
ADD COLUMN volume_unit_id INTEGER;

ALTER TABLE order_stage_options
ADD CONSTRAINT fk_volume_unit_id
FOREIGN KEY (volume_unit_id)
REFERENCES unit_os (id)
ON DELETE SET NULL
ON UPDATE CASCADE;
