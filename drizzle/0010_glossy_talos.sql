CREATE TABLE "api_query_measurements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"method" text NOT NULL,
	"path" text NOT NULL,
	"query" text NOT NULL,
	"duration_ms" double precision NOT NULL,
	"status" integer NOT NULL,
	"measured_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "api_query_measurements_path_idx" ON "api_query_measurements" USING btree ("path");--> statement-breakpoint
CREATE INDEX "api_query_measurements_measured_at_idx" ON "api_query_measurements" USING btree ("measured_at");--> statement-breakpoint
CREATE INDEX "api_query_measurements_method_path_idx" ON "api_query_measurements" USING btree ("method","path");