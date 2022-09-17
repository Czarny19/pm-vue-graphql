-- "DATA_SOURCE" definition

-- Drop table

-- DROP TABLE "DATA_SOURCE";

CREATE TABLE "DATA_SOURCE" (
	id bigserial NOT NULL,
	address text NOT NULL,
	"name" text NOT NULL,
	user_id int8 NULL,
	create_date date NOT NULL DEFAULT now(),
	secret text NULL,
	CONSTRAINT "DATA_SOURCE_pkey" PRIMARY KEY (id)
);


-- "MUTATION" definition

-- Drop table

-- DROP TABLE "MUTATION";

CREATE TABLE "MUTATION" (
	id bigserial NOT NULL,
	data_source_id int8 NOT NULL,
	fields text NULL,
	"where" text NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"table" text NOT NULL,
	modify_date date NOT NULL DEFAULT now(),
	variables text NULL,
	CONSTRAINT "MUTATION_pkey" PRIMARY KEY (id)
);


-- "PAGE" definition

-- Drop table

-- DROP TABLE "PAGE";

CREATE TABLE "PAGE" (
	id bigserial NOT NULL,
	"name" text NOT NULL,
	modify_date date NOT NULL DEFAULT now(),
	definition jsonb NULL,
	project_id bigserial NOT NULL,
	params text NULL,
	CONSTRAINT "PAGE_pkey" PRIMARY KEY (id)
);


-- "PROJECT" definition

-- Drop table

-- DROP TABLE "PROJECT";

CREATE TABLE "PROJECT" (
	id bigserial NOT NULL,
	"name" text NOT NULL,
	description text NOT NULL,
	user_id int8 NOT NULL,
	create_date date NOT NULL DEFAULT now(),
	theme_id int8 NOT NULL,
	source_id int8 NULL,
	start_page int8 NULL,
	top_nav bool NOT NULL,
	top_nav_items jsonb NULL,
	running bool NULL,
	CONSTRAINT "PROJECT_pkey" PRIMARY KEY (id)
);


-- "PROP" definition

-- Drop table

-- DROP TABLE "PROP";

CREATE TABLE "PROP" (
	id bigserial NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	value text NULL,
	page_id int8 NOT NULL,
	type_display text NULL,
	CONSTRAINT "PROP_pkey" PRIMARY KEY (id)
);


-- "QUERY" definition

-- Drop table

-- DROP TABLE "QUERY";

CREATE TABLE "QUERY" (
	"name" text NOT NULL,
	"limit" int4 NULL DEFAULT 10,
	order_by text NULL,
	"where" text NULL,
	fields text NULL,
	data_source_id int8 NULL,
	"table" text NULL,
	modify_date date NOT NULL DEFAULT now(),
	id bigserial NOT NULL,
	variables text NULL,
	CONSTRAINT "QUERY_id_key" UNIQUE (id),
	CONSTRAINT "QUERY_pkey" PRIMARY KEY (id)
);


-- "THEME" definition

-- Drop table

-- DROP TABLE "THEME";

CREATE TABLE "THEME" (
	id bigserial NOT NULL,
	create_date date NOT NULL DEFAULT now(),
	"name" text NOT NULL,
	primary_color text NOT NULL,
	secondary_color text NOT NULL,
	accent_color text NOT NULL,
	info_color text NOT NULL,
	success_color text NOT NULL,
	error_color text NOT NULL,
	user_id int8 NOT NULL,
	text_color_1 text NOT NULL,
	text_color_2 text NOT NULL,
	background_color text NOT NULL,
	CONSTRAINT "THEME_pkey" PRIMARY KEY (id)
);


-- "USER" definition

-- Drop table

-- DROP TABLE "USER";

CREATE TABLE "USER" (
	id bigserial NOT NULL,
	email text NOT NULL,
	username text NOT NULL,
	CONSTRAINT "USER_email_key" UNIQUE (email),
	CONSTRAINT "USER_pkey" PRIMARY KEY (id)
);