import { Schema, type } from "@colyseus/schema";

export class Boomer extends Schema {
    @type("number") from_x: number;
    @type("number") from_y: number;
    @type("number") to_x: number;
    @type("number") to_y: number;
    @type("number") transfer: number = 1;
    @type("number") speed: number = 1;
    @type("number") ammo: number = 1;
    @type("number") range: number = 1;  
    moveQueue: any;
  
    update(deltaTime: number) {
      if (this.transfer < 1) {
        var t = this.transfer / this.speed;
        t += deltaTime;
        this.transfer = Math.min(1, t * this.speed);
      }
    
      if (this.moveQueue != null) {
        this.to_x = this.from_x + this.moveQueue.x;
        this.to_y = this.from_y + this.moveQueue.y;
        this.transfer = 0;
        this.moveQueue = null;
      }
    }
  }
  