import { MapSchema, Schema, Context, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") speed: number = 5;
  @type("number") f_x: number;
  @type("number") f_y: number;
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
