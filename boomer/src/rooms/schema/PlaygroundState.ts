import { MapSchema, Schema, Context, type } from "@colyseus/schema";
import { Boomer } from "./Boomer";
import { Bomb } from "./Bomb"

export class PlaygroundState extends Schema {
  @type({ map: Boomer }) players = new MapSchema<Boomer>();
  @type({ map: Bomb }) bombs = new MapSchema<Bomb>();
}
