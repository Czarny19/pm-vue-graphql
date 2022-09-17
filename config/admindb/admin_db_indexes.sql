CREATE UNIQUE INDEX "DATA_SOURCE_pkey" ON public."DATA_SOURCE" USING btree (id);

CREATE UNIQUE INDEX "PAGE_pkey" ON public."PAGE" USING btree (id);

CREATE UNIQUE INDEX "PROJECT_pkey" ON public."PROJECT" USING btree (id);

CREATE UNIQUE INDEX "PROP_pkey" ON public."PROP" USING btree (id);

CREATE UNIQUE INDEX "QUERY_id_key" ON public."QUERY" USING btree (id);

CREATE UNIQUE INDEX "QUERY_pkey" ON public."QUERY" USING btree (id);

CREATE UNIQUE INDEX "THEME_pkey" ON public."THEME" USING btree (id);

CREATE UNIQUE INDEX "USER_email_key" ON public."USER" USING btree (email);

CREATE UNIQUE INDEX "USER_pkey" ON public."USER" USING btree (id);

CREATE UNIQUE INDEX "MUTATION_pkey" ON public."MUTATION" USING btree (id);
