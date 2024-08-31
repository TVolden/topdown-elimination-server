import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") speed: number = 25;
  @type("number") f_x: number;
  @type("number") f_y: number;
  @type("number") ammo: number = 3;
  moveQueue: any;
  shootQueue: any;
  fireCooldown: number = 0;
}

export class Bullet extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") dir_x: number;
  @type("number") dir_y: number;
  @type("number") speed: number = 50;
  
  range_left: number = 300;
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: Bullet }) bullets = new MapSchema<Bullet>();
}
