CREATE UNIQUE INDEX "Med_Doctor_pkey" ON public."Med_Doctor" USING btree (id);

CREATE UNIQUE INDEX "Med_Location_pkey" ON public."Med_Location" USING btree (id);

CREATE UNIQUE INDEX "Med_Pages_pkey" ON public."Med_Pages" USING btree (id);

CREATE UNIQUE INDEX "Med_Reservation_pkey" ON public."Med_Reservation" USING btree (id);

CREATE UNIQUE INDEX "Med_Appointments_pkey" ON public."Med_Appointments" USING btree (id);
