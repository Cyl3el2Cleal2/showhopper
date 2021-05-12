import { Column, Entity } from "typeorm";

@Entity("disney", { schema: "public" })
export class Disney {
  @Column("character varying", { name: "imdb_id", nullable: true })
  imdbId: string | null;

  @Column("character varying", { name: "title", nullable: true })
  title: string | null;

  @Column("character varying", { name: "type", nullable: true })
  type: string | null;

  @Column("character varying", { name: "rated", nullable: true })
  rated: string | null;

  @Column("integer", { name: "year", nullable: true })
  year: number | null;

  @Column("integer", { name: "runtime", nullable: true })
  runtime: number | null;

  @Column("varchar", { name: "genre", nullable: true, array: true })
  genre: string[] | null;

  @Column("varchar", { name: "language", nullable: true, array: true })
  language: string[] | null;

  @Column("double precision", {
    name: "imdb_rating",
    nullable: true,
    precision: 53,
  })
  imdbRating: number | null;
}
