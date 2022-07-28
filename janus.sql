\echo 'Delete and recreate janus db?'
\prompt 'Return for yes or control-C to cancel >' foo

DROP DATABASE janus;
CREATE DATABASE janus;
\connect janus;

\i janus-schema.sql

\echo 'Delete and recreate janus-test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE janus_test;
CREATE DATABASE janus_test;
\connect janus_test;

\i janus-schema.sql