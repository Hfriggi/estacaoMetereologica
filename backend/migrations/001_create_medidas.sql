
CREATE TABLE IF NOT EXISTS medidas (
    data TIMESTAMP NOT NULL,
    temp1 NUMERIC(5,2),
    temp2 NUMERIC(5,2),
    temp3 NUMERIC(5,2),
    temp4 NUMERIC(5,2),
    umid1 NUMERIC(5,2),
    umid2 NUMERIC(5,2),
    umid3 NUMERIC(5,2),
    press1 NUMERIC(7,2),
    press2 NUMERIC(7,2),
    press3 NUMERIC(7,2),
    lum NUMERIC(7,2),
    vel_vent NUMERIC(5,2),
    dir_vent NUMERIC(5,2)
);
