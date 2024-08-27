import { MapSchema, Schema, Context, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") speed: number = 25;
  @type("number") f_x: number;
  @type("number") f_y: number;

  ammo: number = 3;
  moveQueue: any;
  shootQueue: any;
}

export class Bullet extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") vel_x: number;
  @type("number") vel_y: number;
  
  range_left: number;
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: Bullet }) bullets = new MapSchema<Bullet>();
}
