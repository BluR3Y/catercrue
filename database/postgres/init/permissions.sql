USE catercrue;

-- Actions

CREATE TYPE action_types AS ENUM ('CREATE','READ','UPDATE','DELETE');

CREATE TABLE platform_actions (
    `id` INT(6) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `type` action_types NOT NULL
);

INSERT INTO platform_actions (`name`) VALUES
    ('Event', 'CREATE'),
    ('Event', 'READ'),
    ('Event', 'UPDATE'),
    ('Event', 'DELETE')
;

-- Staff

CREATE TABLE worker_roles (
    `id` INT(6) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `leader` BOOLEAN NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO worker_roles (`name`) VALUES
    ('Event Manager'),
    ('Assistant Manager'),
    ('Catering Manager'),
    ('Banquet Manager'),
    ('Executive Chef'),
    ('Sous Chef'),
    ('Line Cook'),
    ('Prep Cook'),
    ('Cook'),
    ('Bartender'),
    ('Host'),
    ('')
;