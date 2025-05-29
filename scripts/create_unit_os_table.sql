CREATE TABLE unit_os (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR NOT NULL,
    short_name VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO unit_os (full_name, short_name) VALUES
('Штуки', 'шт.'),
('Метры', 'м'),
('Квадратные метры', 'м²'),
('Кубические метры', 'м³'),
('Листы', 'л.'),
('Упаковки', 'уп.');
